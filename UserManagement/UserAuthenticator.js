const { DatabaseController } = require('../common/DatabaseController');
const {PubSubIface} = require('../common/PubSub');

class UserIface extends PubSubIface {
    constructor(
      downstream_callback, topic_name='user', projectId = 'silken-tenure-419721'
    ) {
      super(topic_name, projectId);
      this.downstream_callback = downstream_callback;
    }
  
    async setupTopics(topics) {
      await super.setupTopics(topics);
      this.downstream_sub = await this.getSubscriptionByName(this.downstream_topic, this.downstream_sub_name);
      this.subs.push(this.downstream_sub);
  
      this.subscribe_to_downstream(this.downstream_callback);
    }
  
    subscribe_to_downstream(callback) {
      this.downstream_sub.on('message', message => callback(message));
    }
  
  }
class UserAuthenticator {
    constructor() {
        this.databaseController = new DatabaseController();
        this.userIface = new UserIface(this.askForUserResponse);
    }
    
    askForUserResponse = async (message) => {
        console.log("PubSub triggered - receiving: ", message.data.toString());
        message.ack();
        const json_usr = JSON.parse(message.data.toString());
        const message_code =json_usr.message_code;
        var jsonString = "response not found";
        if(message_code == 0){
            const new_user_response = await this.addNewUser(json_usr.name,json_usr.email,json_usr.password, json_usr.recovery_pin, json_usr.access_level);
            jsonString = JSON.stringify(new_user_response);
        }
        if(message_code == 1){
            const login_response = await this.loginUser(json_usr.email, json_usr.password);
            jsonString = JSON.stringify(login_response);
        }
        if(message_code == 2){
            const change_password_response = await this.changePassword(json_usr.email, json_usr.password, json_usr.recovery_pin)
            jsonString = JSON.stringify(change_password_response);
        }
        if(message_code == 3){
            const access_level_response = await this.changeAccessLevel(json_usr.admin_email, json_usr.admin_password, json_usr.permit_email, json_usr.access_level)
            jsonString = JSON.stringify(access_level_response);
        }
        if(message_code == 4){
            const delete_response = await this.deleteUser(json_usr.email, json_usr.password);
            jsonString = JSON.stringify(delete_response);
        }
        
        console.log("PubSub triggered - sending: ", jsonString);
        await this.userIface.upstream_topic.publishMessage({data:Buffer.from(jsonString)})


    }
    async loginUser(email, password){
        const encrypted_email = btoa(email);
        const encrypted_password = btoa(password);
        const db_user = await this.databaseController.getUser(encrypted_email, encrypted_password);
        
        if(!db_user){
            return {'status': 401,
                    'data': "Error: No se encontro un usuario con esa direccion de correo"};
        }
        if (encrypted_password == db_user.password){
            return {'status': 202,
                    'data': db_user};
        }else{
            return {'status': 401,
                    'data':"Error: Contrasenna incorrecta"};
        }

    
    }

    async addNewUser(name, email, password, pin,access_level){
        const encrypted_email = btoa(email);
        const encrypted_password = btoa(password);
        //check if user exists
        const db_user = await this.databaseController.getUser(encrypted_email, encrypted_password);
        if(!db_user){
            const data = {
                name: name,
                email: encrypted_email,
                password: encrypted_password,
                access_level: access_level,
                recovery_pin: btoa(pin)
                };
            const added_usr = await this.databaseController.addUser(data);
            return {'status': 201,
                    'data':added_usr};
        }else{
            return {'status': 401,
                    'data':"Error: Usuario con ese correo ya existe"};
        }


    }

    async changePassword(email, password, pin){
        const encrypted_email = btoa(email);
        const encrypted_password = btoa(password);
        const encrypted_pin = btoa(pin);
        const db_user = await this.databaseController.updateUserPassword(encrypted_email, encrypted_pin, encrypted_password);
        if(db_user===null){
            return  {'status': 401,
                    'data':"Error: usuario incorrecto"};
        }else if(db_user == 1){
            return  {'status': 200,
                    'data':"Se ha cambiado la contrasenna"};
        }else if(db_user == 0){
            return  {'status': 401,
                    'data':"Error: El pin es incorrecto, no se pudo cambiar la contrasenna"};
        }
        else{
            return  {'status': 200,
                    'data':db_user};
        }

    }

    async changeAccessLevel(admin_email,admin_password, permit_email, access_level){
        const encrypted_email = btoa(admin_email);
        const encrypted_password = btoa(admin_password);
        const encrypted_permit_email = btoa(permit_email);
        const db_user = await this.databaseController.getUser(encrypted_email, null);
        if(!db_user){
            return  {'status': 401,
                    'data':"Error: No se encontro un usuario con esa direccion de correo"};
        }
        if (db_user.access_level==="admin" ){
            if(db_user.password===encrypted_password){
                const updated_user = await this.databaseController.updateUserPermit(encrypted_permit_email,access_level)
                return  {'status': 200,
                        'data':updated_user};
            }else{
                return  {'status': 401,
                        'data':"Error: Password incorrecto"};
            }   
        }else{
            return  {'status': 401,
                    'data':"Error: User no es un admin"};
        }
    }
    async deleteUser(email, password){
        const encrypted_email = btoa(email);
        const encrypted_password = btoa(password);
        const db_user = await this.databaseController.getUser(encrypted_email, null);
        if(!db_user){
            return  {'status': 401,
                    'data':"Error: No se encontro un usuario con esa direccion de correo"};
        }
        if(db_user.password===encrypted_password){
            const deleted_user = await this.databaseController.deleteUser(encrypted_email, encrypted_password);
            return  {'status': 200,
                    'data': deleted_user};
        }else{
            return  {'status': 401,
                    'data':"Error: Password incorrecto"};
        } 

    }

}

userAuth = new UserAuthenticator();
module.exports = { UserAuthenticator }

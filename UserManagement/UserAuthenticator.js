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
        this.user_interface = new UserIface(this.askForUserResponse);
    }
    
    askForUserResponse = async (message) => {
        console.log(message.data.toString());
        message.ack();
        const json_usr = JSON.parse(message.data.toString());
        const login_response = this.loginUser(json_usr.email, json_usr.password);
        const jsonString = JSON.stringify(login_response);
        await this.userIface.upstream_topic.publishMessage({data:Buffer.from(jsonString)})


    }
    async loginUser(email, password){
        const encrypted_email = btoa(email);
        const encrypted_password = btoa(password);
        const db_user = await this.databaseController.getUser(encrypted_email, encrypted_password);
        
        if(!db_user){
            return "Error: No se encontro un usuario con esa direccion de correo"
        }
        if (encrypted_password == db_user.password){
            return db_user;
        }else{
            return "Error: Contrasenna incorrecta"
        }

    
    }

    async addUser(email, password, pin){
        const encrypted_email = btoa(email);
        const encrypted_password = btoa(password);
        //check if user exists
        const db_user = await this.databaseController.getUser(encrypted_email, encrypted_password);
        if(!db_user){
            const data = {
                email: encrypted_email,
                password: encrypted_password,
                access_level: 'regular',
                recovery_pin: btoa(pin)
                };
            const added_usr = await this.databaseController.addUser(data);
            return added_usr
        }else{
            return "Error: Usuario con ese correo ya existe"
        }


    }

    async changePassword(){

    }

    async changeAccessLevel(){

    }

}
// async function test(){
//     usrAuth = new UserAuthenticator();
//     const test = await usrAuth.addUser("nati3@gmail.com", "1234", '1234');
//     console.log(test);
// }
// test();
module.exports = { UserAuthenticator }


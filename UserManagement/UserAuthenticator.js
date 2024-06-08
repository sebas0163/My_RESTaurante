const { DatabaseController } = require('./DatabaseController');

class UserAuthenticator {
    constructor() {
        this.databaseController = new DatabaseController();
    }
    
   /* The `askForUserResponse` method in the `UserAuthenticator` class is responsible for handling
   different types of user requests based on the `message_code` provided in the `json_usr` object.
   Here's a breakdown of what it does: */
    async askForUserResponse (json_usr) {
        
        const message_code =json_usr.message_code;
        var jsonString = JSON.stringify({'status': 202,
                        'data': ":o"});
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
        
        console.log(" - sending: ",jsonString);
		return jsonString


    }
    /**
     * The function `loginUser` takes an email and password, encrypts them, retrieves a user from a
     * database, and returns a status and data based on the authentication result.
     * 
     * @param email The `email` parameter is the email address entered by the user for logging in.
     * @param password The `password` parameter in the `loginUser` function is the user's password that
     * they input when trying to log in. This password is then encrypted using the `btoa` function
     * before being compared with the encrypted password stored in the database for the user.
     * 
     * @return The `loginUser` function is returning an object with a `status` and `data` property. The
     * possible return values are:
     */
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

    /**
     * The function `addNewUser` in JavaScript asynchronously adds a new user to a database after
     * encrypting their email, password, and recovery pin, checking for existing users based on
     * encrypted email and password.
     * 
     * @param name The `name` parameter in the `addNewUser` function refers to the name of the user
     * being added to the system.
     * @param email The `email` parameter in the `addNewUser` function is the email address of the user
     * that you want to add to the system.
     * @param password The `addNewUser` function you provided is an asynchronous function that adds a
     * new user to a database. It takes in several parameters including `name`, `email`, `password`,
     * `pin`, and `access_level`.
     * @param pin The `pin` parameter in the `addNewUser` function is used to store a recovery PIN for
     * the user. This PIN can be used for account recovery or verification purposes. It is encoded
     * using the `btoa` function before being stored in the database.
     * @param access_level The `access_level` parameter in the `addNewUser` function represents the
     * level of access or permissions that the user will have within the system. It is used to define
     * the user's role or privileges, such as admin, regular user, guest, etc. This parameter helps in
     * controlling what actions
     * 
     * @return The `addNewUser` function returns an object with a `status` and `data` property.
     */
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

    /**
     * The function `changePassword` asynchronously updates a user's password in a database after
     * encoding the email, password, and pin.
     * 
     * @param email The `changePassword` function you provided is an asynchronous function that takes
     * in three parameters: `email`, `password`, and `pin`. The function then encrypts the email,
     * password, and pin using the `btoa` function, and then calls the `updateUserPassword` method from
     * the
     * @param password The `changePassword` function you provided is an asynchronous function that
     * takes in three parameters: `email`, `password`, and `pin`. The function then encrypts the email,
     * password, and pin using the `btoa` function, and calls the `updateUserPassword` method from the
     * `
     * @param pin The `changePassword` function you provided seems to be updating a user's password in
     * a database after encoding the email, password, and pin using base64 encoding. The function then
     * checks the result of the update operation and returns a response object based on the outcome.
     * 
     * @return The `changePassword` function returns an object with a `status` and `data` property
     * based on the conditions met during the password change process.
     */
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

   /**
    * The function `changeAccessLevel` allows an admin user to update the access level of another user
    * in a database after authentication.
    * 
    * @param admin_email The `admin_email` parameter is the email address of the admin user who is
    * trying to change the access level of another user.
    * @param admin_password The `admin_password` parameter in the `changeAccessLevel` function is the
    * password of the admin user who is trying to change the access level of another user.
    * @param permit_email The `permit_email` parameter in the `changeAccessLevel` function refers to
    * the email address of the user whose access level is being changed.
    * @param access_level The `access_level` parameter in the `changeAccessLevel` function refers to
    * the level of access or permissions that you want to assign to the user with the specified email
    * address (`permit_email`). This access level could be a string value such as "admin", "user",
    * "moderator", etc
    * 
    * @return The function `changeAccessLevel` returns an object with a `status` and `data` property.
    * The possible return values are:
    */
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
   /**
    * This JavaScript function deletes a user from a database after verifying their email and password.
    * 
    * @param email The `deleteUser` function you provided is an asynchronous function that deletes a
    * user from the database based on the provided email and password. It first encrypts the email and
    * password using the `btoa` function, then checks if a user with the encrypted email exists in the
    * database. If the user
    * @param password The `password` parameter in the `deleteUser` function is the password of the user
    * account that you want to delete. This password will be encrypted using the `btoa` function before
    * being compared with the encrypted password stored in the database. If the passwords match, the
    * user account will be deleted
    * 
    * @return The `deleteUser` function returns an object with a `status` and `data` property. The
    * possible return values are:
    */
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

module.exports = { UserAuthenticator }

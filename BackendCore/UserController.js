const axios = require('axios');
const jwt = require('jsonwebtoken');
class UserController{
    constructor() {
        this.secretKey = 'SuperOdontologosAvanzados';
        this.verifyUserLogin = this.verifyUserLogin.bind(this);
        this.changeAccess = this.changeAccess.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.addNewUser = this.addNewUser.bind(this);
      }
   /**
    * The function `addNewUser` takes user input, creates a user object, and then retrieves user data
    * using the user interface.
    * 
    * @param req The `req` parameter typically represents the request object in Node.js applications.
    * It contains information about the HTTP request that triggered the function, such as request
    * headers, parameters, body, and more. In this context, `req` is used to extract data like name,
    * email, password, access level
    * @param res The `res` parameter in the `addNewUser` function is typically the response object that
    * will be sent back to the client making the request. It is used to send a response back to the
    * client with the appropriate status code and data. In this case, the function is likely creating a
    * new
    */
    addNewUser(req, res){
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const access_level = req.body.access_level;
      const recovery_pin = req.body.recovery_pin;

      const targetServiceUrl = 'http://localhost:1234/usr/user/create'; 
      
      axios.post(targetServiceUrl, {
        "name" : name,
        "email":email,
        "password":password,
        "access_level":access_level,
        "recovery_pin":recovery_pin
      })
      .then(response => {
        const token = jwt.sign({ email: email, password: password }, secretKey, { expiresIn: '1h' });
        console.log('Response from target service:', response.data);
        res.status(response.status).json(response.data, token);
      })
      .catch(error => {
        res.status(error.response.status).json(error.response.data);
      });
      
      
    }
    /**
     * The function `verifyUserLogin` takes user email and password from a request, retrieves user data
     * using the email and password, and sends the response back.
     * 
     * @param req The `req` parameter typically represents the request object in a Node.js application.
     * It contains information about the HTTP request that triggered the function, such as request
     * headers, parameters, body, and query parameters. In this specific function `verifyUserLogin`,
     * `req` seems to be used to extract the
     * @param res The `res` parameter in the `verifyUserLogin` function is typically the response
     * object in Node.js Express framework. It is used to send a response back to the client making the
     * request.
     */
    verifyUserLogin(req, res){
      
      const email = req.query.email;
      const user_password = req.query.password;
      
      const targetServiceUrl = 'http://localhost:1234/usr/user/login'; 
      
      axios.get(`${targetServiceUrl}?email=${email}&password=${user_password}`)
      .then(response => {
        const token = jwt.sign({ email: email, password: user_password }, this.secretKey, { expiresIn: '1h' });
        console.log('Response from target service:', response.data);
        res.status(response.status).json({ ...response.data, token});
      })
      .catch(error=>{
        console.log('Response from target service:', error);
        res.status(error.response.status).json(error.response.data);
      })
    }
      
    /**
     * The function `changePassword` takes in user input for email, password, and recovery pin, then
     * retrieves user data and updates the password.
     * 
     * @param req The `req` parameter typically represents the HTTP request object, which contains
     * information about the incoming request such as headers, parameters, body, etc. It is commonly
     * used in web development to access data sent by the client to the server.
     * @param res The `res` parameter in the `changePassword` function is typically the response object
     * that is used to send a response back to the client making the request. It is commonly used to
     * set the status code and send data back in the response.
     */
    changePassword(req, res){
      const email = req.body.email;
      const password = req.body.password;
      const recovery_pin = req.body.recovery_pin;
      
      const targetServiceUrl = 'http://localhost:1234/usr/user/change_password'; 
      axios.put(targetServiceUrl, {
        "email":email,
        "password":password,
        "recovery_pin":recovery_pin
      })
      .then(response => {
        console.log('Response from target service:', response.data);
        res.status(response.status).json(response.data);
      })
      .catch(error => {
        res.status(error.response.status).json(error.response.data);
      });
    }
    /**
     * The function `changeAccess` takes in request and response objects, extracts necessary data, and
     * uses it to update user access level through a user interface method.
     * 
     * @param req The `req` parameter typically represents the HTTP request object, which contains
     * information about the incoming request such as headers, parameters, body, etc.
     * @param res The `res` parameter in the `changeAccess` function is typically the response object
     * that is used to send a response back to the client making the request. It is commonly used to
     * set the status code and send data back in the response.
     */
    changeAccess(req, res){
      const admin_email = req.body.admin_email;
      const admin_password = req.body.admin_password;
      const permit_email = req.body.permit_email;
      const access_level = req.body.access_level;
      
      const targetServiceUrl = 'http://localhost:1234/usr/user/change_access'; 
      axios.put(targetServiceUrl, {
        "admin_email": admin_email,
        "admin_password": admin_password,
        "permit_email":permit_email,
        "access_level": access_level
      })
      .then(response => {
        console.log('Response from target service:', response.data);
        res.status(response.status).json(response.data);
      })
      .catch(error => {
        res.status(error.response.status).json(error.response.data);
      });
    }
    /**
     * The function deleteUser takes a request and response object, retrieves user information based on
     * email and password, and sends the response with the user data.
     * 
     * @param req The `req` parameter typically represents the HTTP request object, which contains
     * information about the incoming request such as headers, parameters, body, etc. It is commonly
     * used in web development to access data sent by the client to the server.
     * @param res The `res` parameter in the `deleteUser` function is typically the response object
     * that is used to send a response back to the client making the request. It is commonly used to
     * set the status code and send data back in the response.
     */
    deleteUser(req, res){
      const email = req.body.email;
      const password = req.body.password;
      
      const targetServiceUrl = 'http://localhost:1234/usr/user/delete'; 
      axios.delete(targetServiceUrl, {
        "email":email,
        "password":password
      })
      .then(response => {
        console.log('Response from target service:', response.data);
        res.status(response.status).json(response.data);
      })
      .catch(error => {
        res.status(error.response.status).json(error.response.data);
      });
    }

}

module.exports = { UserController };
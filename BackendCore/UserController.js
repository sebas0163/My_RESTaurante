
const {PubSubIface} = require('../common/PubSub');


class UserIface extends PubSubIface{
    constructor(topic_name='user', projectId='silken-tenure-419721'){
      super(topic_name, projectId);
    }
  
    async setupTopics(topics) {
      await super.setupTopics(topics);
      await this.create_upstream_sub();
    }
  
    async create_upstream_sub() {
      this.upstream_sub = await this.getSubscriptionByName(this.upstream_topic, this.upstream_sub_name);
      this.subs.push(this.upstream_sub);
      console.log("Created the upstream sub");
    }
  
    waitForResponseOnUpstream() {
      return new Promise(async (resolve, reject) => {
        const responseListener = async (response) => {
          response.ack();
          resolve(response);
        }
  
        const errorListener = async (response) => {
          response.ack();
          reject(response);
        }
  
        this.upstream_sub.on('message', responseListener);
        this.upstream_sub.on('error', errorListener);
      })
    }
  
  
    async getUser(message) {
        
      this.downstream_topic.publishMessage({data:Buffer.from(JSON.stringify(message))});
      const upstream_res = await this.waitForResponseOnUpstream();
      console.log("Got upstream res");
      return JSON.parse(upstream_res.data.toString());
    }
  
  
  }

class UserController{
    constructor() {
        this.user_interface = new UserIface();
        this.verifyUserLogin = this.verifyUserLogin.bind(this);
        this.changeAccess = this.changeAccess.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.addNewUser = this.addNewUser.bind(this);
      }
    addNewUser(req, res){
      const name = req.body.name;
      const email = req.body.email;
      const password = req.body.password;
      const access_level = req.body.access_level;
      const recovery_pin = req.body.recovery_pin;
      const user_obj = {"message_code": 0,
        "name" : name,
        "email":email,
        "password":password,
        "access_level":access_level,
        "recovery_pin":recovery_pin
      }
      this.user_interface.getUser(user_obj).then((user_res) => {
        res.status(user_res.status).json(user_res.data);
      });
    }
    verifyUserLogin(req, res){
      const email = req.body.email;
      const user_password = req.body.password;
      const user_obj = {'message_code':1,
        'email' : email,
        'password' : user_password
      }
      this.user_interface.getUser(user_obj).then((user_res) => {
          res.status(user_res.status).json(user_res.data);
      });
    }
    changePassword(req, res){
      const email = req.body.email;
      const password = req.body.password;
      const recovery_pin = req.body.recovery_pin;
      const user_obj = {"message_code": 2,
        "email":email,
        "password":password,
        "recovery_pin":recovery_pin
      }
      this.user_interface.getUser(user_obj).then((user_res) => {
          res.status(user_res.status).json(user_res.data);
      });
    }
    changeAccess(req, res){
      const admin_email = req.body.admin_email;
      const admin_password = req.body.admin_password;
      const permit_email = req.body.permit_email;
      const access_level = req.body.access_level;
      const user_obj = {"message_code": 3,
        "admin_email": admin_email,
        "admin_password": admin_password,
        "permit_email":permit_email,
        "access_level": access_level
      }
      this.user_interface.getUser(user_obj).then((user_res) => {
          res.status(user_res.status).json(user_res.data);
      });
    }
    deleteUser(req, res){
      const email = req.body.email;
      const password = req.body.password;
      const user_obj = {"message_code": 4,
        "email":email,
        "password":password
      }
      this.user_interface.getUser(user_obj).then((user_res) => {
          res.status(user_res.status).json(user_res.data);
      });
    }

}

module.exports = { UserController };
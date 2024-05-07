const {DatabaseController} = require('../common/DatabaseController');
const {PubSubIface} = require('../common/PubSub');

class User{
    constructor(user_email, password){
        this.user_email = user_email;
        this.password = password;
    }
}
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
      }
    
    verifyUserLogin(req, res){
        const user_email = req.body.email;
        const user_password = req.body.password;
        const user_obj = new User(user_email, user_password);
        this.user_interface.getUser(user_obj).then((user_res) => {
            res.json(user_res);
        });
    }
}

module.exports = { UserController };
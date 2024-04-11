const moment = require('moment');
const {PubSubIface} = require('../common/PubSub');

class DishRes {
  constructor(errorCode, dish1, dish2) {
    this.errorCode = errorCode;
    this.dish1 = dish1;
    this.dish2 = dish2;
  }
}

class DishIface extends PubSubIface{
  constructor(topic_name='dish', projectId='silken-tenure-419721'){
    super(topic_name, projectId);
  }

  async setupTopics(topics) {
    await super.setupTopics(topics);
  }

  async create_upstream_sub() {
    this.upstream_sub = await this.getSubscriptionByName(this.upstream_topic, this.upstream_sub_name);
    this.subs.push(this.upstream_sub);
    console.log("Created the upstream sub");
  }

  async delete_upstream_sub() {
    const sub_name = this.upstream_sub.name;
    await this.upstream_sub.delete();
    this.subs = this.subs.filter(sub => sub.name != sub_name);
    console.log("Deleted upstream sub");
  }

  waitForResponseOnUpstream() {
    return new Promise(async (resolve, reject) => {
      await this.create_upstream_sub();

      const responseListener = async (response) => {
        await this.delete_upstream_sub();
        resolve(response);
      }

      const errorListener = async (response) => {
        await this.delete_upstream_sub();
        reject(response);
      }

      this.upstream_sub.on('message', responseListener);
      this.upstream_sub.on('error', errorListener);
    })
  }

  async askSchedule(day) {
    this.downstream_topic.publishMessage({data:Buffer.from(day)});
    const upstream_res = await this.waitForResponseOnUpstream();
    console.log("Got upstream res");
    return upstream_res.data.toString();
  }

  async getAllMenu(message) {
    this.downstream_topic.publishMessage({data:Buffer.from(message)});
    const upstream_res = await this.waitForResponseOnUpstream();
    console.log("Got upstream res");
    return upstream_res.data.toString();
  }

}

class DishController {
  constructor() {
    this.getAllMenu = this.getAllMenu.bind(this);
    this.dishIface = new DishIface();
  }

  getAllMenu(req, res) {
    message = ''
    
    this.dishIface.getAllMenu(message).then((time_res) => {
              res.json(time_res);
    });
  }

//   askSchedule(req, res) {
//     const dateString = req.body.day;

//     this.dishIface.askSchedule(dateString).then((time_res) => {
//       res.json(time_res);
//     });

//   }

}

module.exports = { DishController }
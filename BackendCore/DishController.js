const moment = require('moment');
const {PubSubIface} = require('../common/PubSub');

class DishRes {
  constructor(errorCode, dish1, dish2) {
    this.errorCode = errorCode;
    this.dish1 = dish1;
    this.dish2 = dish2;
  }
}

class DishReq {
    constructor( dish1, dish2) {
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


  async getAllMenu(message) {
    this.downstream_topic.publishMessage({data:Buffer.from(message)});
    const upstream_res = await this.waitForResponseOnUpstream();
    console.log("Got upstream res");
    return JSON.parse(upstream_res.data.toString());
  }

  async askForDish(DishReq) {
    const messageBuffer = Buffer.from(JSON.stringify(DishReq));
    this.downstream_topic.publishMessage({data:messageBuffer});
    const upstream_res = await this.waitForResponseOnUpstream();
    console.log("Got upstream res");
    return JSON.parse(upstream_res.data.toString());
  }

}

class DishController {
  constructor() {
    this.getAllMenu = this.getAllMenu.bind(this);
    this.dishIface = new DishIface();
    this.askForDish = this.askForDish.bind(this);
  }

  getAllMenu(req, res) {

    const message = req.body.message || req.query.message || 'default message';

    this.dishIface.getAllMenu(message).then((time_res) => {
            res.json(time_res);
    });

  }

  askForDish(req, res) {
    const dish1 = req.body.dish1;
    const dish2 = req.body.dish2;

    const dishReq = new DishReq(dish1,dish2);

    console.log(dishReq);

    this.dishIface.askForDish(dishReq).then((time_res) => {
        res.json(time_res);
    });

  } 

}

module.exports = { DishController }
const moment = require('moment');
const {PubSubIface} = require('../DB/PubSub');

class TimeRes {
  constructor(errorCode, schedule) {
    this.errorCode = errorCode;
    this.schedule = schedule;
  }
}

class TimeIface extends PubSubIface{
  constructor(topic_name='time', projectId='silken-tenure-419721'){
    super(topic_name, projectId);
  }

  async setupTopics(topics) {
    await super.setupTopics(topics);
    await this.create_upstream_sub();
  }

  async create_upstream_sub() {
    this.upstream_sub = await this.getSubscriptionByName(this.upstream_topic, this.upstream_sub_name);
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

  /**
   * The function `askSchedule` asynchronously sends a message with the given day, waits for a response
   * on the upstream, and returns the parsed JSON response.
   * 
   * @param day The `day` parameter in the `askSchedule` function represents the day for which you want
   * to retrieve a schedule. It is used to publish a message to a downstream topic and then wait for a
   * response on the upstream before parsing and returning the received data.
   * 
   * @return The `askSchedule` function is returning the avalaible times
   */
  async askSchedule(day) {
    this.downstream_topic.publishMessage({data:Buffer.from(day)});
    const upstream_res = await this.waitForResponseOnUpstream();
    console.log("Got upstream res");
    return JSON.parse(upstream_res.data.toString());
  }
}

/* The `class TimeController` is a JavaScript class that serves as a controller for handling requests
related to time schedules. */
class TimeController {
  constructor() {
    this.askSchedule = this.askSchedule.bind(this);
    this.timeIface = new TimeIface();
  }

  askSchedule(req, res) {
    const dateString = req.body.day;

    this.timeIface.askSchedule(dateString).then((time_res) => {
      res.json(time_res);
    });

  }

}

module.exports = { TimeController }




// Imports the Google Cloud client library
const {PubSubIface} = require('../common/PubSub');
const {DatabaseController} = require('../common/DatabaseController');
const moment = require('moment');

class TimeIface extends PubSubIface {
  constructor(
    downstream_callback, topic_name='time', projectId = 'silken-tenure-419721'
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

class TimeCore{
  constructor() {
    this.timeIface = new TimeIface(this.simple_callback);
    this.databaseController = new DatabaseController();
  }

  simple_callback  = async (message) => {
    console.log('Received message:', message.data.toString());
    message.ack();

    const day = moment(message.data.toString(), "DD/MM/YYYY");
    const days =  await this.databaseController.get_available_schedule(day);

    const jsonString = JSON.stringify(days);

    console.log("Schedule response for upstream");
    await this.timeIface.upstream_topic.publishMessage({data:Buffer.from(jsonString)})
  }
}

timeCore = new TimeCore()

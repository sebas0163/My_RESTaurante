// Imports the Google Cloud client library
const {PubSubIface} = require('../common/PubSub');
const {DatabaseController} = require('../common/DatabaseController');
const moment = require('moment');

class TimeCore{
  constructor() {
    this.databaseController = new DatabaseController();
    this.pubSubHandler = new PubSubSender("time-upstream");
  }

  async process_message(msg_str) {
    const day = moment(message.data.toString(), "DD/MM/YYYY");
    const days =  await this.databaseController.get_available_schedule(day);

    const jsonString = JSON.stringify(days);

    console.log("Schedule response for upstream");
    await this.pubSubHandler.send_message(jsonString);
  }

}

entry_function = async (cloud_message) => {
	const pubsub_message = cloud_message.data.message;
	// If local, uncomment
	// pubsub_message.ack()
	const timeCore = new TimeCore();
	const msg_payload_str = Buffer.from(pubsub_message.data, "base64").toString();
	await timeCore.process_message(msg_payload_str);
};

timeCore = new TimeCore()

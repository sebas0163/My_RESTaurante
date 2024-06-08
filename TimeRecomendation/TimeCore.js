// Imports the Google Cloud client library
const {PubSubSender} = require('../common/PubSub');
const {DatabaseController} = require('../common/DatabaseController');
const moment = require('moment');

class TimeCore{
  constructor() {
    this.databaseController = new DatabaseController();
    this.pubSubHandler = new PubSubSender("time-upstream");
  }

  async process_message() {
    const days =  await this.databaseController.get_available_schedule();

    const jsonString = JSON.stringify(days);

    console.log("Schedule response for upstream");
    await this.pubSubHandler.send_message(jsonString);
  }
}

entry_function = async (cloud_message) => {
	const pubsub_message = cloud_message.data.message;
	// If local, uncomment
	pubsub_message.ack()
	const timeCore = new TimeCore();
	await timeCore.process_message();
};


module.exports = {entry_function};


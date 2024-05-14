const { PubSub } = require("@google-cloud/pubsub");

class PubSubSender {
	constructor(topic_name) {
		this.pubSubClient = new PubSub();
		this.topic = this.pubSubClient.topic(topic_name);
	}

	send_message(str_msg) {
		const dataBuffer = Buffer.from(str_msg);
		this.topic.publishMessage({ data: dataBuffer });
		console.log("Sent a pubsub message to topic: " + this.topic.name);
	}
}

class PubSubReceiver {
	constructor(topic_name, subscription_name) {
		this.pubSubClient = new PubSub();
		this.subscription = this.pubSubClient
			.topic(topic_name)
			.subscription(subscription_name);
	}

	waitForResponse() {
		return new Promise((resolve, reject) => {
			const responseListener = (response) => {
				response.ack();
				this.subscription.removeListener("message", responseListener);
				this.subscription.removeListener("error", errorListener);

				console.log("Received a success msg from PubSub! Returning to caller.");
				resolve(response.data.toString());
			};

			const errorListener = (error) => {
				this.subscription.removeListener("message", responseListener);
				this.subscription.removeListener("error", errorListener);

				console.log("Received an error. Propagating...");
				reject(error);
			};

			console.log("Will start waiting for a new pubsub msg...");
			this.subscription.on("message", responseListener);
			this.subscription.on("error", errorListener);
		});
	}

	waitForRawResponse() {
		return new Promise((resolve, reject) => {
			const responseListener = (response) => {
				this.subscription.removeListener("message", responseListener);
				this.subscription.removeListener("error", errorListener);

				console.log("Received a success msg from PubSub! Returning to caller.");
				resolve(response);
			};

			const errorListener = (error) => {
				this.subscription.removeListener("message", responseListener);
				this.subscription.removeListener("error", errorListener);

				console.log("Received an error. Propagating...");
				reject(error);
			};

			console.log("Will start waiting for a new pubsub msg...");
			this.subscription.on("message", responseListener);
			this.subscription.on("error", errorListener);
		});
	}

	async pull_single_message() {
		return await this.waitForResponse();
	}

	async pull_single_raw_message() {
		return await this.waitForRawResponse();
	}
}

class PubSubReceiverSender {
	constructor(sender_topic_name, receiver_topic_name, subscription_name) {
		this.sender = new PubSubSender(sender_topic_name);
		this.receiver = new PubSubReceiver(receiver_topic_name, subscription_name);
	}

	async pull_single_message() {
		return await this.receiver.pull_single_message();
	}

	send_message(str_msg) {
		this.sender.send_message(str_msg);
	}
}

module.exports = { PubSubSender, PubSubReceiver, PubSubReceiverSender };

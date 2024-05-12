const moment = require("moment");
const { PubSubReceiverSender } = require("../common/PubSub");

class DishRes {
	constructor(errorCode, dish1, dish2) {
		this.errorCode = errorCode;
		this.dish1 = dish1;
		this.dish2 = dish2;
	}
}

class DishReq {
	constructor(dish1, dish2) {
		this.dish1 = dish1;
		this.dish2 = dish2;
	}
}

class DishIface {
	constructor(
		sender_topic_name = "food-downstream",
		receiver_topic_name = "food-upstream",
		subscription_name = "BackendCore-sub",
	) {
		this.pubSubHandler = new PubSubReceiverSender(
			sender_topic_name,
			receiver_topic_name,
			subscription_name,
		);
	}

	async getAllMenu(message) {
		this.pubSubHandler.send_message(message);
		const upstream_res = await this.pubSubHandler.pull_single_message();
		console.log("Got upstream res");
		return JSON.parse(upstream_res);
	}

	async askForDish(DishReq) {
		const messageStr = JSON.stringify(DishReq);
		this.pubSubHandler.send_message(messageStr);
		const upstream_res = await this.pubSubHandler.pull_single_message();
		console.log("Got upstream res");
		return JSON.parse(upstream_res);
	}
}

class DishController {
	constructor() {
		this.getAllMenu = this.getAllMenu.bind(this);
		this.dishIface = new DishIface();
		this.askForDish = this.askForDish.bind(this);
	}

	getAllMenu(req, res) {
		const message = req.body.message || req.query.message || "default message";

		this.dishIface.getAllMenu(message).then((time_res) => {
			res.json(time_res);
		});
	}

	askForDish(req, res) {
		const dish1 = req.body.dish1;
		const dish2 = req.body.dish2;

		const dishReq = new DishReq(dish1, dish2);

		console.log(dishReq);

		this.dishIface.askForDish(dishReq).then((time_res) => {
			res.json(time_res);
		});
	}
}

module.exports = { DishController };
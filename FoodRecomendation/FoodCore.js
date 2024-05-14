const { DatabaseController } = require("../common/DatabaseController");
const { PubSubSender } = require("../common/PubSub");
const { FoodMatcher } = require("./FoodMatcher");

class FoodCore {
	constructor() {
		this.databaseController = new DatabaseController();
		this.foodMatcher = new FoodMatcher();
		this.pubSubHandler = new PubSubSender("food-upstream");
	}

	async handle_get_all_menu() {
		const menu = await this.databaseController.getAllMenuWithoutRef();
		const jsonString = JSON.stringify(menu);
		this.pubSubHandler.send_message(jsonString);
	}

	async handle_get_recommendation(req_obj) {
		const dish1Value = req_obj.dish1;
		const dish2Value = req_obj.dish2;

		const result = await this.foodMatcher.findMatchForDish(
			dish1Value,
			dish2Value,
		);
		console.log("result: ", result);
		const jsonString = JSON.stringify(result);
		this.pubSubHandler.send_message(jsonString);
	}

	async process_message(msg_str) {
		try {
			if (msg_str == "default message") await this.handle_get_all_menu();
			else {
				const parsedObj = JSON.parse(msg_str);
				await this.handle_get_recommendation(parsedObj);
			}
		} catch (error) {
			this.pubSubHandler.send_message("Error!");
		}
	}
}

entry_function = async (cloud_message) => {
	const pubsub_message = cloud_message.data.message;
	const foodCore = new FoodCore();
	const msg_payload_str = Buffer.from(pubsub_message.data, "base64").toString();
	await foodCore.process_message(msg_payload_str);
};

module.exports = { entry_function };

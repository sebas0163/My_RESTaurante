const { entry_function } = require("./FoodCore.js");
const { PubSubReceiver } = require("../common/PubSub.js");

const pubsub_handler = new PubSubReceiver(
	"food-downstream",
	"FoodRecommendation-sub",
);

const main_loop = async () => {
	console.log("Starting main LocalRunner loop");
	while (true) {
		console.log("Waiting on new request...");
		const pubsub_req = await pubsub_handler.pull_single_raw_message();
		entry_function({ data: { message: pubsub_req } });
	}
};

main_loop();
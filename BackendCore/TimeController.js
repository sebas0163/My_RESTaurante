const moment = require("moment");
const {PubSubReceiverSender} = require('../common/PubSub.js');

class TimeRes {
	constructor(errorCode, schedule) {
		this.errorCode = errorCode;
		this.schedule = schedule;
	}
}

class TimeController {
	constructor() {
		this.pubSubHandler = new PubSubReceiverSender("time-downstream", "time-upstream", "TimeCore-sub");
		this.askSchedule = this.askSchedule.bind(this);
	}

	askSchedule(req, res) {
		this.pubSubHandler.send_message("askSchedule");
		this.pubSubHandler.pull_single_message().then((time_res) => {
			res.json(JSON.parse(time_res));
		})

	}
}

module.exports = { TimeController };

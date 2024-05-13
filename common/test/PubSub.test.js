const { PubSubSender, PubSubReceiver } = require("../PubSub.js");

const pubSubMock = jest.fn();

jest.mock("@google-cloud/pubsub", () => {
	return {
		PubSub: jest.fn().mockReturnValue({
			topic: jest.fn((topic_name) => {
				return {
					name: topic_name,
					subscription: jest.fn((sub_name) => {
						return {
							name: sub_name,
						};
					}),
				};
			}),
		}),
	};
});

describe("PubSubSender", () => {
	beforeEach(() => {
		test_topic_name = "test_topic";
		sender = new PubSubSender((topic_name = test_topic_name));
	});

	test("PubSubSender should exist", () => {
		expect(sender).toBeTruthy();
	});

	test("Should configure a topic", () => {
		expect(sender.topic.name).toBe(test_topic_name);
	});

	test("should send a buffer message to a specified topic", () => {
		publishMessageMock = jest.fn();
		sender.topic = {
			publishMessage: publishMessageMock,
		};

		const test_msg = "Hi Mom!";
		sender.send_message(test_msg);
		expect(publishMessageMock).toHaveBeenCalledWith({
			data: Buffer.from(test_msg),
		});
	});
});

describe("PubSubReceiver", () => {
	beforeEach(() => {
		const test_topic_name = "test_topic";
		test_sub_name = "test_sub";
		receiver = new PubSubReceiver(test_topic_name, test_sub_name);
	});

	test("PubSubReceiver should exist", () => {
		expect(receiver).toBeTruthy();
	});

	test("Should configure a subscription", () => {
		expect(receiver.subscription.name).toBe(test_sub_name);
	});

	test("Should be able to pull a single message", async () => {
		// TODO: Mock 'on' method to send a response after a certain timeout
		// so we can check async is working
		const expected_msg = "Hi Mom!";
		const message_mock = {
			ack: jest.fn(),
			data: expected_msg,
		};

		receiver.subscription.removeListener = jest.fn();
		receiver.subscription.on = jest.fn(async (type, listener) => {
			if (type == "message") {
				await new Promise((resolve) => setTimeout(resolve, 500));
				listener(message_mock);
			}
		});

		const msg = await receiver.pull_single_message();
		expect(receiver.subscription.on).toHaveBeenCalled();
		expect(message_mock.ack).toHaveBeenCalled();
		expect(msg).toBe(expected_msg);
	});
});

const {PubSub} = require('@google-cloud/pubsub');

class PubSubIface {
  constructor(
    topic_name,
    projectId = 'silken-tenure-419721',
  ) {
    this.subs = [];
    this.projectId = projectId;

    this.downstream_topic_name = "projects/" + this.projectId + "/topics/" +
      topic_name + "-downstream";
    this.downstream_sub_name = "projects/" + this.projectId +
      "/subscriptions/" + topic_name + "-downstream";

    this.upstream_topic_name = "projects/" + this.projectId + "/topics/" +
      topic_name + "-upstream";
    this.upstream_sub_name = "projects/" + this.projectId +
      "/subscriptions/" + topic_name + "-upstream";

    this.pubsub = new PubSub({projectId: this.projectId});
    this.pubsub.getTopics().then(async (topics) => {
      await this.setupTopics(topics)
    });
  }

  async destructor() {
    console.log("Called destructor!")
    this.subs.forEach(async (sub) => {
      await sub.delete();
    });
  }

  async setupTopics(topics) {
    this.downstream_topic = await this.getTopicByName(this.downstream_topic_name);
    this.upstream_topic = await this.getTopicByName(this.upstream_topic_name);
  }

  async getTopicByName(topicName) {
    const [topics] = await this.pubsub.getTopics();
    let topic = topics.find(obj => obj.name == topicName);

    if (!topic) {
      await this.pubsub.createTopic(topicName);
      topic = await this.getTopicByName(topic, subName);
    }
    return topic;
  }

  async getSubscriptionByName(topic, subName) {
    const [subscriptions] = await topic.getSubscriptions();
    let sub = subscriptions.find(obj => obj.name == subName);
    if (!sub) {
      await topic.createSubscription(subName)
      console.log("Created sub with name " + subName);
      sub = await this.getSubscriptionByName(topic, subName);
    }
    return sub;
  }
}

module.exports = {PubSubIface};


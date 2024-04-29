const express = require('express');
const firebaseApp =require("firebase/app");
const router = express.Router();
const firestore = require ("firebase/firestore");
const {DatabaseController} = require('../DB/DatabaseController');
const {PubSubIface} = require('../DB/PubSub');
const { FoodMatcher } = require('./FoodMatcher');

const firebaseApp_= firebaseApp.initializeApp({
    apiKey: "AIzaSyAGqShV0l2hfX2eO8hYzgXnXDmpO5F0xsI",
    authDomain: "silken-tenure-419721.firebaseapp.com",
    projectId: "silken-tenure-419721",
    storageBucket: "silken-tenure-419721.appspot.com",
    messagingSenderId: "245250661585",
    appId: "1:245250661585:web:194d2c6ccce99dd6aab9f0",
    measurementId: "G-L0BFNM9LDG"
  });

const db = firestore.getFirestore("myrestaurant");

class DishIface extends PubSubIface {
  constructor(
    downstream_callback, topic_name='dish', projectId = 'silken-tenure-419721'
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

class FoodCore{
  constructor() {
    this.dishIface = new DishIface(this.simple_callback);
    this.databaseController = new DatabaseController();
    this.foodMatcher = new FoodMatcher();
  }

  simple_callback  = async (message) => {
    console.log('Received message: ', message.data.toString());
    message.ack();

   
    const messageContent = message.data.toString();

    if (messageContent === 'default message') {
        // If the message is 'default message', do something
        console.log('The message is the default message.');

        // Now we need to return a message
        const menu =  await this.databaseController.getAllMenuWithoutRef();
        const jsonString = JSON.stringify(menu);
        await this.dishIface.upstream_topic.publishMessage({data:Buffer.from(jsonString)})

    } else {
        // If the message is not 'default message', do something else
        const parsedData = JSON.parse(messageContent);

        const dish1Value = parsedData.dish1;
        const dish2Value = parsedData.dish2;

        const result = await this.foodMatcher.findMatchForDish(dish1Value, dish2Value);
        console.log('result: ', result);
        const jsonString = JSON.stringify(result);
        await this.dishIface.upstream_topic.publishMessage({data:Buffer.from(jsonString)})
    }
    
  }
}

// Instantiate the DatabaseController

// Instantiate FoodCore and export its router
foodCore = new FoodCore();
module.exports = { DishIface }
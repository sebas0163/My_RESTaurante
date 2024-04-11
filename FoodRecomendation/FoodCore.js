const express = require('express');
const firebaseApp =require("firebase/app");
const router = express.Router();
const firestore = require ("firebase/firestore");
const { DatabaseController } = require('./DatabaseController');
const {PubSubIface} = require('../common/PubSub');

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


//

// router.get('/getMenu', async (req, res) => {
//   try {
//       const list = await databaseController.getAllMenu();
//       res.send(list);
//   } catch (error) {
//       console.log(error)
//       res.status(500).send(error.message);
//   }
// });

//module.exports = router;


class FoodCore{
  constructor(databaseController) {
    this.dishIface = new DishIface(this.simple_callback);
    this.databaseController = databaseController;
  }

  destructor() {
    this.dishIface.destructor();
  }

  simple_callback  = (message) => {
    console.log('Received message:', message.data.toString());
    // Now we need to return a message

    const timeRes = 1
    const jsonString = JSON.stringify(timeRes);

    this.dishIface.upstream_topic.publishMessage({data:Buffer.from(jsonString)})

    this.destructor();
  }
}

// Instantiate the DatabaseController
const databaseController = new DatabaseController(db)

// Instantiate FoodCore and export its router
foodCore = new FoodCore(databaseController);

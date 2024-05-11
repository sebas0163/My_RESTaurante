const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const { SentimentController } = require('./SentimentController');
=======
const { SentimentController } = require("./SentimentController");
const { DishController } = require("./DishController");
const { TimeController } = require("./TimeController");
>>>>>>> 3d586c7 (New pubsub)

sentiment = new SentimentController();

<<<<<<< HEAD
router.get('/Sentiment/:feedback?', sentiment.askForSentiment);

module.exports = router;
=======
router.get("/Sentiment/:feedback?", sentiment.askForSentiment);
router.get("/food/menu", dish_controller.getAllMenu);
// router.post('/recomendation/time', time_reco.askSchedule);
router.post("/food/recomendation", dish_controller.askForDish);

module.exports = router;
>>>>>>> 3d586c7 (New pubsub)

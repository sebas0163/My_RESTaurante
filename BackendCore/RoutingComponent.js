const express = require("express");
const router = express.Router();
const { SentimentController } = require('./SentimentController');
const { DishController } = require("./DishController");
const { TimeController } = require("./TimeController");

sentiment = new SentimentController();

router.get("/Sentiment/:feedback?", sentiment.askForSentiment);
router.get("/food/menu", dish_controller.getAllMenu);
// router.post('/recomendation/time', time_reco.askSchedule);
router.post("/food/recomendation", dish_controller.askForDish);

module.exports = router;


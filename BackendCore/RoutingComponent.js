const express = require('express');
const router = express.Router();
const { SentimentController } = require('./SentimentController');
const { DishController } = require('./DishController');

sentiment = new SentimentController();
dish_controller = new DishController();

router.get('/Sentiment/:feedback?', sentiment.askForSentiment);
router.get('/food/menu', dish_controller.getAllMenu)

module.exports = router;
const express = require('express');
const router = express.Router();
const { SentimentController } = require('./SentimentController');
const { DishController } = require('./DishController');
const { TimeController } = require('./TimeController');

sentiment = new SentimentController();
dish_controller = new DishController();

router.get('/Sentiment/:feedback?', sentiment.askForSentiment);
router.get('/food/menu', dish_controller.getAllMenu)
router.post('/recomendation/time', time_reco.askSchedule);

module.exports = router;


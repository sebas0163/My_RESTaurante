const express = require('express');
const router = express.Router();
const { SentimentController } = require('./SentimentController');
const { DishController } = require('./DishController');
const { TimeController } = require('./TimeController');
const { UserController } = require('./UserController');

sentiment = new SentimentController();
dish_controller = new DishController();
time_reco = new TimeController();
user_cont = new UserController();

router.get('/Sentiment/:feedback?', sentiment.askForSentiment);
router.get('/food/menu', dish_controller.getAllMenu);

router.get('/user/login', user_cont.verifyUserLogin);
router.post('/recomendation/time', time_reco.askSchedule);
router.post('/food/recomendation', dish_controller.askForDish);

module.exports = router;


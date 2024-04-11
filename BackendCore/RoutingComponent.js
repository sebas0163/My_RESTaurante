const express = require('express');
const router = express.Router();
const { SentimentController } = require('./SentimentController');
const { TimeController } = require('./TimeController');

sentiment = new SentimentController();
time_reco = new TimeController();

router.get('/Sentiment/:feedback?', sentiment.askForSentiment);
router.post('/recomendation/time', time_reco.askSchedule);

module.exports = router;


const express = require('express');
const router = express.Router();
const { SentimentController } = require('./SentimentController');

sentiment = new SentimentController();

router.get('/Sentiment/:feedback', sentiment.askForSentiment);

module.exports = router;
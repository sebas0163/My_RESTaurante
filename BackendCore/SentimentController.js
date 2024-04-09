class Sentiment {
    constructor(floatMagnitude, floatScore) {
      this.floatMagnitude = floatMagnitude;
      this.floatScore = floatScore;
    }
}
class SentimentController {
    constructor(){}
    askForSentiment(req, res) {
        
        const data = {
          message: 'ejemplo de mensaje de sentimiento'
        };
      
        
        res.json(data);
    }
}
module.exports = { SentimentController };
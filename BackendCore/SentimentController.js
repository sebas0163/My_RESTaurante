
const language = require('@google-cloud/language');

class Sentiment {
    constructor(floatMagnitude, floatScore) {
      this.floatMagnitude = floatMagnitude;
      this.floatScore = floatScore;
    }
}
class SentimentController {
    constructor(){
        this.client = new language.LanguageServiceClient({keyFilename: 'BackendCore/credentials.json'});
        this.askForSentiment = this.askForSentiment.bind(this);
    }

    async parseHttpRequest(text){
        try {
            const [result] = await this.client.analyzeSentiment({ document: { content: text, type: 'PLAIN_TEXT' } });
            const sentiment = result.documentSentiment;
            return { score: sentiment.score, magnitude: sentiment.magnitude };
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
            throw error;
        }
    }
    parseSentiment(sentiment){
        if (sentiment["score"] >= 0){
            return 1
        }else {return 0}
    }
    askForSentiment(req, res) {
        
        const { feedback } = req.params;
        
        (async () => {
            try {
                const sentiment = await this.parseHttpRequest(feedback);
                const sentiment_value = this.parseSentiment(sentiment);
                const data = {
                    "sentiment_value": sentiment_value
                };
                res.json(data);
                console.log('Sentiment:', sentiment);
            } catch (error) {
                console.error('Error:', error);
            }
        })();

        
    }
}
module.exports = { SentimentController };
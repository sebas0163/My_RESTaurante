
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
        var texto;
        const score = Math.floor((sentiment["score"] + 1) * 2.5) + 1;
        if (sentiment["score"] >= 0){
            texto = "We're pleased you had a satisfactory experience.";
        }else {
            texto = "We apologize for your experience and will strive to improve.";
        }
        return {score: score, texto:texto}
    }
    askForSentiment(req, res) {
        
        const { feedback } = req.params;
        
        (async () => {
            try {
                const sentiment = await this.parseHttpRequest(feedback);
                const sentiment_value = this.parseSentiment(sentiment);
                const data = {
                    "score": sentiment_value.score,
                    "texto": sentiment_value.texto
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
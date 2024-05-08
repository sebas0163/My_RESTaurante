
const language = require('@google-cloud/language');

class SentimentError extends Error{
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.stack = (new Error()).stack;
        this.httpsCode = 400;
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
        var score = Math.floor((sentiment["score"] + 1) * 2.5) + 1;
        if(sentiment["magnitude"]<0.5){
            throw new SentimentError("El mensaje de retroalimentación no fue comprendido adecuadamente. ");
        }
        if (sentiment["score"] >= 0){
            texto = "Nos complace que hayas tenido una experiencia satisfactoria.";
        }else {
            texto = "Pedimos disculpas por tu experiencia y nos esforzaremos por mejorar.";
        }
        return {score: score, texto:texto}
    }
    askForSentiment(req, res) {
        const { feedback } = req.query;
        const { feedback: feedbackParam } = req.params;
      
        // If feedback is provided in both path and query, prioritize the query string
        const feedbackValue = feedback || feedbackParam;
      
        // Check if feedback parameter is provided
        if (!feedbackValue) {
          return res.status(400).send('Feedback parameter is required.');
        }
      
        (async () => {
            try {
                const sentiment = await this.parseHttpRequest(feedbackValue);
                const sentiment_value = this.parseSentiment(sentiment);
                const data = {
                    "score": sentiment_value.score,
                    "texto": sentiment_value.texto
                };
                res.json(data);
                console.log('Sentiment:', sentiment);
            } catch (error) {
                    if (error instanceof SentimentError){
                         console.log(
                        "Sentiment couldnt be interpreted ");
                        res.status(error.httpsCode);
                        res.json({"message":error.message});
                    
                        res.end();
                    } else {
                        res.status(500);
                        res.end();
                        throw error;
                    }
            }
        })();

        
    }
}
module.exports = { SentimentController, SentimentError};

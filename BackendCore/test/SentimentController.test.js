const { SentimentController, SentimentError } = require('../SentimentController.js')

jest.mock('@google-cloud/language', () => {
  return {
    LanguageServiceClient: jest.fn()
  };
})


describe('SentimentController', () => {
  beforeEach(() => {
    sentimentController = new SentimentController();
    sentimentController.client = {
      analyzeSentiment: jest.fn()
    };

    sentimentController.parseHttpRequest = jest.fn();
    sentimentController.parseSentiment = jest.fn().mockReturnValue({
      score:1,
      texto:"Bien!"
    })
  });

  const send_request = async () => {
    req = {
      query: {
        feedback: "Dead Beef"
      },
      params: {
        feedback: "Dead Beef"
      }
    }

    res = {
      json: jest.fn(),
      status: jest.fn(),
      end: jest.fn()
    }

    await sentimentController.askForSentiment(req, res);
    return res;
  }

  test('debe retornar un valor acorde con el sentimiento', async () => {
    res = await send_request();
    expect(res.json).toHaveBeenCalledWith({
      score:1,
      texto:"Bien!"
    });
  });

  test('debe responder con un codigo de error si se captura un SentimentError', async () => {
    sentimentController.parseHttpRequest.mockRejectedValue(new SentimentError("Dead beef"));
    res = await send_request();

    expect(res.json).toHaveBeenCalledWith({
      message: "Dead beef"
    });

    expect(res.status).toHaveBeenCalledWith(400);

  });

})

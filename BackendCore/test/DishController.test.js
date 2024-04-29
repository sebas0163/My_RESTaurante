const { DishController, DishIface, DishReq } = require('../DishController.js');
const { PubSub } = require('@google-cloud/pubsub');

jest.mock('../../common/PubSub.js');

describe('DishIface', () => {
  let dishIface;

  beforeEach(() => {
    dishIface = new DishIface();

    dishIface.downstream_topic = {
      publishMessage: jest.fn()
    };

    const mocked_response = {
      data: {
        toString: jest.fn().mockReturnValue('ok')
      }
    };
    mocked_return_result = '{"data":"ok"}';
    dishIface.upstream_sub = {
      on: jest.fn().mockImplementation((event, listener) => {
        if (event == 'message') {
          setTimeout(() => listener({
            ack: jest.fn(),
            data: '{"data":"ok"}'
          }), 100);
        }
      })
    };

  });

  describe('DishIface', () => {
    it('publicar y recibir respuesta', async () => {
      const response = await dishIface.getAllMenu("Sample message");
      expect(response).toEqual({ data: "ok" });
      expect(dishIface.downstream_topic.publishMessage).toHaveBeenCalledWith({ data: expect.any(Buffer) });
    });
  });
});

describe('DishController', () => {

  let dishController;

  beforeEach(() => {
    dishController = new DishController();
    expected_res = {response:"OK"};
    dishController.dishIface.getAllMenu = jest.fn().mockResolvedValue(expected_res);
    dishController.dishIface.askForDish = jest.fn().mockResolvedValue(expected_res);
  });

  it('should handle getAllMenu request and respond', async () => {
    const mockReq = {
      body: {},
      query: { message: "Hello World" }
    };
    const mockRes = { json: jest.fn() };

    await dishController.getAllMenu(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({ response: "OK" });
  });

  it('should handle askForDish request and respond with dish details', async () => {
    const mockReq = { body: { dish1: "Pizza", dish2: "Pasta" } };
    const mockRes = { json: jest.fn() };

    await dishController.askForDish(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({ response: "OK" });
  });
});


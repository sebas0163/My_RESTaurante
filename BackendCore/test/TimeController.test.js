const {TimeController, TimeIface} = require('../TimeController.js');

jest.mock('../../common/PubSub.js');

describe('TimeController', () => {
  test('retorna la respuesta tal cual', async () => {
    timeController = new TimeController();

    req = {
      body: {
        day: "today"
      }
    }

    res = {
      json: jest.fn()
    }

    expected_res = "Ok!";
    timeController.timeIface.askSchedule = jest.fn().mockResolvedValue(expected_res);

    await timeController.askSchedule(req, res);

    expect(res.json).toHaveBeenCalledWith(expected_res);
  })
});

jest.mock('../../common/PubSub.js');

describe('TimeIface', () => {
  beforeEach(() =>{
    timeIface = new TimeIface();
    timeIface.downstream_topic = {
      publishMessage: jest.fn()
    };

    const mocked_response = {
      data: {
        toString: jest.fn().mockReturnValue('ok')
      }
    };
    mocked_return_result = '{"data":"ok"}';
    timeIface.upstream_sub = {
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

  test('debe publicar un mensaje', async () => {
    await timeIface.askSchedule("11/11/11");
    expect(timeIface.downstream_topic.publishMessage).toHaveBeenCalledWith({
      data:Buffer.from("11/11/11")
    });
  });

  test('debe retornar exactamente el objeto que recibe de la respuesta de upstream', async () => {
    result = await timeIface.askSchedule("11/11/11");
    expect(result).toEqual(JSON.parse(mocked_return_result));
  });
})


const { TimeIface, TimeCore } = require('../TimeCore.js');
const { PubSubIface } = require('../../common/PubSub');

jest.mock('../../common/PubSub');

describe('TimeIface', () => {
  let mockPubSub, mockSubscription, timeIface;
  const mockCallback = jest.fn();

  beforeEach(() => {
    mockSubscription = {
      on: jest.fn((event, handler) => {
        if (event === 'message') {
          handler({ data: Buffer.from('Message Data'), ack: jest.fn() });
        }
      })
    };

    mockPubSub = {
      setupTopics: jest.fn(),
      getSubscriptionByName: jest.fn().mockResolvedValue(mockSubscription)
    };


    timeIface = new TimeIface(mockCallback);
    timeIface.setupTopics = jest.fn();
    timeIface.getSubscriptionByName = jest.fn().mockResolvedValue(mockSubscription);
    timeIface.downstream_sub = mockSubscription;
  });

  it('deberia manejar mensajes entrantes llamando a un callback', () => {
    const message = { data: Buffer.from('01/01/2023'), ack: jest.fn() };
    mockCallback.mockClear();

    timeIface.subscribe_to_downstream(mockCallback);
    mockSubscription.on.mock.calls[0][1](message);

    expect(mockCallback).toHaveBeenCalledWith(message);
  });

});

jest.mock('../../common/DatabaseController.js');
jest.mock('moment', () => jest.fn().mockReturnValue("11/11/11"));

describe('TimeCore', () => {
  let timeCore;
  it('tras recibir una solicitud deberia publicar el resultado a un upstream', async () => {
    timeCore = new TimeCore();
    const mockRes = '[12/12/12]';
    timeCore.databaseController = {
      get_available_schedule: jest.fn().mockResolvedValue(mockRes)
    };
    timeCore.timeIface = {
      upstream_topic: {
        publishMessage : jest.fn()
      }
    };

    const mockReq = {
      ack: jest.fn(),
      data: {
        toString: jest.fn().mockReturnValue("01/01/01")
      }
    };

    debugger;
    await timeCore.simple_callback(mockReq);

    expect(mockReq.ack).toHaveBeenCalled();
    expect(timeCore.timeIface.upstream_topic.publishMessage).toHaveBeenCalledWith(
      {data:Buffer.from('"'+mockRes+'"')});

  });
});


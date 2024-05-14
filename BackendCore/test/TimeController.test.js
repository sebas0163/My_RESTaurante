const {TimeController, TimeIface} = require('../TimeController.js');

jest.mock('../../common/PubSub.js');

describe('TimeController', () => {
  test('debe existir', async () => {
    timeController = new TimeController();

    expect(timeController).toBeTruthy();
  })
});


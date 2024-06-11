// __mocks__/moment.js
const moment = jest.fn(() => ({
    format: jest.fn().mockReturnValue('2024-01-01'),
  }));
  
  moment.duration = jest.fn();
  moment.isDate = jest.fn();
  moment.locale = jest.fn();
  moment.utc = jest.fn();
  
  module.exports = moment;
  
const { TimeEndpoint } = require('./TimeEndpoint');
const { TimeCore } = require('./TimeCore');
const httpMocks = require('node-mocks-http');
jest.mock('./TimeCore'); // Mock the TimeCore module

describe('TimeEndpoint', () => {
  let timeEndpoint;

  beforeEach(() => {
    TimeCore.mockClear(); // Clear any previous mock instances
    timeEndpoint = new TimeEndpoint(); // Create a new instance of TimeEndpoint
  });

  describe('getSchedule', () => {
    it('should return the schedule', async () => {
      const mockRequest = httpMocks.createRequest();
      const mockResponse = httpMocks.createResponse();
      const mockTimeString = JSON.stringify({ status: 200, data: { schedule: 'test schedule' } });

      timeEndpoint.time_manager.process_message = jest.fn().mockResolvedValue(mockTimeString);

      await timeEndpoint.getSchedule(mockRequest, mockResponse);

      expect(timeEndpoint.time_manager.process_message).toHaveBeenCalledWith({ message_code: 0 });
      expect(mockResponse.statusCode).toBe(200);
      expect(mockResponse._getJSONData()).toEqual({ schedule: 'test schedule' });
    });
  });

  describe('getScheduleByLocal', () => {
    it('should return the schedule for a specific local', async () => {
      const local = 'local1';
      const mockRequest = httpMocks.createRequest({
        query: {
          local: local
        }
      });
      const mockResponse = httpMocks.createResponse();
      const mockTimeString = JSON.stringify({ status: 200, data: { schedule: 'local schedule' } });

      timeEndpoint.time_manager.process_message = jest.fn().mockResolvedValue(mockTimeString);

      await timeEndpoint.getScheduleByLocal(mockRequest, mockResponse);

      expect(timeEndpoint.time_manager.process_message).toHaveBeenCalledWith({ message_code: 1, local: local });
      expect(mockResponse.statusCode).toBe(200);
      expect(mockResponse._getJSONData()).toEqual({ schedule: 'local schedule' });
    });
  });
});

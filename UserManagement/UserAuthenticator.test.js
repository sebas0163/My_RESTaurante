const { UserAuthenticator } = require('./UserAuthenticator');

describe('UserAuthenticator', () => {
  let userAuthenticator;

  beforeEach(() => {
    // Create a new instance of UserAuthenticator before each test
    userAuthenticator = new UserAuthenticator();
  });

  describe('loginUser', () => {
    it('should return a status of 401 for invalid login credentials', async () => {
      const loginResponse = await userAuthenticator.loginUser('test@example.com', 'password');
      expect(loginResponse.status).toBe(401);
    });
    it('should return a status of 202 for valid login credentials', async () => {
        const loginResponse = await userAuthenticator.loginUser('admin', 'admin');
        expect(loginResponse.status).toBe(202);
      });

    // Add more test cases for loginUser function
  });

  describe('addNewUser', () => {
    it('should return a status of 401 because user already exists', async () => {
      const newUserResponse = await userAuthenticator.addNewUser('Admin', 'admin', 'admin', '1234', 'user');
      expect(newUserResponse.status).toBe(401);
    });

    // Add more test cases for addNewUser function
  });

  // Add tests for other methods like changePassword, changeAccessLevel, deleteUser, etc.

});


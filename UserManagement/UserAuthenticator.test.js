const { UserAuthenticator } = require('./UserAuthenticator');

// Mock DatabaseController
jest.mock('../common/DatabaseController', () => ({
    DatabaseController: jest.fn(() => ({
        getUser: jest.fn(),
        addUser: jest.fn(),
        updateUserPassword: jest.fn(),
        updateUserPermit: jest.fn(),
        deleteUser: jest.fn()
    }))
}));

// Mock PubSubSender
jest.mock('../common/PubSub', () => ({
    PubSubSender: jest.fn(() => ({
        send_message: jest.fn()
    }))
}));

describe('UserAuthenticator', () => {
    let userAuthenticator;

    beforeEach(() => {
        userAuthenticator = new UserAuthenticator();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('askForUserResponse calls addNewUser correctly', async () => {
        // Mock getUser to return null (user not found)
        userAuthenticator.databaseController.getUser.mockResolvedValueOnce(null);

        const json_usr = {
            message_code: 0, // Add new user
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            recovery_pin: '1234',
            access_level: 'user'
        };

        await userAuthenticator.askForUserResponse(json_usr);

        expect(userAuthenticator.databaseController.addUser).toHaveBeenCalledWith({
            name: json_usr.name,
            email: expect.any(String), // Encrypted email
            password: expect.any(String), // Encrypted password
            access_level: json_usr.access_level,
            recovery_pin: expect.any(String) // Encrypted recovery pin
        });
    });

    test('loginUser returns 401 when user not found', async () => {
      // Mock getUser to return null (user not found)
      userAuthenticator.databaseController.getUser.mockResolvedValueOnce(null);

      const result = await userAuthenticator.loginUser('nonexistent@example.com', 'password123');

      expect(result).toEqual({
          status: 401,
          data: 'Error: No se encontro un usuario con esa direccion de correo'
      });
  });

 
  test('loginUser returns 401 when password is incorrect', async () => {
      const dbUser = {
          email: 'existing@example.com',
          password: '1234' // Assuming the password is already encrypted
      };
      const encryptedEmail = btoa(dbUser.email);
      const encryptedPassword = btoa(dbUser.password);

      // Mock getUser to return a user with different password
      userAuthenticator.databaseController.getUser.mockResolvedValueOnce({
          ...dbUser,
          password: 'differentpassword'
      });

      const result = await userAuthenticator.loginUser(dbUser.email, dbUser.password);

      expect(result).toEqual({
          status: 401,
          data: 'Error: Contrasenna incorrecta'
      });
  });
  test('changePassword returns 401 when user not found', async () => {
    // Mock updateUserPassword to return null (user not found)
    userAuthenticator.databaseController.updateUserPassword.mockResolvedValueOnce(null);

    const result = await userAuthenticator.changePassword('nonexistent@example.com', 'password123', '1234');

    expect(result).toEqual({
        status: 401,
        data: 'Error: usuario incorrecto'
    });
});

test('changePassword returns 401 when pin is incorrect', async () => {
    // Mock updateUserPassword to return 0 (pin incorrect)
    userAuthenticator.databaseController.updateUserPassword.mockResolvedValueOnce(0);

    const result = await userAuthenticator.changePassword('existing@example.com', 'password123', 'incorrectpin');

    expect(result).toEqual({
        status: 401,
        data: 'Error: El pin es incorrecto, no se pudo cambiar la contrasenna'
    });
});

test('changePassword returns 200 when password is successfully changed', async () => {
    // Mock updateUserPassword to return 1 (password changed)
    userAuthenticator.databaseController.updateUserPassword.mockResolvedValueOnce(1);

    const result = await userAuthenticator.changePassword('existing@example.com', 'password123', '1234');

    expect(result).toEqual({
        status: 200,
        data: 'Se ha cambiado la contrasenna'
    });
}); 

test('changeAccessLevel returns 401 when admin user not found', async () => {
  // Mock getUser to return null (admin user not found)
  userAuthenticator.databaseController.getUser.mockResolvedValueOnce(null);

  const result = await userAuthenticator.changeAccessLevel('nonexistent@example.com', 'password123', 'permit@example.com', 'user');

  expect(result).toEqual({
      status: 401,
      data: 'Error: No se encontro un usuario con esa direccion de correo'
  });
});

test('changeAccessLevel returns 401 when admin password is incorrect', async () => {
  // Mock getUser to return a user with different password
  userAuthenticator.databaseController.getUser.mockResolvedValueOnce({
      access_level: 'admin',
      password: 'incorrectpassword'
  });

  const result = await userAuthenticator.changeAccessLevel('existing@example.com', 'password123', 'permit@example.com', 'user');

  expect(result).toEqual({
      status: 401,
      data: 'Error: Password incorrecto'
  });
});

test('changeAccessLevel returns 401 when user is not an admin', async () => {
  // Mock getUser to return a non-admin user
  userAuthenticator.databaseController.getUser.mockResolvedValueOnce({
      access_level: 'user',
      password: 'password123'
  });

  const result = await userAuthenticator.changeAccessLevel('existing@example.com', 'password123', 'permit@example.com', 'user');

  expect(result).toEqual({
      status: 401,
      data: 'Error: User no es un admin'
  });
});


    // Add more test cases for other methods of UserAuthenticator
});

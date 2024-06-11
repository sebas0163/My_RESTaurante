const { UserAuthenticator } = require('./UserAuthenticator');
const { DatabaseController } = require('./DatabaseController');

jest.mock('./DatabaseController');

describe('UserAuthenticator', () => {
  let userAuthenticator;

  beforeEach(() => {
    DatabaseController.mockClear();
    userAuthenticator = new UserAuthenticator();
  });

  describe('askForUserResponse', () => {
    it('should call addNewUser for message_code 0', async () => {
      userAuthenticator.addNewUser = jest.fn().mockResolvedValue({ status: 201, data: 'new user' });
      const json_usr = { message_code: 0, name: 'John', email: 'john@example.com', password: 'password', recovery_pin: '1234', access_level: 'user' };
      const response = await userAuthenticator.askForUserResponse(json_usr);
      expect(userAuthenticator.addNewUser).toHaveBeenCalledWith('John', 'john@example.com', 'password', '1234', 'user');
      expect(response).toEqual(JSON.stringify({ status: 201, data: 'new user' }));
    });

  });

  describe('loginUser', () => {
    it('should return user data for valid credentials', async () => {
      const mockUser = { email: btoa('john@example.com'), password: btoa('password') };
      userAuthenticator.databaseController.getUser = jest.fn().mockResolvedValue(mockUser);
      const response = await userAuthenticator.loginUser('john@example.com', 'password');
      expect(userAuthenticator.databaseController.getUser).toHaveBeenCalledWith(btoa('john@example.com'), btoa('password'));
      expect(response).toEqual({ status: 202, data: mockUser });
    });

    it('should return error for invalid credentials', async () => {
      userAuthenticator.databaseController.getUser = jest.fn().mockResolvedValue(null);
      const response = await userAuthenticator.loginUser('john@example.com', 'password');
      expect(response).toEqual({ status: 401, data: 'Error: No se encontro un usuario con esa direccion de correo' });
    });
  });

  describe('addNewUser', () => {
    it('should add a new user if not exists', async () => {
      userAuthenticator.databaseController.getUser = jest.fn().mockResolvedValue(null);
      userAuthenticator.databaseController.addUser = jest.fn().mockResolvedValue('new user');
      const response = await userAuthenticator.addNewUser('John', 'john@example.com', 'password', '1234', 'user');
      expect(userAuthenticator.databaseController.getUser).toHaveBeenCalledWith(btoa('john@example.com'), btoa('password'));
      expect(userAuthenticator.databaseController.addUser).toHaveBeenCalledWith({
        name: 'John',
        email: btoa('john@example.com'),
        password: btoa('password'),
        access_level: 'user',
        recovery_pin: btoa('1234')
      });
      expect(response).toEqual({ status: 201, data: 'new user' });
    });

    it('should return error if user already exists', async () => {
      userAuthenticator.databaseController.getUser = jest.fn().mockResolvedValue('existing user');
      const response = await userAuthenticator.addNewUser('John', 'john@example.com', 'password', '1234', 'user');
      expect(response).toEqual({ status: 401, data: 'Error: Usuario con ese correo ya existe' });
    });
  });

  describe('changePassword', () => {
    it('should change password for valid user', async () => {
      userAuthenticator.databaseController.updateUserPassword = jest.fn().mockResolvedValue(1);
      const response = await userAuthenticator.changePassword('john@example.com', 'newpassword', '1234');
      expect(response).toEqual({ status: 200, data: 'Se ha cambiado la contrasenna' });
    });

    it('should return error for invalid user', async () => {
      userAuthenticator.databaseController.updateUserPassword = jest.fn().mockResolvedValue(0);
      const response = await userAuthenticator.changePassword('john@example.com', 'newpassword', '1234');
      expect(response).toEqual({ status: 401, data: 'Error: El pin es incorrecto, no se pudo cambiar la contrasenna' });
    });
  });

  describe('changeAccessLevel', () => {
    it('should change access level for valid admin', async () => {
      const adminUser = { email: btoa('admin@example.com'), password: btoa('adminpass'), access_level: 'admin' };
      userAuthenticator.databaseController.getUser = jest.fn().mockResolvedValue(adminUser);
      userAuthenticator.databaseController.updateUserPermit = jest.fn().mockResolvedValue('updated user');
      const response = await userAuthenticator.changeAccessLevel('admin@example.com', 'adminpass', 'user@example.com', 'moderator');
      expect(response).toEqual({ status: 200, data: 'updated user' });
    });

    it('should return error for invalid admin credentials', async () => {
      const adminUser = { email: btoa('admin@example.com'), password: btoa('wrongpass'), access_level: 'admin' };
      userAuthenticator.databaseController.getUser = jest.fn().mockResolvedValue(adminUser);
      const response = await userAuthenticator.changeAccessLevel('admin@example.com', 'adminpass', 'user@example.com', 'moderator');
      expect(response).toEqual({ status: 401, data: 'Error: Password incorrecto' });
    });
  });

  describe('deleteUser', () => {
    it('should delete user for valid credentials', async () => {
      const mockUser = { email: btoa('john@example.com'), password: btoa('password') };
      userAuthenticator.databaseController.getUser = jest.fn().mockResolvedValue(mockUser);
      userAuthenticator.databaseController.deleteUser = jest.fn().mockResolvedValue('deleted user');
      const response = await userAuthenticator.deleteUser('john@example.com', 'password');
      expect(response).toEqual({ status: 200, data: 'deleted user' });
    });

    it('should return error for invalid credentials', async () => {
      userAuthenticator.databaseController.getUser = jest.fn().mockResolvedValue(null);
      const response = await userAuthenticator.deleteUser('john@example.com', 'password');
      expect(response).toEqual({ status: 401, data: 'Error: No se encontro un usuario con esa direccion de correo' });
    });
  });
});

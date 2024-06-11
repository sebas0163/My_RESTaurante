const request = require('supertest');
const express = require('express');
const { UserEndpoint } = require('./UserEndpoint');

// Mock the UserEndpoint methods
jest.mock('./UserEndpoint', () => {
    return {
        UserEndpoint: jest.fn().mockImplementation(() => {
            return {
                addNewUser: jest.fn((req, res) => res.status(201).json({ message: 'User created' })),
                verifyUserLogin: jest.fn((req, res) => res.status(200).json({ message: 'Login successful' })),
                changePassword: jest.fn((req, res) => res.status(200).json({ message: 'Password changed' })),
                changeAccess: jest.fn((req, res) => res.status(200).json({ message: 'Access changed' })),
                deleteUser: jest.fn((req, res) => res.status(200).json({ message: 'User deleted' })),
            };
        })
    };
});

const router = require('./RoutingComponent'); // Adjust the path accordingly

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

describe('Testing User Routes', () => {
    it('should create a new user', async () => {
        const res = await request(app)
            .post('/user/create')
            .send({ username: 'testUser', password: 'testPass' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User created');
    });

    it('should verify user login', async () => {
        const res = await request(app).get('/user/login/testUser/testPass');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Login successful');
    });

    it('should change user password', async () => {
        const res = await request(app)
            .put('/user/change_password')
            .send({ username: 'testUser', oldPassword: 'testPass', newPassword: 'newPass' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Password changed');
    });

    it('should change user access', async () => {
        const res = await request(app)
            .put('/user/change_access')
            .send({ username: 'testUser', accessLevel: 'newLevel' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Access changed');
    });

    it('should delete a user', async () => {
        const res = await request(app)
            .delete('/user/delete')
            .send({ username: 'testUser' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'User deleted');
    });
});

const request = require('supertest');
const express = require('express');
const { FoodEndpoint } = require('./FoodEndpoint');

// Mock the FoodEndpoint methods
jest.mock('./FoodEndpoint', () => {
    return {
        FoodEndpoint: jest.fn().mockImplementation(() => {
            return {
                getAllMenu: jest.fn((req, res) => res.status(200).json({ menu: [] })),
                askForDish: jest.fn((req, res) => res.status(200).json({ recommendation: 'Some dish' })),
            };
        })
    };
});

const router = require('./RoutingComponent'); // Adjust the path accordingly

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

describe('Testing Food Routes', () => {
    it('should get all menu items', async () => {
        const res = await request(app).get('/food/menu');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('menu');
    });

    it('should ask for dish recommendation', async () => {
        const res = await request(app)
            .post('/food/recomendation')
            .send({ someData: 'value' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('recommendation');
    });
});

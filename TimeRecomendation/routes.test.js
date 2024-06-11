const request = require('supertest');
const express = require('express');
const { TimeEndpoint } = require('./TimeEndpoint');

// Mock the TimeEndpoint methods
jest.mock('./TimeEndpoint', () => {
    return {
        TimeEndpoint: jest.fn().mockImplementation(() => {
            return {
                getSchedule: jest.fn((req, res) => res.status(200).json({ schedule: [] })),
                getScheduleByLocal: jest.fn((req, res) => res.status(200).json({ schedule: [] })),
            };
        })
    };
});

const router = require('./RoutingComponent'); // Adjust the path accordingly

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

describe('Testing Time Routes', () => {
    it('should get the schedule', async () => {
        const res = await request(app).get('/time/getSchedule');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('schedule');
    });

    it('should get the schedule by local', async () => {
        const res = await request(app).get('/time/getByLocal/someLocal');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('schedule');
    });
});

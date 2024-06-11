const request = require('supertest');
const express = require('express');
const { ReservationEndpoint } = require('./ReservationEndpoint');

// Mock the ReservationEndpoint methods
jest.mock('./ReservationEndpoint', () => {
    return {
        ReservationEndpoint: jest.fn().mockImplementation(() => {
            return {
                getAllReservations: jest.fn((req, res) => res.status(200).json({ reservations: [] })),
                getReservationById: jest.fn((req, res) => res.status(200).json({ reservation: {} })),
                getReservationByEmail: jest.fn((req, res) => res.status(200).json({ reservation: {} })),
                getReservationByLocal: jest.fn((req, res) => res.status(200).json({ reservation: {} })),
                deleteReservation: jest.fn((req, res) => res.status(200).json({ message: 'Reservation deleted' })),
                createReservation: jest.fn((req, res) => res.status(201).json({ message: 'Reservation created' })),
                editReservation: jest.fn((req, res) => res.status(200).json({ message: 'Reservation edited' })),
            };
        })
    };
});

const router = require('./RoutingComponent'); // Adjust the path accordingly

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

describe('Testing Reservation Routes', () => {
    it('should get all reservations', async () => {
        const res = await request(app).get('/reservation/getAll');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('reservations');
    });

    it('should get reservation by ID', async () => {
        const res = await request(app).get('/reservation/getById:1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('reservation');
    });

    it('should get reservation by Email', async () => {
        const res = await request(app).get('/reservation/getByEmail:example@example.com');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('reservation');
    });

    it('should get reservation by Local', async () => {
        const res = await request(app).get('/reservation/getByLocal:someLocal');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('reservation');
    });

    it('should delete a reservation', async () => {
        const res = await request(app)
            .delete('/reservation/delete')
            .send({ id: 1 });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Reservation deleted');
    });

    it('should create a new reservation', async () => {
        const res = await request(app)
            .post('/reservation/new')
            .send({ reservationData: 'value' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Reservation created');
    });

    it('should edit a reservation', async () => {
        const res = await request(app)
            .put('/reservation/edit')
            .send({ reservationData: 'value' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Reservation edited');
    });
});

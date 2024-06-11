const request = require('supertest');
const express = require('express');
const { DishController } = require('./DishController');
const { TimeController } = require('./TimeController');
const { UserController } = require('./UserController');
const { ReservationController } = require('./ReservationController');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const router = express.Router();

const dish_controller = new DishController();
const time_reco = new TimeController();
const reservationController = new ReservationController();
const user_cont = new UserController();

router.get('/food/menu', dish_controller.getAllMenu);
router.post('/food/recomendation', dish_controller.askForDish);

router.get("/reservation/getAll", reservationController.getAllReservations);
router.get("/reservation/getById:id?", reservationController.getReservationById);
router.get("/reservation/getByEmail:email?", reservationController.getReservationByEmail);
router.get("/reservation/getByLocal:local?", reservationController.getReservationByLocal);
router.delete("/reservation/delete", reservationController.deleteReservation);
router.post("/reservation/new", reservationController.createReservation);
router.put("/reservation/edit", reservationController.editReservation);

router.post('/user/create', user_cont.addNewUser);
router.get('/user/login/:user?/:password?', user_cont.verifyUserLogin);
router.put('/user/change_password', user_cont.changePassword);
router.put('/user/change_access', user_cont.changeAccess);
router.delete('/user/delete', user_cont.deleteUser);

router.get('/time/getSchedule', time_reco.getSchedule);
router.get('/time/getByLocal/:local?', time_reco.getScheduleByLocal);

app.use(router);

jest.mock('./DishController', () => {
    return {
        DishController: jest.fn().mockImplementation(() => {
            return {
                getAllMenu: jest.fn((req, res) => res.status(200).json({ menu: [] })),
                askForDish: jest.fn((req, res) => res.status(200).json({ recommendation: 'Some dish' })),
            };
        })
    };
});

jest.mock('./TimeController', () => {
    return {
        TimeController: jest.fn().mockImplementation(() => {
            return {
                getSchedule: jest.fn((req, res) => res.status(200).json({ schedule: [] })),
                getScheduleByLocal: jest.fn((req, res) => res.status(200).json({ schedule: [] })),
            };
        })
    };
});

jest.mock('./UserController', () => {
    return {
        UserController: jest.fn().mockImplementation(() => {
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

jest.mock('./ReservationController', () => {
    return {
        ReservationController: jest.fn().mockImplementation(() => {
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


describe('Testing Routes', () => {
    it('should get all menu items', async () => {
        const res = await request(app).get('/food/menu');
        expect(res.statusCode).toEqual(200);
        // Add more expectations based on your response structure
    });

    it('should ask for dish recommendation', async () => {
        const res = await request(app)
            .post('/food/recomendation')
            .send({ someData: 'value' });
        expect(res.statusCode).toEqual(200);
        // Add more expectations based on your response structure
    });

    it('should get all reservations', async () => {
        const res = await request(app).get('/reservation/getAll');
        expect(res.statusCode).toEqual(200);
        // Add more expectations based on your response structure
    });

    it('should get reservation by ID', async () => {
        const res = await request(app).get('/reservation/getById:1');
        expect(res.statusCode).toEqual(200);
        // Add more expectations based on your response structure
    });

    it('should get reservation by Email', async () => {
        const res = await request(app).get('/reservation/getByEmail:example@example.com');
        expect(res.statusCode).toEqual(200);
        // Add more expectations based on your response structure
    });

    it('should get reservation by Local', async () => {
        const res = await request(app).get('/reservation/getByLocal:someLocal');
        expect(res.statusCode).toEqual(200);
        // Add more expectations based on your response structure
    });

    it('should delete a reservation', async () => {
        const res = await request(app)
            .delete('/reservation/delete')
            .send({ id: 1 });
        expect(res.statusCode).toEqual(200);
        // Add more expectations based on your response structure
    });

    it('should create a new reservation', async () => {
        const res = await request(app)
            .post('/reservation/new')
            .send({ reservationData: 'value' });
        expect(res.statusCode).toEqual(201);
        // Add more expectations based on your response structure
    });

    it('should edit a reservation', async () => {
        const res = await request(app)
            .put('/reservation/edit')
            .send({ reservationData: 'value' });
        expect(res.statusCode).toEqual(200);
        // Add more expectations based on your response structure
    });

    it('should create a new user', async () => {
        const res = await request(app)
            .post('/user/create')
            .send({ username: 'testUser', password: 'testPass' });
        expect(res.statusCode).toEqual(201);
        // Add more expectations based on your response structure
    });

    it('should verify user login', async () => {
        const res = await request(app).get('/user/login/testUser/testPass');
        expect(res.statusCode).toEqual(200);
        // Add more expectations based on your response structure
    });

    it('should change user password', async () => {
        const res = await request(app)
            .put('/user/change_password')
            .send({ username: 'testUser', oldPassword: 'testPass', newPassword: 'newPass' });
        expect(res.statusCode).toEqual(200);
        // Add more expectations based on your response structure
    });

    it('should change user access', async () => {
        const res = await request(app)
            .put('/user/change_access')
            .send({ username: 'testUser', accessLevel: 'newLevel' });
        expect(res.statusCode).toEqual(200);
        // Add more expectations based on your response structure
    });

    it('should delete a user', async () => {
        const res = await request(app)
            .delete('/user/delete')
            .send({ username: 'testUser' });
        expect(res.statusCode).toEqual(200);
        // Add more expectations based on your response structure
    });

    it('should get schedule', async () => {
        const res = await request(app).get('/time/getSchedule');
        expect(res.statusCode).toEqual(200);
        // Add more expectations based on your response structure
    });

    it('should get schedule by local', async () => {
        const res = await request(app).get('/time/getByLocal/someLocal');
        expect(res.statusCode).toEqual(200);
        // Add more expectations based on your response structure
    });
});

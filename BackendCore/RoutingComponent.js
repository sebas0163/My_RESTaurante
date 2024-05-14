const express = require("express");
const router = express.Router();
const { SentimentController } = require('./SentimentController');
const { DishController } = require('./DishController');
//const { TimeController } = require('./TimeController');
const { UserController } = require('./UserController');
const {ReservationController} = require('./ReservationController');


sentiment = new SentimentController();
dish_controller = new DishController();
//time_reco = new TimeController();
user_cont = new UserController();
reservationController = new ReservationController();

router.get('/Sentiment/:feedback?', sentiment.askForSentiment);
router.get('/food/menu', dish_controller.getAllMenu);


//router.post('/recomendation/time', time_reco.askSchedule);
router.post('/food/recomendation', dish_controller.askForDish);
router.get('/reservation/getAll', reservationController.getAllReservations);
router.get('/reservation/getById', reservationController.getReservationById);
router.delete('/reservation/delete', reservationController.deleteReservation);
router.post('/reservation/new', reservationController.createReservation);

router.post('/user/create', user_cont.addNewUser);
router.get('/user/login/:user?/:password?', user_cont.verifyUserLogin);
router.put('/user/change_password', user_cont.changePassword);
router.put('/user/change_access', user_cont.changeAccess);
router.delete('/user/delete', user_cont.deleteUser);

module.exports = router;

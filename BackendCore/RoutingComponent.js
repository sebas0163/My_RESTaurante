const express = require("express");
const router = express.Router();
const { DishController } = require('./DishController');
const { TimeController } = require('./TimeController');
const { UserController } = require('./UserController');
const { ReservationController } = require('./ReservationController');

dish_controller = new DishController();
time_reco = new TimeController();
reservationController = new ReservationController();
user_cont = new UserController();

router.get('/food/menu', dish_controller.getAllMenu);
router.post('/food/recomendation', dish_controller.askForDish);

router.get("/reservation/getAll", reservationController.getAllReservations);
router.get("/reservation/getById:id?", reservationController.getReservationById);
router.get("/reservation/getByEmail:email?", reservationController.getReservationByEmail);
router.get("/reservation/getByLocal:local?", reservationController.getReservationByLocal);
router.delete("/reservation/delete:id?", reservationController.deleteReservation);
router.post("/reservation/new", reservationController.createReservation);
router.put("/reservation/edit", reservationController.editReservation);

// router.post('/recomendation/time', time_reco.askSchedule);

router.post('/user/create', user_cont.addNewUser);
router.get('/user/login/:user?/:password?', user_cont.verifyUserLogin);
router.put('/user/change_password', user_cont.changePassword);
router.put('/user/change_access', user_cont.changeAccess);
router.delete('/user/delete/:user?/:password?', user_cont.deleteUser);

router.get('/time/getSchedule', time_reco.getSchedule);
router.post('/time/newTime', time_reco.newTime);
router.get('/time/getByLocal/:local?', time_reco.getScheduleByLocal);



module.exports = router;

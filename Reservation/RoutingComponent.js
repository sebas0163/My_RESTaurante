const express = require("express");
const router = express.Router();

const { ReservationEndpoint } = require('./ReservationEndpoint');


reservEndpoint = new ReservationEndpoint();


router.get("/reservation/getAll", reservEndpoint.getAllReservations);
router.get("/reservation/getById:id?", reservEndpoint.getReservationById);
router.get("/reservation/getByEmail:email?", reservEndpoint.getReservationByEmail);
router.get("/reservation/getByLocal:local?", reservEndpoint.getReservationByLocal);
router.delete("/reservation/delete", reservEndpoint.deleteReservation);
router.post("/reservation/new", reservEndpoint.createReservation);
router.put("/reservation/edit", reservEndpoint.editReservation);

module.exports = router;


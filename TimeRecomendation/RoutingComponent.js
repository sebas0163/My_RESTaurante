const express = require("express");
const router = express.Router();

const { timeEndpoint } = require('./TimeEndpoint');


timeEndpoint = new TimeEndpoint();


router.get("/time/getAll", timeEndpoint.getSchedule);
router.put("/time/getByLocal", timeEndpoint.getScheduleByLocal);

module.exports = router;
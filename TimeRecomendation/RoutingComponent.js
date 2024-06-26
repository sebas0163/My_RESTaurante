const express = require("express");
const router = express.Router();

const { TimeEndpoint } = require('./TimeEndpoint');


timeEndpoint = new TimeEndpoint();


router.get("/time/getSchedule", timeEndpoint.getSchedule);
router.post("/time/newTime", timeEndpoint.newTime);
router.get("/time/getByLocal/:local?", timeEndpoint.getScheduleByLocal);

module.exports = router;
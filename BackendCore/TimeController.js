const axios = require("axios");
require("dotenv").config();

class TimeController {
  constructor() {
    this.secretKey = process.env.secret_key;
    this.serviceHost = process.env.time_host;
    this.servicePort = process.env.time_port;
    this.getSchedule = this.getSchedule.bind(this);
    this.getScheduleByLocal = this.getScheduleByLocal.bind(this);
    this.newTime = this.newTime.bind(this);
  }

  newTime(req, res) {
    const time = req.body.time;
    const slots = req.body.slots;
    const local = req.body.local;

    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/time/time/new`;

    axios
      .post(targetServiceUrl, {
        message_code: 2,
        time: time,
        slots: slots,
        local: local,
      })
      .then((response) => {
        console.log("Response from target service:", response.data);
        res.status(response.status).json(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response:", error.response.data);
          res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
          console.error("Error request:", error.request);
          res
            .status(500)
            .json({ message: "No response received from target service" });
        } else {
          console.error("Error", error.message);
          res.status(500).json({ message: error.message });
        }
      });
  }

  getSchedule(req, res) {
    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/time/time/getSchedule`;

    axios
      .get(targetServiceUrl)
      .then((response) => {
        console.log("Response from target service:", response.status);
        res.status(response.status).json(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response:", error.response.data);
          res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
          console.error("Error request:", error.request);
          res
            .status(500)
            .json({ message: "No response received from target service" });
        } else {
          console.error("Error", error.message);
          res.status(500).json({ message: error.message });
        }
      });
  }

  getScheduleByLocal(req, res) {
    const local = req.query.local;
    console.log("Local: ", local);
    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/time/time/getByLocal`;

    axios
      .get(`${targetServiceUrl}?local=${local}`)
      .then((response) => {
        console.log("Response from target service:", response.data);
        res.status(response.status).json(response.data);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error response:", error.response.data);
          res.status(error.response.status).json(error.response.data);
        } else if (error.request) {
          console.error("Error request:", error.request);
          res
            .status(500)
            .json({ message: "No response received from target service" });
        } else {
          console.error("Error", error.message);
          res.status(500).json({ message: error.message });
        }
      });
  }
}

module.exports = { TimeController };

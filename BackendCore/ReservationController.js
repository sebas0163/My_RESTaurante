const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class ReservationController {
  constructor() {
    this.secretKey = process.env.secret_key;
    this.serviceHost = process.env.reserv_host;
    this.servicePort = process.env.reserv_port;
    this.createReservation = this.createReservation.bind(this);
    this.deleteReservation = this.deleteReservation.bind(this);
    this.getAllReservations = this.getAllReservations.bind(this);
    this.getReservationById = this.getReservationById.bind(this);
    this.getReservationByEmail = this.getReservationByEmail.bind(this);
    this.getReservationByLocal = this.getReservationByLocal.bind(this);
    this.editReservation = this.editReservation.bind(this);
  }

  createReservation(req, res) {
    const { people, timeid, userid } = req.body;

    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/reserv/reservation/new`;

    axios
      .post(targetServiceUrl, {
        message_code: 2,
        people,
        timeid,
        userid,
      })
      .then((response) => {
        console.log("Response from target service:", response.data);
        res.status(response.status).json(response.data);
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          res.status(error.response.status).json(error.response.data);
        } else {
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
  }

  getAllReservations(req, res) {
    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/reserv/reservation/getAll`;

    axios
      .get(targetServiceUrl)
      .then((response) => {
        console.log("Response from target service:", response.status);
        res.status(response.status).json(response.data);
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          res.status(error.response.status).json(error.response.data);
        } else {
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
  }

  deleteReservation(req, res) {
    const { id } = req.body;
    console.log(id);
    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/reserv/reservation/delete`;

    axios
      .delete(targetServiceUrl, { data: { id } })
      .then((response) => {
        console.log("Response from target service:", response.data);
        res.status(response.status).json(response.data);
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {
          res.status(error.response.status).json(error.response.data);
        } else {
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
  }

  getReservationById(req, res) {
    const { id } = req.query;
    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/reserv/reservation/getById`;

    axios
      .get(`${targetServiceUrl}?id=${id}`)
      .then((response) => {
        console.log("Response from target service:", response.data);
        res.status(response.status).json(response.data);
      })
      .catch((error) => {
        console.error("Response from target service:", error);
        if (error.response) {
          res.status(error.response.status).json(error.response.data);
        } else {
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
  }

  getReservationByLocal(req, res) {
    const { local } = req.query;
    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/reserv/reservation/getByLocal`;

    axios
      .get(`${targetServiceUrl}?local=${local}`)
      .then((response) => {
        console.log("Response from target service:", response.data);
        res.status(response.status).json(response.data);
      })
      .catch((error) => {
        console.error("Response from target service:", error);
        if (error.response) {
          res.status(error.response.status).json(error.response.data);
        } else {
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
  }

  editReservation(req, res) {
    const { id, timeid, userid, people } = req.body;
    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/reserv/reservation/edit`;

    axios
      .put(targetServiceUrl, {
        id,
        people,
        timeid,
        userid,
      })
      .then((response) => {
        console.log("Response from target service:", response.data);
        res.status(response.status).json(response.data);
      })
      .catch((error) => {
        console.error("Response from target service:", error);
        if (error.response) {
          res.status(error.response.status).json(error.response.data);
        } else {
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
  }

  getReservationByEmail(req, res) {
    const { email } = req.query;
    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/reserv/reservation/getByEmail`;

    axios
      .get(`${targetServiceUrl}?email=${email}`)
      .then((response) => {
        console.log("Response from target service:", response.data);
        res.status(response.status).json(response.data);
      })
      .catch((error) => {
        console.error("Response from target service:", error);
        if (error.response) {
          res.status(error.response.status).json(error.response.data);
        } else {
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
  }
}

module.exports = { ReservationController };

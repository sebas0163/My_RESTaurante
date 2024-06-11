const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UserController {
  constructor() {
    this.secretKey = process.env.secret_key;
    this.serviceHost = process.env.usr_host;
    this.servicePort = process.env.usr_port;
    this.verifyUserLogin = this.verifyUserLogin.bind(this);
    this.changeAccess = this.changeAccess.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.addNewUser = this.addNewUser.bind(this);
  }

  addNewUser(req, res) {
    const { name, email, password, access_level, recovery_pin } = req.body;

    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/usr/user/create`;

    axios
      .post(targetServiceUrl, {
        name,
        email,
        password,
        access_level,
        recovery_pin,
      })
      .then((response) => {
        const token = jwt.sign({ email, password }, this.secretKey, {
          expiresIn: "1h",
        });
        console.log("Response from target service:", response.data);

        const responseData = {
          "id":response.data,
          token,
        };

        res.status(response.status).json(responseData);
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

  verifyUserLogin(req, res) {
    const { email, password } = req.query;

    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/usr/user/login`;

    axios
      .get(`${targetServiceUrl}?email=${email}&password=${password}`)
      .then((response) => {
        const token = jwt.sign({ email, password }, this.secretKey, {
          expiresIn: "1h",
        });
        console.log("Response from target service:", response.data);

        const responseData = {
          ...response.data,
          token,
        };

        res.status(response.status).json(responseData);
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

  changePassword(req, res) {
    const { email, password, recovery_pin } = req.body;

    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/usr/user/change_password`;

    axios
      .put(targetServiceUrl, {
        email,
        password,
        recovery_pin,
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

  changeAccess(req, res) {
    const { admin_email, admin_password, permit_email, access_level } =
      req.body;

    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/usr/user/change_access`;

    axios
      .put(targetServiceUrl, {
        admin_email,
        admin_password,
        permit_email,
        access_level,
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

  deleteUser(req, res) {
    const email = req.query.email
    const password = req.query.password;

    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/usr/user/delete`;

    axios
      .delete(`${targetServiceUrl}?email=${email}&password=${password}`)
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
}

module.exports = { UserController };

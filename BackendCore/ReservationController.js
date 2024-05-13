const { PubSubReceiverSender } = require("../common/PubSub");

class ReservationIface {
  constructor(
    sender_topic_name = "reservation-downstream",
    receiver_topic_name = "reservation-upstream",
    subscription_name = "ReservationController-sub",
  ) {
    this.pubSubHandler = new PubSubReceiverSender(
      sender_topic_name,
      receiver_topic_name,
      subscription_name,
    );
  }

  async getReservationResponse(message) {
    this.pubSubHandler.send_message(JSON.stringify(message));
    const upstream_res = await this.pubSubHandler().pull_single_message();
    console.log("Got upstream res");
    return JSON.parse(upstream_res);
  }
}

class ReservationController {
  constructor() {
    this.reservation_interface = new ReservationIface();
    this.createReservation = this.createReservation.bind(this);
    this.deleteReservation = this.deleteReservation.bind(this);
    this.getAllReservations = this.getAllReservations.bind(this);
    this.getReservationById = this.getReservationById.bind(this);
  }
  createReservation(req, res) {
    const people = req.body.people;
    const time = req.body.timeid;
    const user = req.body.userid;
    const reserv_obj = {
      message_code: 2,
      people: people,
      timeid: time,
      userid: user,
    };
    this.reservation_interface
      .getReservationResponse(reserv_obj)
      .then((reserv_res) => {
        res.status(reserv_res.status).json(reserv_res.data);
      });
  }
  getAllReservations(req, res) {
    const reserv_obj = { message_code: 0 };
    this.reservation_interface
      .getReservationResponse(reserv_obj)
      .then((reserv_res) => {
        res.status(reserv_res.status).json(reserv_res.data);
      });
  }
  deleteReservation(req, res) {
    const res_id = req.body.id;
    console.log(req.body.id);
    const reserv_obj = { message_code: 1, id: res_id };
    this.reservation_interface
      .getReservationResponse(reserv_obj)
      .then((reserv_res) => {
        res.status(reserv_res.status).json(reserv_res.data);
      });
  }
  getReservationById(req, res) {
    const res_id = req.body.id;
    const reserv_obj = { message_code: 3, id: res_id };
    this.reservation_interface
      .getReservationResponse(reserv_obj)
      .then((reserv_res) => {
        res.status(reserv_res.status).json(reserv_res.data);
      });
  }
}

module.exports = { ReservationController };

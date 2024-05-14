const { PubSubReceiverSender, PubSubSender } = require("../common/PubSub");

class ReservationIface extends PubSubReceiverSender{
  constructor(){
    super("reservation-downstream","reservation-upstream","ReservationController-sub"); 
  }

  async getReservationResponse(message) {
    this.sender.send_message(JSON.stringify(message));
    const upstream_res = await this.receiver.pull_single_message();
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
    this.getReservationByEmail= this.getReservationByEmail.bind(this);
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
    const res_id = req.query.id;
    const reserv_obj = { message_code: 3, id: res_id };
    this.reservation_interface
      .getReservationResponse(reserv_obj)
      .then((reserv_res) => {
        res.status(reserv_res.status).json(reserv_res.data);
      });
  }
  getReservationByEmail(req,res){
    const email = req.query.email;
    const reserv_obj ={
      message_code: 4, email: email
    };
    this.reservation_interface
      .getReservationResponse(reserv_obj)
      .then((reserv_res) => {
        res.status(reserv_res.status).json(reserv_res.data);
      });
  }
}

module.exports = { ReservationController };
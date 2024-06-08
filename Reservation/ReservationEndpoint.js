const { ReservationCore } = require('./ReservationCore');
require('dotenv').config();


class ReservationEndpoint {
  constructor() {
    this.reservation_manager = new ReservationCore();
    this.createReservation = this.createReservation.bind(this);
    this.deleteReservation = this.deleteReservation.bind(this);
    this.getAllReservations = this.getAllReservations.bind(this);
    this.getReservationById = this.getReservationById.bind(this);
    this.getReservationByEmail= this.getReservationByEmail.bind(this);
    this.getReservationByLocal = this.getReservationByLocal.bind(this);
    this.editReservation = this.editReservation.bind(this);
  }
  async editReservation(req,res){
    const id = req.body.id;
    const time = req.body.time;
    const user = req.body.user;
    const people = req.body.people;
    const reserv_obj = {
      message_code: 6,
      id: id,
      people: people,
      timeid: time,
      userid: user,
    };
    const reserv_string = await this.reservation_manager.process_message(reserv_obj);
    const reserv_res = JSON.parse(reserv_string);
    res.status(reserv_res.status).json(reserv_res.data);

  }
  async getReservationByLocal(req,res){
    const email = req.query.local;
    const reserv_obj ={
      message_code: 5, local: local
    };
    const reserv_string = await this.reservation_manager.process_message(reserv_obj);
    const reserv_res = JSON.parse(reserv_string);
    res.status(reserv_res.status).json(reserv_res.data);
  }
  async createReservation(req, res) {
    const people = req.body.people;
    const time = req.body.timeid;
    const user = req.body.userid;
    const local = req.body.local;
    const reserv_obj = {
      message_code: 2,
      people: people,
      timeid: time,
      userid: user,
      local: local
    };
    const reserv_string = await this.reservation_manager.process_message(reserv_obj);
    const reserv_res = JSON.parse(reserv_string);
    res.status(reserv_res.status).json(reserv_res.data);
  }
  async getAllReservations(req, res) {
    const reserv_obj = { message_code: 0 };
    const reserv_string = await this.reservation_manager.process_message(reserv_obj);
    const reserv_res = JSON.parse(reserv_string);
    res.status(reserv_res.status).json(reserv_res.data);
  }
  async deleteReservation(req, res) {
    const res_id = req.body.id;
    console.log(req.body.id);
    const reserv_obj = { message_code: 1, id: res_id };
    const reserv_string = await this.reservation_manager.process_message(reserv_obj);
    const reserv_res = JSON.parse(reserv_string);
    res.status(reserv_res.status).json(reserv_res.data);
  }
  async getReservationById(req, res) {
    const res_id = req.query.id;
    const reserv_obj = { message_code: 3, id: res_id };
    const reserv_string = await this.reservation_manager.process_message(reserv_obj);
    const reserv_res = JSON.parse(reserv_string);
    res.status(reserv_res.status).json(reserv_res.data);
  }
  async getReservationByEmail(req,res){
    const email = req.query.email;
    const reserv_obj ={
      message_code: 4, email: email
    };
    const reserv_string = await this.reservation_manager.process_message(reserv_obj);
    const reserv_res = JSON.parse(reserv_string);
    res.status(reserv_res.status).json(reserv_res.data);
  }
}

module.exports = { ReservationEndpoint };
const axios = require('axios');
const { response } = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class ReservationController {
  constructor() {
    this.secretKey =  process.env.secret_key;
    this.serviceHost = process.env.reserv_host;
    this.servicePort = process.env.reserv_port;
    this.createReservation = this.createReservation.bind(this);
    this.deleteReservation = this.deleteReservation.bind(this);
    this.getAllReservations = this.getAllReservations.bind(this);
    this.getReservationById = this.getReservationById.bind(this);
    this.getReservationByEmail= this.getReservationByEmail.bind(this);
    this.getReservationByLocal= this.getReservationByLocal.bind(this);
  }
  createReservation(req, res) {
    const people = req.body.people;
    const time = req.body.timeid;
    const user = req.body.userid;
    const local = req.body.local;

    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/reserv/reservation/new`; 
      
    axios.post(targetServiceUrl, {
      message_code: 2,
      people: people,
      timeid: time,
      userid: user,
      local: local
    })
    .then(response => {
      console.log('Response from target service:', response.data);
      res.status(response.status).json(response.data);
    })
    .catch(error => {
      res.status(error.response.status).json(error.response.data);
    });
  }
  getAllReservations(req, res) {
    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/reserv/reservation/getAll`; 
      
    axios.get(targetServiceUrl)
    .then(response => {
      console.log('Response from target service:', response.status);
      res.status(response.status).json(response.data);
    })
    .catch(error => {
      res.status(error.response.status).json(error.response.data);
    });
  }
  deleteReservation(req, res) {
    const res_id = req.body.id;
    console.log(req.body.id);
    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/reserv/reservation/delete`; 
      
    axios.delete(targetServiceUrl, {id: res_id })
    .then(response => {
      console.log('Response from target service:', response.data);
      res.status(response.status).json(response.data);
    })
    .catch(error => {
      res.status(error.response.status).json(error.response.data);
    });
    
  }
  getReservationById(req, res) {
    const res_id = req.query.id;
    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/reserv/reservation/getById`; 
      
    axios.get(`${targetServiceUrl}?id=${res_id}`)
    .then(response => {
  
      console.log('Response from target service:', response.data);
      res.status(response.status).json(response.data);
    })
    .catch(error=>{
      console.log('Response from target service:', error);
      res.status(error.response.status).json(error.response.data);
    })
  }
  getReservationByLocal(req,res){
    const local = req.query.local;
    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/reserv/reservation/getByLocal`; 

    axios.get(`${targetServiceUrl}?local=${local}`)
    .then(response =>{
      console.log('Response from target service:', response.data);
      res.status(response.status).json(response.data);
    })
    .catch(error=>{
      console.log('Response from target service:', error);
      res.status(error.response.status).json(error.response.data);
    })
       
  }
  editReservation(req,res){
    const id = req.body.id;
    const time = req.body.time;
    const user = req.body.user;
    const people = req.body.people;
    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/reserv/reservation/edit`; 

    axios.put(targetServiceUrl,{
      "id": id,
      "people": people,
      "timeid": time,
      "userid": user,
    })
    .then(response =>{
      console.log('Response from target service:', response.data);
      res.status(response.status).json(response.data);
    })
    .catch(error=>{
      console.log('Response from target service:', error);
      res.status(error.response.status).json(error.response.data);
    })
       
  }
  getReservationByEmail(req,res){
    const email = req.query.email;
    
    const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/reserv/reservation/getByEmail`; 
      
    axios.get(`${targetServiceUrl}?email=${email}`)
    .then(response => {
  
      console.log('Response from target service:', response.data);
      res.status(response.status).json(response.data);
    })
    .catch(error=>{
      console.log('Response from target service:', error);
      res.status(error.response.status).json(error.response.data);
    })
    
  }
}

module.exports = { ReservationController };
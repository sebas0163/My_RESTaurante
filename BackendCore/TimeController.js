const axios = require('axios');
require('dotenv').config();
class TimeController {
	constructor() {
		this.secretKey =  process.env.secret_key;
    	this.serviceHost = process.env.time_host;
    	this.servicePort = process.env.time_port;
		this.getSchedule = this.getSchedule.bind(this);
		this.getScheduleByLocal = this.getScheduleByLocal.bind(this);
	}

	getSchedule(req, res) {
		const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/time/time/getSchedule`; 
		
		axios.get(targetServiceUrl)
		.then(response => {
		console.log('Response from target service:', response.status);
		res.status(response.status).json(response.data);
		})
		.catch(error => {
		res.status(error.response.status).json(error.response.data);
		});

	}
	getScheduleByLocal(req,res){
		const local = req.query.local;
		const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/time/time/getByLocal`; 

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
}

module.exports = { TimeController };


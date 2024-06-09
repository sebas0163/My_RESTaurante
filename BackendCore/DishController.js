const axios = require('axios');

class DishReq {
	constructor(dish1, dish2) {
		this.dish1 = dish1;
		this.dish2 = dish2;
	}
}

class DishController {
	constructor() {
		
        this.serviceHost = process.env.food_host;
        this.servicePort = process.env.food_port;
		this.getAllMenu = this.getAllMenu.bind(this);
		this.askForDish = this.askForDish.bind(this);
	}

	getAllMenu(req, res) {
		const message = req.body.message || req.query.message || "default message";
		const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/food/food/menu`; 
      
		axios.get(targetServiceUrl)
		.then(response => {
		  console.log('Response from target service:', response.status);
		  res.status(response.status).json(response.data);
		})
		.catch(error => {
			console.log(error);
		  res.status(error.response.status).json(error.response.data);
		});
	}

	askForDish(req, res) {
		const dish1 = req.body.dish1;
		const dish2 = req.body.dish2;

		const dishReq = new DishReq(dish1, dish2);

		console.log("controller",dishReq);

		const targetServiceUrl = `http://${this.serviceHost}:${this.servicePort}/food/food/recomendation`; 
      
		axios.post(targetServiceUrl, {
			"dish1":dish1,
			"dish2":dish2
		  })
		.then(response => {
		  console.log('Response from target service:', response.status);
		  res.status(response.status).json(response.data);
		})
		.catch(error => {
			console.log(error);
		  res.status(error.response.status).json(error.response.data);
		});
	}
}

module.exports = { DishController };


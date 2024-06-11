
const { FoodCore } = require("./FoodCore");
class DishReq {
	constructor(dish1, dish2) {
		this.dish1 = dish1;
		this.dish2 = dish2;
	}
}

class FoodEndpoint {
	constructor() {
		this.food_manager = new FoodCore();
		this.getAllMenu = this.getAllMenu.bind(this);
		this.askForDish = this.askForDish.bind(this);
	}

	async getAllMenu(req, res) {
		const food_res = await this.food_manager.handle_get_all_menu();
		console.log("sending: ", food_res);
		res.status(food_res.status).json(food_res.data);
	}

	async askForDish(req, res) {
		const dish1 = req.body.dish1;
		const dish2 = req.body.dish2;
		
		const dishReq = new DishReq(dish1, dish2);

		console.log(dishReq);

		const food_res = await this.food_manager.handle_get_recommendation(dishReq);
		res.status(food_res.status).json(food_res.data);
	}
}

module.exports = {FoodEndpoint};


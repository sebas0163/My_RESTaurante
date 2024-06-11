const { DatabaseController } = require("./DatabaseController");
const { FoodMatcher } = require("./FoodMatcher");

class FoodCore {
	constructor() {
		this.databaseController = new DatabaseController();
		this.foodMatcher = new FoodMatcher();
	}

	async handle_get_all_menu() {
		try{
			const menu = await this.databaseController.getAllMenuWithoutRef();
			const jsonString = JSON.stringify(menu);
			return {'status':200, 'data':jsonString};
		}catch(error){
			return {'status':500, 'data':error}
		}
	}

	async handle_get_recommendation(req_obj) {
		console.log("reqobj: ", req_obj);
		try{
			const dish1Value = req_obj.dish1;
			const dish2Value = req_obj.dish2;
			
			const result = await this.foodMatcher.findMatchForDish(
				dish1Value,
				dish2Value,
			);
			
			const jsonString = JSON.stringify(result);
			return {'status':200, 'data':jsonString};
		}
		catch(error){
			return {'status':500, 'data':error}
		}
	}

	
}


module.exports = { FoodCore };

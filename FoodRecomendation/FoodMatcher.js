// Assuming DatabaseController is correctly implemented as shown before
const { DatabaseController } = require('../common/DatabaseController');

class FoodMatcher {
    constructor() {
        this.databaseController = new DatabaseController();
    }

    cleanDishObject(dish) {
        // Create a new object with only the properties you want to include
        return {
            name: dish.name,
            type: dish.type,
            // Include other properties as needed but exclude req1 and req2
            // Or alternatively, transform req1 and req2 to include only the IDs or other minimal info
        };
    }

    async findMatchForDish(dish1Name, dish2Name) {
        try {
            const allDishes = await this.databaseController.getAllMenu(); // Fetch all dishes
            
            let dish1 = allDishes.find(dish => dish.name.trim() === dish1Name.trim());
            let dish2 = allDishes.find(dish => dish.name.trim() === dish2Name.trim());
            
            if (!dish1 || !dish2) {
                throw new Error("One or both dishes not found");
            }
            
            // Assuming there are only 3 types of dishes
            let dishTypes = new Set(['Dessert', 'Drink', 'main plate']);
            dishTypes.delete(dish1.type.trim());
            dishTypes.delete(dish2.type.trim());
            
            let missingType = ''

            if (dishTypes.size === 1) {
                missingType = Array.from(dishTypes)[0]; // Return the missing type
            } else {
                throw new Error("Dish1 and Dish2 are not of different types or an unexpected error occurred");
            }
            console.log('missingType is: ', missingType)
            // Start of the rest of the code

            // Collecting all required IDs into an array for easier management
            const requiredDishIds = [dish1.req1Id, dish1.req2Id, dish2.req1Id, dish2.req2Id].filter(id => id !== null);
            console.log('requiredDishIds is: ', requiredDishIds)
            // Initialize an object to hold the fetched documents
            let relatedDishes = {};

            // Using Promise.all to fetch all at once for efficiency
            try {
                const fetchedDishesPromises = requiredDishIds.map(id => this.databaseController.getDishById(id));
                const fetchedDishesResults = await Promise.all(fetchedDishesPromises);

                // Organizing the fetched documents into a more accessible structure
                fetchedDishesResults.forEach((dish, index) => {
                    if (dish) { // Make sure the dish exists
                        const key = requiredDishIds[index];
                        relatedDishes[key] = dish;
                    }
                });

                console.log('related dishes: ', relatedDishes);
                // Now, relatedDishes contains all the additional info for req1Id and req2Id of both dishes
                // You can proceed with your logic using the fetched data

            } catch (fetchError) {
                console.error("Error fetching related dishes: ", fetchError);
                throw fetchError; // Optionally rethrow or handle the error differently
            }


            // Initialize an array to hold the matching dishes
            let matchingDishes = [];

            // Iterate over the relatedDishes object to find matches
            for (let key in relatedDishes) {
                if (relatedDishes.hasOwnProperty(key)) {
                    const dish = relatedDishes[key];
                    if (dish.type && dish.type.trim() === missingType) {
                        matchingDishes.push(dish);
                    }
                }
            }

            console.log('matching dishes: ', matchingDishes);
            // Clean up each dish object in matchingDishes using the helper function
            const cleanedMatchingDishes = matchingDishes.map(this.cleanDishObject);

            console.log('clean matching dishes: ', cleanedMatchingDishes);
            return cleanedMatchingDishes;

        } catch (error) {
            console.error(error);
            throw error; // Rethrow or handle accordingly
        }
    }
}

module.exports = { FoodMatcher }
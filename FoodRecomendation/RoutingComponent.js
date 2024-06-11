const express = require("express");
const router = express.Router();
const { FoodEndpoint } = require('./FoodEndpoint');

food_endpoint = new FoodEndpoint();

router.get('/food/menu', food_endpoint.getAllMenu);
router.post('/food/recomendation', food_endpoint.askForDish);

module.exports = router;


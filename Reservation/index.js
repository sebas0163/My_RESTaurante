require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 1235;

// Swagger configuration


app.use(express.json()); // Middleware to parse JSON requests


app.use(cors());
app.use('/reserv', require('./RoutingComponent'));


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

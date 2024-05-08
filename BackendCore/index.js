require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 1234;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API",
      version: "1.0.0",
      description: "API Documentation",
    },
  },
  apis: ["./src/*.js"], // Point to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use(express.json()); 

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use("/api", require("./RoutingComponent"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

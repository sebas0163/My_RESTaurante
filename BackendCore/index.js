require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 8000;
const crypto = require('crypto');

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

app.use(express.json()); // Middleware to parse JSON requests

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const hashAuthMiddleware = (req, res, next) => {
    const authRequiredHeader = req.headers['x-auth-required'];
    if (!authRequiredHeader) {
        // Skip authentication if the header is not present
        return next();
    }

    const secret = process.env.HASH_SECRET;
    const hashHeader = req.headers['x-auth-hash']; // Assume hash is sent in this header

    if (!hashHeader) {
        return res.status(401).json({ error: 'No authentication hash provided' });
    }

    const bodyString = req.body && Object.keys(req.body).length ? JSON.stringify(req.body) : '';
    const expectedHash = crypto.createHmac('sha256', secret)
                               .update(bodyString)
                               .digest('hex');
    console.log("Expecting hash", expectedHash);

    if (hashHeader !== expectedHash) {
        return res.status(401).json({ error: 'Invalid authentication hash' });
    }

    next();
};


app.use(cors());
app.use(hashAuthMiddleware);
app.use('/api', require('./RoutingComponent'));



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

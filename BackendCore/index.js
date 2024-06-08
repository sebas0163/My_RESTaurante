const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const cors = require("cors");
const app = express();
const port = 8000;

const privateKey = fs.readFileSync('privatekey.pem', 'utf8');
const certificate = fs.readFileSync('certificate.pem', 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate
};

app.use(bodyParser.json());

// Middleware to check JWT token
app.use((req, res, next) => {
    if (req.path === '/api/user/login' || req.path === '/api/user/create') {
        return next();
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).send('Token is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).send('Token is required');
    }

    jwt.verify(token, "SuperOdontologosAvanzados", (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token');
        }
        req.user = decoded;
        next();
    });
});

const routes = require('./RoutingComponent'); // Adjust path if necessary
app.use('/api', routes);

https.createServer(credentials, app).listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
});

const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;


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

    jwt.verify(token, process.env.secret_key, (err, decoded) => {
        if (err) {
            return res.status(401).send('Invalid token');
        }
        req.user = decoded;
        next();
    });
});

const routes = require('./RoutingComponent'); // Adjust path if necessary
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
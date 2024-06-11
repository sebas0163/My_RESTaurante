const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const crypto = require('crypto');
const port = process.env.PORT || 8000;

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
app.use(bodyParser.json());
app.use(hashAuthMiddleware);

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

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Load secret from environment variables
const secret = process.env.HASH_SECRET;
if (!secret) {
    throw new Error('AUTH_SECRET environment variable is not set');
}

// Function to generate hash for a given JSON body
const generateHash = (body) => {
    const bodyString = body && Object.keys(body).length ? JSON.stringify(body) : '';
    const hash = crypto.createHmac('sha256', secret)
                       .update(bodyString)
                       .digest('hex');
    return hash;
};

// Read the request body from a JSON file (for example purposes)
const bodyFilePath = path.join(__dirname, 'requestBody.json');
fs.readFile(bodyFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the request body file:', err);
        return;
    }

    const requestBody = data ? JSON.parse(data) : {};
    const hash = generateHash(requestBody);

    console.log('Generated hash:', hash);
});


const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const app = express();
const port = 3000;

// Load environment variables from .env file
dotenv.config();
const apiKey = process.env.API_KEY;

app.use(bodyParser.json());

// Define the API endpoint
app.post('/api/objects', (req, res) => {
  const objects = req.body.objects;
  // Perform any processing or modification on the list of objects here
  const modifiedObjects = objects.map(obj => ({ ...obj, modified: true }));
  // Return the modified list of objects to the client
  res.json({ objects: modifiedObjects });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

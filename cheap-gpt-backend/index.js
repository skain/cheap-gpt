const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require("openai");
const cors = require('cors');

const app = express();
const port = 3000;

// Load environment variables from .env file
dotenv.config();
const apiKey = process.env.API_KEY;

const configuration = new Configuration({
	apiKey: apiKey
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(cors());


// Define the API endpoint
app.post('/api/objects', (req, res) => {
  const objects = req.body.objects;
  // Perform any processing or modification on the list of objects here
  const modifiedObjects = objects.map(obj => ({ ...obj, modified: true }));
  // Return the modified list of objects to the client
  res.json({ objects: modifiedObjects });
});

app.post('/api/test', async (req, res) => {
	try {
		const c = await runCompletion();
		res.json({ completion: c});
	} catch (error) {
		res.status(500).json({ error: error });
	}
});

app.post('/api/test2', async (req, res) => {
	const messages = req.body.messages;
	console.log('start');
	console.log(messages);
	console.log(messages[0]);
	try {
		const c = await runChatCompletion(messages);
		res.json({ completion: c });
	} catch (error) {
		res.status(500).json({ error: error });
	}
});

async function runCompletion() {
	const completion = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: "How are you today?",
	});
	return completion.data.choices[0].text;
}

async function runChatCompletion(messages) {
	const completion = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: messages,
	});

	return completion.data.choices[0].message.content;
}

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

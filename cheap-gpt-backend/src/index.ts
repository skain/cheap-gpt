import {Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ChatMessage } from "./chatMessage.js";

const app = express();
const port = 3000;

dotenv.config();

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(cors());

app.post('/api/chat', async (req, res) => {
	const messages: {role: string, content: string}[] = req.body.messages;
	console.log("MESSAGES:");
	console.log(messages);
	try {
		const c = await runChatCompletion(messages);
		res.json({ completion: c });
	} catch (error) {
		res.status(500).json({ error: error });
	}
});

// async function runCompletion() {
// 	const completion = await openai.createCompletion({
// 		model: "text-davinci-003",
// 		prompt: "How are you today?",
// 	});
// 	return completion.data.choices[0].text;
// }

async function runChatCompletion(messages: any[]) {
	const completion = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: messages,
	});

	let response = completion.data.choices[0].message.content;
	console.log("RESPONSE:");
	console.log(response);
	return response;
}

// Start the server
app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});

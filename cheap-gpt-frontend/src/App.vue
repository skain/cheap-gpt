<script setup>
import { reactive } from 'vue'
const messageStack = reactive({ messages: [] });
const inputModel = reactive({ userInput: null, sendOnEnter: true });
const sdConverter = new showdown.Converter();

function sendMessages() {
	messageStack.messages.push({ role: "user", content: inputModel.userInput });
	inputModel.userInput = '';
	fetch('http://localhost:3000/api/chat', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(messageStack)
	})
		.then(response => response.json())
		.then(data => handleResponseData(data))
		.catch(error => console.log(error));
}

function handleResponseData(data) {
	console.log(data);
	let md = sdConverter.makeHtml(data.completion);
	messageStack.messages.push({ role: "assistant", content: md });
	setTimeout(() => {
		//sucks, but this delay accounts for the time it takes vue to 
		//update the page. probaby a better way but this is working.
		window.scrollTo(0, document.body.scrollHeight);
	}, 500);
}

function clearMessages() {
	messageStack.messages.length = 0;
}

function enterKeyUp() {
	if (inputModel.sendOnEnter) {
		sendMessages();
	}
}
</script>

<template>
	<div id="messageStack">
		<h1>Cheap GPT</h1>
		<div v-for="msg in messageStack.messages" :class="`${msg.role} messageContent`">
			<h3>{{ msg.role }}</h3>
			<div v-html="msg.content"></div>
		</div>

		<button type="button" id="clearBtn" @click="clearMessages">Clear</button>
	</div>
	<div id="input">
		<hr />
		<div id="ui">
			<textarea v-model="inputModel.userInput" rows="4" @keyup.enter="enterKeyUp"
				placeholder="Type your message here..."></textarea>
			<div>
				<button type="button" @click="sendMessages">Send</button>
				<div>
					<input type="checkbox" v-model="inputModel.sendOnEnter" id="sendOnEnter" />
					<label for="sendOnEnter">Send on enter?</label>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
div.messageContent {
	position: relative;
}

div.messageContent::before {
	content: open-quote;
	position: absolute;
	left: -3px;
	top: -45px;
	font-size: 7rem;
	font-family: 'Playfair Display', serif;
	color: rgba(233, 233, 233, .5);
}

div.messageContent::after {
	content: no-close-quote;
}

h3 {
	text-align: left;
	text-transform: capitalize;
	font-weight: bold;
}

#messageStack>div {
	border-radius: 8px;
	margin: 4px auto;
	padding: 1.6em;
}

#ui {
	display: flex;
	align-items: top;
	gap: 10px;
}

#ui>div {
	display: flex;
	flex-direction: column;
}

#ui label {
	font-size: .8em;
	font-style: italic;
}

#ui>textarea {
	flex: 1;
}

div.system {
	background-color: rgb(30, 30, 30);
}

div.user {
	background-color: rgb(60, 60, 60);
}

div.assistant {
	background-color: rgb(120, 120, 120);
}

#messageStack {
	position: relative;
}
</style>

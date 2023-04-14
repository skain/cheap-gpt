<script setup>
import { reactive } from 'vue'
const messageStack = reactive({ messages: [] });
const inputModel = reactive({ userInput: null });

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
	// let cleaned = addPreTags(data.completion);
	// cleaned = addBrTags(cleaned);
	messageStack.messages.push({ role: "assistant", content: data.completion });
}

function clearMessages() {
	messageStack.messages.length = 0;
}

function addPreTags(str) {
	// Regular expression to find text surrounded by 3 backticks
	const regex = /```([\s\S]*?)```/g;

	// Replace backticks with <pre> tags
	return str.replace(regex, '<pre>$1</pre>');
}

function addBrTags(str) {
	return str.replace(/\n+/g, '<br>');
}

</script>

<template>
	<div id="messageStack">
		<h1>Message Stack</h1>
		<div v-for="msg in messageStack.messages" :class="`${msg.role} messageContent`">
			<h3>{{ msg.role }}</h3>
			<div v-html="msg.content"></div>
		</div>

		<button type="button" id="clearBtn" @click="clearMessages">Clear</button>
	</div>
	<div id="input">
		<h1>Input</h1>
		<div id="ui">
			<textarea v-model="inputModel.userInput" rows="4" @keyup.enter="sendMessages"></textarea> <button type="button" @click="sendMessages">Send</button>
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
	color: rgba(233,233,233, .5);
}

div.messageContent::after {
	content: no-close-quote;
}

h3 {
	text-align: left;
	text-transform: capitalize;
	font-weight: bold;
}
div {
	padding: 1em;
}

#messageStack>div {
	border-radius: 8px;
	margin: 4px auto;
}

#ui {
	display: flex;
	align-items: center;
	gap: 10px;
}

#ui > textarea {
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

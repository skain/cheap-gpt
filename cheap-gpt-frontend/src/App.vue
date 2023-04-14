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
		<div v-for="msg in messageStack.messages">
			<h3>{{ msg.role }}</h3>
			<div v-html="msg.content"></div>
		</div>

		<button type="button" id="clearBtn" @click="clearMessages">Clear</button>
	</div>
	<div id="inputUI">
		<h1>Input</h1>
		<input type="text" v-model="inputModel.userInput" /> <button type="button" @click="sendMessages">Send</button>
	</div>
</template>

<style scoped>
div {
	border: solid 1px red;
	padding: 1em;
}

#messageStack {
	position: relative;
}
</style>

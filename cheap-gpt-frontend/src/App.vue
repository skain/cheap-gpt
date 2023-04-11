<script setup>
import { reactive } from 'vue'
const messageStack = reactive({ messages: [] });
const inputModel = reactive({ userInput: null });

function sendMessages() {
	messageStack.messages.push({ role: "user", content: inputModel.userInput });
	fetch('http://localhost:3000/api/test2', {
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
	messageStack.messages.push({ role: "assistant", content: data.completion });
}

function clearMessages() {
	messageStack.messages.length = 0;
}
</script>

<template>
	<div id="messageStack">
		<h1>Message Stack</h1>
		<div v-for="msg in messageStack.messages">
			<h3>{{ msg.role }}</h3>
			<div>{{ msg.content }}</div>
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

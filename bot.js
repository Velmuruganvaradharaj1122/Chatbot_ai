// Initialization & Events

window.addEventListener("load", () => {
  setTimeout(() => {
    appendMessage("bot", "Hello! How can I help you today?");
  }, 500);
});

// Toggle chatbot visibility
document.getElementById("chat-icon").addEventListener("click", () => {
  const chatContainer = document.getElementById("chat-container");
  chatContainer.classList.toggle("hidden");
  chatContainer.style.opacity = chatContainer.classList.contains("hidden") ? 0 : 1;
});

// Send message on Enter key
document.getElementById("user-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// Core Chat Functions

function sendMessage() {
  const input = document.getElementById("user-input");
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage("user", userText);
  input.value = "";

  showTyping();

  setTimeout(() => {
    removeTyping();
    const botReply = getBotResponse(userText);
    appendMessage("bot", botReply);
  }, 1000);
}

function appendMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const message = document.createElement("div");
  message.className = `message ${sender}`; // ✅ Matches CSS: .message.bot or .message.user
  message.innerHTML = `<strong>${sender === "bot" ? "Bot" : "You"}:</strong> ${text} <span>${time}</span>`;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const chatBox = document.getElementById("chat-box");
  const typing = document.createElement("div");
  typing.id = "typing";
  typing.className = "message bot";
  typing.innerHTML = `<strong>Bot:</strong> <em>Typing...</em>`;
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

// Utility Features

function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice input not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById("user-input").value = transcript;
    sendMessage();
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    alert("Voice input error: " + event.error);
  };
}

function exportChat() {
  const chatBox = document.getElementById("chat-box");
  const messages = chatBox.querySelectorAll(".message");
  let chatText = "";

  messages.forEach(msg => {
    chatText += msg.textContent.trim() + "\n\n";
  });

  const blob = new Blob([chatText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "chat_history.txt";
  document.body.appendChild(link); // Ensure it's in DOM
  link.click();
  document.body.removeChild(link); // Clean up
}


function clearChat() {
  if (confirm("Clear all chat messages?")) {
    const chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";
    appendMessage("bot", "Chat cleared. How can I help you now?");
    console.log("Chat cleared.");
  }
}


function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// Response Engine

const botResponses = {
  greetings: {
    "hai": "Hello! How can I assist you today? 😊",
    "hey": "Hey there! How can I help you? 👋",
    "hi": "Hi! What can I do for you? 😊",
    "hey there ": "Hey there! How's it going? 👋",
    "hello": "Hi there! 👋",
    "good morning": "Good morning! 🌞 Wishing you a productive day ahead!",
    "good night": "Good night! 🌙 Sleep well and sweet dreams.",
    "bye": "Goodbye! Have a nice day!"
  },
  identity: {
    "your name": "I'm your friendly chatbot assistant!",
    "who made you": "I was created by a developer Velmurugan, just for you!",
    "what can you do": "I can chat, tell jokes, share facts, inspire you, and more!",
    "how old are you": "I was born the moment you started running this code!",
    "where are you from": "I live in the digital world 🌐"
  },
  help: {
    "help": "Sure! Ask me anything.",
    "math": "Sure! Give me a math problem and I’ll try solving it.",
    "programming": "Coding is like cooking — follow the recipe, then add your own flavor!",
    "bored": "Let’s do something fun! Want a joke, riddle, or fact?"
  },
  gratitude: {
    "thanks": "You're welcome! 😊",
    "thank you": "You're welcome! 😊",
    "yes": "Awesome! 👍",
    "no": "Got it, maybe next time."
  },
  fun: {
    "joke": "Why don't scientists trust atoms? Because they make up everything!",
    "riddle": "I’m light as a feather, yet the strongest man can’t hold me for long. (Answer: Breath)",
    "story": "Once upon a time, there was a chatbot who loved chatting with you… and still does!"
  },
  facts: {
    "fun fact": "Octopuses have three hearts and blue blood! 🐙",
    "trivia": "Sharks existed before trees! 🦈"
  },
  motivation: {
    "motivate me": "You are capable of amazing things! 💪",
    "inspire me": "Push yourself, because no one else is going to do it for you.",
    "quote": "“The best way to get started is to quit talking and begin doing.” – Walt Disney"
  },
  timeDate: {
    "date": () => `Today's date is ${new Date().toLocaleDateString()}.`,
    "time": () => `It's currently ${new Date().toLocaleTimeString()}.`
  }
};

function getBotResponse(input) {
  input = input.toLowerCase();

  if (/^[0-9+\-*/().\s]+$/.test(input)) {
    try {
      const result = eval(input);
      return `The answer is ${result}`;
    } catch {
      return "Hmm, that doesn't look like a valid math expression.";
    }
  }

  for (let category in botResponses) {
    for (let key in botResponses[category]) {
      if (input.includes(key)) {
        const response = botResponses[category][key];
        return typeof response === "function" ? response() : response;
      }
    }
  }

  return "Sorry, I didn't understand that.";
}

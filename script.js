// DOM ELEMENT
const authContainer = document.getElementById('auth-container');
const chatContainer = document.getElementById('chat-container');
const authTitle = document.getElementById('auth-title');
const authBtn = document.getElementById('auth-btn');
const authSwitchText = document.getElementById('auth-switch-text');
const authSwitchLink = document.getElementById('auth-switch-link');
const usernameGroup = document.getElementById('username-group');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const usernameInput = document.getElementById('username');
const displayUsername = document.getElementById('display-username');
const userAvatar = document.getElementById('user-avatar');
const messageContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const userList = document.getElementById('user-list');

// state
let isLogin = true;
let currentUser = null;
let messageCount = 0;

// simulated user database
const usersDatabase = [
    { email: 'user@gmail.com', password: '12345', username: 'You' },
    { email: 'sara@gmail.com', password: 'password', username: 'Sara Ali' },
    { email: 'ahmed@gmail.com', password: 'password', username: 'Ahmed Khan' },
    { email: 'haider@gmail.com', password: 'password', username: 'Umer Hayat' }
];

// initial messages (Load from localStorage if available, otherwise use default)
let chatMessages = JSON.parse(localStorage.getItem('chat_messages')) || [
    { sender: 'Sara Ali', content: 'Hey there! ', time: '10:00 AM', type: 'received' },
    { sender: 'Ahmed Khan', content: 'Hey Sara! How are you? ', time: '10:02 AM', type: 'sent' },
    { sender: 'Umer Hayat', content: 'Hello everyone! ', time: '10:05 AM', type: 'sent' }
];

// switch between login and register
authSwitchLink.addEventListener('click', () => {
    isLogin = !isLogin;
    if (isLogin) {
        authTitle.textContent = 'LogIn To ChatApp';
        authBtn.textContent = 'Login';
        authSwitchText.textContent = 'Don\'t have an account?';
        authSwitchLink.textContent = 'Register';
        usernameGroup.style.display = 'none';
    } else {
        authTitle.textContent = 'Create an Account';
        authBtn.textContent = 'Register';
        authSwitchText.textContent = 'Already have an account?';
        authSwitchLink.textContent = 'Login';
        usernameGroup.style.display = 'block';
    }
});

// authentication handler
authBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const username = usernameInput.value.trim();

    if (isLogin) {
        const foundUser = usersDatabase.find(u => u.email === email && u.password === password);
        if (foundUser) {
            currentUser = foundUser;
            if (displayUsername) displayUsername.textContent = foundUser.username;
            if (userAvatar) userAvatar.textContent = foundUser.username.charAt(0).toUpperCase();
            authContainer.style.display = 'none';
            chatContainer.style.display = 'flex';
            loadmessages();
        } else {
            alert('Invalid Email or Password');
        }
    } // register logic ke andar notification add karne ka code
else {
    if (email && password && username) {
        if (usersDatabase.some(u => u.email === email)) {
            alert('User with this email already exists');
            return;
        }
        const newUser = { email, password, username };
        usersDatabase.push(newUser);
        currentUser = newUser;
        if (displayUsername) displayUsername.textContent = username;
        if (userAvatar) userAvatar.textContent = username.charAt(0).toUpperCase();
        authContainer.style.display = 'none';
        chatContainer.style.display = 'flex';
        
        // Load existing messages first
        loadmessages();

        // WhatsApp style join notification message
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const notificationData = {
            sender: 'System',
            content: `${username} joined the chat`,
            time: time,
            type: 'notification'
        };
        addMessageToChat(notificationData);

        // add user to online list UI
        const li = document.createElement('li');
        li.innerHTML = `<span class="status-indicator"></span><span class="username">${username}</span>`;
        userList.appendChild(li);
    } else {
        alert('Please fill all fields');
    }
}
});

// load messages into chatbox
function loadmessages() {
    messageContainer.innerHTML = '';
    chatMessages.forEach(msg => {
        renderMessageToDOM(msg);
    });
}

// render single message to DOM

function renderMessageToDOM(messageData) {
    const messageElement = document.createElement('div');

    if (messageData.type === 'notification') {
        messageElement.classList.add('message-notification');
        messageElement.innerHTML = `
            <div class="notification-content">${messageData.content} — ${messageData.time}</div>
        `;
    } else {
        messageElement.classList.add('message', messageData.type === 'sent' ? 'message-sent' : 'message-received');
        messageElement.innerHTML = `
            <div class="message-content">${messageData.content}</div>
            <span class="message-time">${messageData.time} ${messageData.type === 'received' ? '. ' + messageData.sender : ''}</span>
        `;
    }

    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// add message, save to array and localStorage
function addMessageToChat(messageData) {
    chatMessages.push(messageData);
    localStorage.setItem('chat_messages', JSON.stringify(chatMessages));
    renderMessageToDOM(messageData);
}

// send btn event listeners
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// send message function with keyword-based responses
function sendMessage() {
    const content = messageInput.value.trim();
    if (content && currentUser) {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const messageData = {
            sender: currentUser.username,
            content,
            time,
            type: 'sent'
        };

        addMessageToChat(messageData);
        messageInput.value = '';

        // Smart/Keyword-based chatbot response after 1 second delay
        // Smart/Keyword-based chatbot response after 1 second delay
        setTimeout(() => {
            const lowerContent = content.toLowerCase();
            let botReply = "";
            let botName = "Sara Ali";

            // Expanded keyword matching logic for natural flow
            if (lowerContent.includes('hello') || lowerContent.includes('hi') || lowerContent.includes('hey')) {
                botReply = "Hey there! How's it going?";
                botName = "Sara Ali";
            } else if (lowerContent.includes('how are you')) {
                botReply = "I'm doing great, thanks for asking! What about you?";
                botName = "Ahmed Khan";
            } else if (lowerContent.includes('good') || lowerContent.includes('fine') || lowerContent.includes('great')) {
                botReply = "That's awesome to hear! 😊";
                botName = "Umer Hayat";
            } else if (lowerContent.includes('project') || lowerContent.includes('update')) {
                botReply = "Yes, I am working on the latest project update right now.";
                botName = "Umer Hayat";
            } else {
                // Relevant context-aware fallback instead of random generic ones
                const responses = [
                    { sender: 'Sara Ali', content: 'That sounds really interesting!' },
                    { sender: 'Ahmed Khan', content: 'Makes total sense to me.' },
                    { sender: 'Umer Hayat', content: 'Let me check on that and get back to you.' }
                ];
                const randomObj = responses[Math.floor(Math.random() * responses.length)];
                botReply = randomObj.content;
                botName = randomObj.sender;
            }

            const botMessageData = {
                sender: botName,
                content: botReply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'received'
            };

            addMessageToChat(botMessageData);
        }, 1000);    }
}

// simulate initial user login for demo convenience
window.addEventListener('load', () => {
    emailInput.value = 'user@gmail.com';
    passwordInput.value = '12345';
});
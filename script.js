// Toggle the emoji picker display
function toggleEmojiPicker() {
  const emojiPicker = document.getElementById("emojiPicker");
  if (emojiPicker.style.display === "none") {
      emojiPicker.style.display = "block";
  } else {
      emojiPicker.style.display = "none";
  }
}

// Insert the selected emoji into the textarea
function insertEmoji(emoji) {
  const textarea = document.getElementById("messageInput");
  textarea.value += emoji;  // Append emoji to the current text
}



  const apiUrl = 'https://samchat-omao.onrender.com'; // JSON server base URL

document.addEventListener('DOMContentLoaded', () => {
  const chatBody = document.getElementById('chatBody');
  const messageInput = document.getElementById('messageInput');
  const sendMessageBtn = document.getElementById('sendMessageBtn');

  // Fetch messages from the server
  async function loadMessages() {
    try {
      const response = await fetch(`${apiUrl}/messages`);
      const messages = await response.json();
      
      chatBody.innerHTML = ''; // Clear chat body

      // Append each message to the chat body
      messages.forEach(message => {
        const messageHTML = `
          <div class="d-flex ${message.from === 'You' ? 'justify-content-end' : 'justify-content-start'} mb-4">
            <img src="${message.avatar}" alt="avatar" style="width: 45px; height: 45px;" class="rounded-circle">
            <div class="ms-2">
              <p class="small p-2 mb-1 rounded ${message.from === 'You' ? 'bg-primary text-white' : 'bg-light'}">${message.content}</p>
              <p class="small text-muted">${message.timestamp}</p>
            </div>
          </div>
        `;
        chatBody.innerHTML += messageHTML;
      });

      // Scroll to the bottom of the chat body
      chatBody.scrollTop = chatBody.scrollHeight;
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  // Send a new message to the server
  async function sendMessage() {
    const content = messageInput.value.trim();
    if (content === '') return; // Don't send empty messages

    const newMessage = {
      from: 'You',
      content: content,
      timestamp: new Date('').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp'
    };

    try {
      // Send POST request to add new message
      await fetch(`${apiUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
      });

      // Clear the message input
      messageInput.value = '';

      // Reload messages to include the newly sent one
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  // Load messages when the page loads
  loadMessages();

  // Send a message when the send button is clicked
  sendMessageBtn.addEventListener('click', sendMessage);

  // Send a message when Enter key is pressed
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent the default behavior of the Enter key
      sendMessage();
    }
  });
});

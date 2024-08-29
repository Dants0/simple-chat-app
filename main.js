const ws = new WebSocket('ws://localhost:8081');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const usernameInput = document.getElementById('username-input');
const roomSelect = document.getElementById('room-select');
const newRoomInput = document.getElementById('new-room-input');
const createRoomButton = document.getElementById('create-room-button');

if (!messagesDiv || !messageInput || !sendButton || !usernameInput || !roomSelect || !newRoomInput || !createRoomButton) {
  console.error('Failed to get one or more DOM elements.');
  throw new Error('DOM elements not found');
}

const getUsername = () => usernameInput.value || 'Anonymous';
const getRoom = () => roomSelect.value;

function addMessage(username, message, isOwnMessage) {
  const messageElement = document.createElement('div');
  messageElement.className = `message ${isOwnMessage ? 'own' : 'other'}`;
  messageElement.textContent = isOwnMessage ? `Você: ${message}` : `${username}: ${message}`;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll para a última mensagem
}

function updateRoomSelect(rooms) {
  roomSelect.innerHTML = ''; // Limpa as opções atuais
  rooms.forEach(room => {
    const option = document.createElement('option');
    option.value = room;
    option.textContent = room;
    roomSelect.appendChild(option);
  });
}


ws.onopen = () => {
  console.log('Connected to WebSocket server');
};

ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    console.log(data); // Adicione isto para verificar a estrutura dos dados
    const { room, username, message, rooms, users } = data;

    if (room && room === getRoom()) {
      const isOwnMessage = username === getUsername(); // Verifica se a mensagem é do próprio usuário
      addMessage(username, message, isOwnMessage);
    }

    if (rooms) {
      updateRoomSelect(rooms); // Atualiza a lista de salas
    }
      
    
  } catch (err) {
    console.error('Error parsing message:', err);
  }
};

ws.onclose = () => {
  console.log('Disconnected from WebSocket server');
};

sendButton.onclick = () => {
  const message = messageInput.value;
  const username = getUsername();
  const room = getRoom();
  if (message) {
    ws.send(JSON.stringify({ room, username, message }));
    messageInput.value = '';
  }
};

messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendButton.click(); // Dispara o click do botão enviar
  }
});

createRoomButton.onclick = () => {
  const newRoom = newRoomInput.value.trim();
  if (newRoom) {
    ws.send(JSON.stringify({ action: 'createRoom', room: newRoom }));
    newRoomInput.value = '';
  }
};

roomSelect.addEventListener('change', () => {
  const room = getRoom();
  messagesDiv.innerHTML = ''; // Limpa as mensagens ao mudar de sala
  ws.send(JSON.stringify({ room, username: getUsername(), message: `${getUsername()} entrou na sala` }));
});

function toggleThemeButtonTrig(){
  //to-do
}
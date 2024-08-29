import WebSocket from 'ws';

// Conectando ao WebSocket Server na porta 8081
const ws = new WebSocket('ws://localhost:8081');

// Quando conectado ao servidor WebSocket
ws.on('open', () => {
  console.log('Connected to WebSocket server');

  // Exemplo de envio de uma mensagem para o servidor
  ws.send('Hello from client!');
});

// Receber mensagens do servidor
ws.on('message', (message: string) => {
  console.log(`Received from server: ${message}`);
});

ws.on('close', () => {
  console.log('Disconnected from WebSocket server');
});

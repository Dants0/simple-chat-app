import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8081 });
const rooms: { [key: string]: Set<WebSocket> } = {}; // Armazena as salas e os clientes conectados

wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected');

  // Enviar a lista inicial de salas para o novo cliente
  const roomsList = Object.keys(rooms);
  ws.send(JSON.stringify({ rooms: roomsList }));

  ws.on('message', (data: string) => {
    try {
      const { room, username, message, action } = JSON.parse(data);

      if (action === 'createRoom') {
        if (!rooms[room]) {
          rooms[room] = new Set();
          // Envia a lista atualizada de salas para todos os clientes
          const roomsList = Object.keys(rooms);
          console.log(roomsList)
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ rooms: roomsList }));
            }
          });
        }
        return;
      }

      if (typeof room !== 'string' || typeof username !== 'string' || typeof message !== 'string') {
        console.error('Invalid message format');
        return;
      }

      // Adiciona o cliente à sala se não estiver presente
      if (!rooms[room]) {
        rooms[room] = new Set();
      }
      rooms[room].add(ws);

      const formattedMessage = `${username}: ${message}`;
      console.log(`Received message: ${formattedMessage}`);

      // Envia a mensagem para todos os clientes na mesma sala
      rooms[room].forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ room, username, message }));
        }
      });
    } catch (err) {
      console.error('Error parsing message:', err);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // Remove o cliente de todas as salas
    for (const room in rooms) {
      rooms[room].delete(ws);
      if (rooms[room].size === 0) {
        delete rooms[room];
      }
    }
  });
});

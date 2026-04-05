const { Server } = require('socket.io');
const registerCosmosHandler = require('./handlers/cosmosHandler');
const registerMoveHandler = require('./handlers/moveHandler');
const registerChatHandler = require('./handlers/chatHandler');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';


const users = new Map();

function initSocket(server) {
    console.log("coming in initSocket");
  const io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[+] Socket connected: ${socket.id}`);

    registerCosmosHandler(io, socket, users);
    registerMoveHandler(io, socket, users);
    registerChatHandler(io, socket, users);
  });

  return io;
}

module.exports = { initSocket };
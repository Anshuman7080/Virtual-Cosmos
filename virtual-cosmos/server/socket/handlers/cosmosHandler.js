const { v4: uuidv4 } = require('uuid');
const Session = require('../../models/Session');
const { getRoomId } = require('../proximity');
const { checkProximity } = require('../proximity');


function registerCosmosHandler(io, socket, users) {
  socket.on('cosmos:join', async ({ username, avatar, position }) => {
    const userId = uuidv4();

    const userData = {
      userId,
      username,
      avatar: avatar || 0,
      position: position || { x: 400, y: 300 },
      connectedTo: [],
    };

    users.set(socket.id, userData);
    

    try {
      await Session.create({ socketId: socket.id, ...userData });
    } catch (e) {
      console.log("error in creating sessions in cosmos handler",e);
    }

    const existingUsers = [];
    for (const [sid, u] of users.entries()) {
      if (sid !== socket.id) existingUsers.push({ socketId: sid, ...u });
    }

    socket.emit('cosmos:joined', { userId, existingUsers });

    socket.broadcast.emit('user:joined', {
      socketId: socket.id,
      userId,
      username,
      avatar: userData.avatar,
      position: userData.position,
    });

     checkProximity(io, users, socket.id);

    console.log(`[JOIN] ${username} (${userId})`);
  });

  socket.on('disconnect', async () => {
    const user = users.get(socket.id);
    if (!user) return;

    for (const connectedId of user.connectedTo) {
      for (const [sid, u] of users.entries()) {
        if (u.userId === connectedId) {
          u.connectedTo = u.connectedTo.filter(id => id !== user.userId);
          const roomId = getRoomId(user.userId, connectedId);
          io.to(sid).emit('proximity:disconnect', { userId: user.userId, roomId });
          break;
        }
      }
    }

    users.delete(socket.id);
    socket.broadcast.emit('user:left', { socketId: socket.id, userId: user.userId });

    try {
      await Session.deleteOne({ socketId: socket.id });
    } catch (e) {
      console.log("error in deleting sessions in cosmos handler",e);
    }

     checkProximity(io, users, socket.id);

    console.log(`[-] ${user.username} disconnected`);
  });
}

module.exports = registerCosmosHandler;
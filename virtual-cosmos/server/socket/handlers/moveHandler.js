const { checkProximity } = require('../proximity');

function registerMoveHandler(io, socket, users) {
  socket.on('user:move', ({ position }) => {
    const user = users.get(socket.id);
    if (!user) return;

    user.position = position;

    socket.broadcast.emit('user:moved', {
      socketId: socket.id,
      userId: user.userId,
      position,
    });

    checkProximity(io, users, socket.id);
  });
}

module.exports = registerMoveHandler;
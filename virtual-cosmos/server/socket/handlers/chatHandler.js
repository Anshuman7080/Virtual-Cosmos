
const Message =require("../../models/Message")

function registerChatHandler(io, socket, users) {
  socket.on('chat:message', async ({ roomId, text }) => {
    const user = users.get(socket.id);
    if (!user || !text.trim()) return;

    const msg = {
      roomId,
      senderId: user.userId,
      senderName: user.username,
      senderAvatar: user.avatar,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    try {
      await Message.create(msg);
    } catch (e) {
      console.log("error in storing message in chatHanlder",e);
    }

    const [idA, idB] = roomId.split('__');
    const otherUserId = user.userId === idA ? idB : idA;

    for (const [sid, u] of users.entries()) {
      if (u.userId === otherUserId) {
        io.to(sid).emit('chat:message', msg);
        break;
      }
    }

    socket.emit('chat:message', msg);
  });
}

module.exports = registerChatHandler;
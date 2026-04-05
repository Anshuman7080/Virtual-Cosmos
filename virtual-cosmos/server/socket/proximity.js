const PROXIMITY_RADIUS = 120;

function getDistance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function getRoomId(idA, idB) {
  return [idA, idB].sort().join('__');
}

function checkProximity(io, users, socketId) {
  const user = users.get(socketId);
  if (!user) return;

  for (const [otherId, other] of users.entries()) {
    if (otherId === socketId) continue;

    const dist = getDistance(user.position, other.position);
    const inRange = dist < PROXIMITY_RADIUS;
    const alreadyConnected = user.connectedTo.includes(other.userId);

    if (inRange && !alreadyConnected) {
      user.connectedTo.push(other.userId);
      other.connectedTo.push(user.userId);

      const roomId = getRoomId(user.userId, other.userId);

      io.to(socketId).emit('proximity:connect', {
        userId: other.userId,
        username: other.username,
        avatar: other.avatar,
        roomId,
      });
      io.to(otherId).emit('proximity:connect', {
        userId: user.userId,
        username: user.username,
        avatar: user.avatar,
        roomId,
      });
    } else if (!inRange && alreadyConnected) {
      user.connectedTo = user.connectedTo.filter(id => id !== other.userId);
      other.connectedTo = other.connectedTo.filter(id => id !== user.userId);

      const roomId = getRoomId(user.userId, other.userId);

      io.to(socketId).emit('proximity:disconnect', { userId: other.userId, roomId });
      io.to(otherId).emit('proximity:disconnect', { userId: user.userId, roomId });
    }
  }
}

module.exports = { getDistance, getRoomId, checkProximity };
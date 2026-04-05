# Virtual Cosmos

A real-time 2D virtual environment where users can move around and interact with each other through proximity-based chat.

> **MERN Stack Intern Assignment** – Built with React + PixiJS + Node.js + Socket.IO + MongoDB

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎮 **2D Movement** | WASD / Arrow keys, smooth diagonal movement, camera follow |
| 👥 **Real-Time Multiplayer** | All users visible and synced in real time via Socket.IO |
| 📡 **Proximity Detection** | 120px radius zone — auto connect/disconnect on distance |
| 💬 **Proximity Chat** | Chat panel auto-opens when users are near, closes when apart |
| 🗺️ **Styled World** | PixiJS canvas with grid, room labels |
| 🧑‍🚀 **Avatars** | 6 color choices, floating animation, username labels, crown for self |
| 📨 **Persistent Messages** | Chat history stored in MongoDB |
| 🎨 **Polished UI** | Space-themed dark UI, toasts on connect/disconnect, HUD |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with **Vite** — fast dev build
- **PixiJS 7** — WebGL 2D canvas rendering
- **Tailwind CSS** — utility-first styling
- **Socket.IO Client** — real-time communication

### Backend
- **Node.js + Express** — HTTP server
- **Socket.IO** — WebSocket real-time events
- **MongoDB + Mongoose** — user session & message persistence

---

## 🚀 Getting Started


### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/virtual-cosmos.git
cd virtual-cosmos
```

### 2. Setup the Backend
```bash
cd server
npm install
npm run dev
```

### 3. Setup the Frontend
```bash
cd ../client
npm install
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

Open **multiple tabs** to simulate multiple users!

---

## ⚙️ Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/virtual-cosmos
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`) — optional
```env
VITE_SERVER_URL=http://localhost:5000
```

---

## 📡 Socket.IO Events

### Client → Server
| Event | Payload | Description |
|---|---|---|
| `cosmos:join` | `{ username, avatar, position }` | User enters the world |
| `user:move` | `{ position: { x, y } }` | Position update |
| `chat:message` | `{ roomId, text }` | Send chat message |

### Server → Client
| Event | Payload | Description |
|---|---|---|
| `cosmos:joined` | `{ userId, existingUsers }` | Assigned ID + existing users |
| `user:joined` | `{ socketId, userId, username, avatar, position }` | New user entered |
| `user:left` | `{ socketId, userId }` | User disconnected |
| `user:moved` | `{ socketId, userId, position }` | Another user moved |
| `proximity:connect` | `{ userId, username, avatar, roomId }` | Entered proximity range |
| `proximity:disconnect` | `{ userId, roomId }` | Left proximity range |
| `chat:message` | `{ roomId, senderId, senderName, text, timestamp }` | Incoming message |

---


## 🎮 How to Play

1. Open the app and enter your **cosmic name** + choose an **avatar color**
2. Click **ENTER THE COSMOS**
3. Move around using **WASD** or **Arrow keys**
4. When you get **close to another user** → chat panel opens automatically
5. Type a message and hit **Enter** to chat
6. Move **away** → chat closes automatically


## 📹 Demo Video

[Link to demo video]

---

## 📬 Submission

Submitted via: https://forms.gle/GtkmYbjw4FVkrCzB8

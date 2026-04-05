import { useState, useCallback, useRef } from 'react'
import LoginScreen from './components/LoginScreen'
import CosmosCanvas from './components/CosmosCanvas'
import ChatPanel from './components/ChatPanel'
import HUD from './components/HUD'
import { useSocket } from './hooks/useSocket'
import toast, { Toaster } from 'react-hot-toast';




export default function App() {
  const [phase, setPhase] = useState('login')
  const [myUser, setMyUser] = useState(null) 
  const [otherUsers, setOtherUsers] = useState([]) 
  const [connections, setConnections] = useState(new Map()) 
  const [messages, setMessages] = useState([]) 
  const loginDataRef = useRef(null)


 
  const onJoined = useCallback(({ userId, existingUsers }) => {
    setMyUser(prev => ({ ...prev, userId }))
    setOtherUsers(existingUsers)
  }, [])

  const onUserJoined = useCallback((user) => {
    setOtherUsers(prev => {
      if (prev.find(u => u.userId === user.userId)) return prev
      return [...prev, user]
    })
  }, [])

  const onUserLeft = useCallback(({ socketId, userId }) => {
    setOtherUsers(prev => prev.filter(u => u.socketId !== socketId && u.userId !== userId))
    setConnections(prev => {
      if (!prev.has(userId)) return prev
      const next = new Map(prev)
      next.delete(userId)
      return next
    })
  }, [])

const onUserMoved = useCallback(({ userId, position }) => {
  setOtherUsers(prev =>
    prev.map(u =>
      u.userId === userId
        ? { ...u, position }
        : u
    )
  )
}, [])

  const onProximityConnect = useCallback(({ userId, username, avatar, roomId }) => {
    setConnections(prev => {
      const next = new Map(prev)
      next.set(userId, { username, avatar, roomId })
      return next
    })
    toast.success(`${username} connected`)
  }, [])

  const onProximityDisconnect = useCallback(({ userId, roomId }) => {
    setConnections(prev => {
      const conn = prev.get(userId)
      if (conn){
        toast.error(`${conn.username} disconnected`)
      }
      const next = new Map(prev)
      next.delete(userId)
      return next
    })
  }, [])

  const onChatMessage = useCallback((msg) => {
    setMessages(prev => [...prev, msg])
  }, [])

  const { connected, emitMove, sendMessage } = useSocket(
    phase === 'cosmos' ? {
      username: loginDataRef.current?.username,
      avatar: loginDataRef.current?.avatar,
      onJoined,
      onUserJoined,
      onUserLeft,
      onUserMoved,
      onProximityConnect,
      onProximityDisconnect,
      onChatMessage,
    } : {}
  )

 
  const handleJoin = useCallback((username, avatar) => {
    loginDataRef.current = { username, avatar }
    setMyUser({ username, avatar, position: { x: 400, y: 300 } })
    setPhase('cosmos')
  }, [])

  const handleMove = useCallback((position) => {
    setMyUser(prev => prev ? { ...prev, position } : prev)
    emitMove(position)
  }, [emitMove])

  const proximitySet = new Map(connections)

  if (phase === 'login') {
    return <LoginScreen onJoin={handleJoin} />
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#050714', overflow: 'hidden' }}>
     
      <div style={{ position: 'absolute', inset: 0 }}>
        <CosmosCanvas
          myUser={myUser}
          otherUsers={otherUsers}
          onMove={handleMove}
          proximityConnections={proximitySet}
        />
      </div>

    
      <HUD
        myUser={myUser}
        onlineCount={otherUsers.length + 1}
        connections={connections}
        connected={connected}
      />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(8,12,30,0.92)',
            color: 'white',
            borderRadius: '20px',
            padding: '12px 20px',
            fontFamily: 'DM Sans',
          },
          success: {
            style: {
              border: '1px solid #10b981',
              boxShadow: '0 0 20px rgba(16,185,129,0.3)',
            },
          },
          error: {
            style: {
              border: '1px solid #ef4444',
              boxShadow: '0 0 20px rgba(239,68,68,0.3)',
            },
          },
        }}
      />

      
      <ChatPanel
        connections={connections}
        messages={messages}
        onSend={sendMessage}
        myUser={myUser}
      />
    </div>
  )
}

import { useEffect, useRef, useState, useCallback } from 'react'
import socket from '../utils/socket'

export function useSocket({ username, avatar, onJoined, onUserJoined, onUserLeft, onUserMoved, onProximityConnect, onProximityDisconnect, onChatMessage }) {
  const [connected, setConnected] = useState(false)
  const handlersRef = useRef({})

  handlersRef.current = { onJoined, onUserJoined, onUserLeft, onUserMoved, onProximityConnect, onProximityDisconnect, onChatMessage }

  useEffect(() => {
  
    if (!username) return

    socket.connect()

    socket.on('connect', () => {
      setConnected(true)

      socket.emit('cosmos:join', {
        username,
        avatar,
        position: { x: 400 + Math.random() * 200 - 100, y: 300 + Math.random() * 200 - 100 },
      })
    })

    socket.on('disconnect', () => setConnected(false))

    socket.on('cosmos:joined', (data) => handlersRef.current.onJoined?.(data))
    socket.on('user:joined', (data) => handlersRef.current.onUserJoined?.(data))
    socket.on('user:left', (data) => handlersRef.current.onUserLeft?.(data))
    socket.on('user:moved', (data) => handlersRef.current.onUserMoved?.(data))
    socket.on('proximity:connect', (data) => handlersRef.current.onProximityConnect?.(data))
    socket.on('proximity:disconnect', (data) => handlersRef.current.onProximityDisconnect?.(data))
    socket.on('chat:message', (data) => handlersRef.current.onChatMessage?.(data))

    return () => {
      socket.removeAllListeners()
      socket.disconnect()
    }
  }, [username, avatar]) 

  const emitMove = useCallback((position) => {
    socket.emit('user:move', { position })
  }, [])

  const sendMessage = useCallback((roomId, text) => {
    socket.emit('chat:message', { roomId, text })
  }, [])

  return { connected, emitMove, sendMessage }
}
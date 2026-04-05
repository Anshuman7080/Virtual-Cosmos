import { useState, useRef, useEffect } from 'react'
import { AVATAR_CSS_COLORS } from '../utils/constants'

export default function ChatPanel({ connections, messages, onSend, myUser }) {
  const [activeRoom, setActiveRoom] = useState(null)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    if (connections.size === 0) {
      setActiveRoom(null)
      return
    }
    if (!activeRoom || !Array.from(connections.values()).find(c => c.roomId === activeRoom)) {
      const first = Array.from(connections.values())[0]
      setActiveRoom(first?.roomId || null)
    }
  }, [connections])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeRoom])

  const roomMessages = messages.filter(m => m.roomId === activeRoom)

  const handleSend = () => {
    if (!input.trim() || !activeRoom) return
    onSend(activeRoom, input.trim())
    setInput('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (connections.size === 0) return null

  return (
    <div
      className="chat-panel-enter absolute right-4 top-4 bottom-4 w-[320px] flex flex-col rounded-2xl border border-cyan-400/20 backdrop-blur-xl overflow-hidden z-[100]"
      style={{
        background: 'rgba(8, 12, 30, 0.92)',
        boxShadow: '0 0 40px rgba(0, 245, 255, 0.08), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-cyan-400/10 bg-cyan-400/5">
        <div className="font-[Oxanium] text-sm text-cyan-400 tracking-[2px] uppercase mb-2.5">
          ◈ Proximity Chat
        </div>

        <div className="flex gap-2 flex-wrap">
          {Array.from(connections.entries()).map(([userId, conn]) => {
            const active = activeRoom === conn.roomId
            const color = AVATAR_CSS_COLORS[conn.avatar % 6]

            return (
              <button
                key={userId}
                onClick={() => setActiveRoom(conn.roomId)}
                className="px-2.5 py-1 rounded-full text-[11px] font-[Oxanium] flex items-center gap-1.5 transition"
                style={{
                  border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
                  background: active ? `${color}22` : 'transparent',
                  color: active ? color : 'rgba(255,255,255,0.5)',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{
                    background: color,
                    boxShadow: `0 0 6px ${color}`,
                  }}
                />
                {conn.username}
              </button>
            )
          })}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col gap-2.5">
        {roomMessages.length === 0 && (
          <div className="text-center text-white/20 font-[DM Sans] text-xs mt-10">
            <div className="text-2xl mb-2">🌌</div>
            You are now connected!<br />Say hello to your neighbor.
          </div>
        )}

        {roomMessages.map((msg, i) => {
          const isMe = msg.senderId === myUser?.userId
          const color = AVATAR_CSS_COLORS[msg.senderAvatar % 6]

          return (
            <div
              key={i}
              className={`chat-message-appear flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              {!isMe && (
                <div
                  className="font-[Oxanium] text-[10px] mb-1 pl-1 tracking-wide"
                  style={{ color }}
                >
                  {msg.senderName}
                </div>
              )}

              <div
                className={`max-w-[82%] px-3 py-2 text-[13px] leading-relaxed break-words font-[DM Sans]
                  ${isMe
                    ? 'rounded-[14px_14px_4px_14px] text-slate-200 border border-cyan-400/20'
                    : 'rounded-[14px_14px_14px_4px] text-slate-300 border border-white/10 bg-white/5'
                  }`}
                style={
                  isMe
                    ? {
                        background:
                          'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(139,92,246,0.2))',
                      }
                    : {}
                }
              >
                {msg.text}
              </div>

              <div className="text-[10px] text-white/20 mt-1 px-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3.5 py-3 border-t border-cyan-400/10 flex gap-2 bg-black/20">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Message..."
          className="flex-1 bg-white/5 border border-cyan-400/20 rounded-lg px-3 py-2 text-slate-200 text-sm font-[DM Sans] outline-none focus:border-cyan-400/40"
        />

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`w-[38px] h-[38px] rounded-lg flex items-center justify-center text-base transition shrink-0
            ${input.trim()
              ? 'cursor-pointer text-[#050714]'
              : 'cursor-not-allowed text-white/20 bg-white/5'}`}
          style={
            input.trim()
              ? { background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)' }
              : {}
          }
        >
          ↑
        </button>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { AVATAR_CSS_COLORS } from '../utils/constants'

const AVATAR_NAMES = ['Cyan Nova', 'Pink Pulsar', 'Violet Quasar', 'Emerald Star', 'Amber Comet', 'Red Dwarf']

export default function LoginScreen({ onJoin }) {
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState(0)
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const name = username.trim()
    if (!name) { setError('Enter your cosmic name'); return }
    if (name.length < 2) { setError('Name too short'); return }
    if (name.length > 20) { setError('Name too long (max 20)'); return }
    onJoin(name, avatar)
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999]"
    >
      

      <div className="w-[420px] px-9 py-10 bg-[#080c1ed9] border border-cyan-400/20 rounded-3xl backdrop-blur-[30px] shadow-[0_0_80px_rgba(0,245,255,0.06),0_30px_60px_rgba(0,0,0,0.5)] relative z-10">
        
        {/* Title */}
        <div className="text-center mb-8">
          <div className="text-[40px] mb-2.5"></div>
          <h1 className="font-[Oxanium] text-[30px] font-extrabold tracking-[2px] mb-1.5 bg-gradient-to-br from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            VIRTUAL COSMOS
          </h1>
          <p className="text-white/35 font-[DM Sans] text-[13px]">
            A proximity-based virtual space
          </p>
        </div>

        {/* Name input */}
        <div className="mb-6">
          <label className="block font-[Oxanium] text-[11px] text-cyan-400 tracking-[2px] mb-2">
            COSMIC NAME
          </label>

          <input
            value={username}
            onChange={e => { setUsername(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter your name..."
            maxLength={20}
            autoFocus
            className={`w-full px-4 py-3 rounded-xl text-slate-200 font-[DM Sans] text-[15px] outline-none transition
              bg-white/5
              ${error ? 'border border-red-400' : 'border border-cyan-400/20 focus:border-cyan-400/50'}`}
          />

          {error && (
            <p className="text-red-400 font-[DM Sans] text-xs mt-1.5">
              {error}
            </p>
          )}
        </div>

        {/* Avatar picker */}
        <div className="mb-8">
          <label className="block font-[Oxanium] text-[11px] text-cyan-400 tracking-[2px] mb-3">
            CHOOSE AVATAR
          </label>

          <div className="grid grid-cols-6 gap-2">
            {AVATAR_CSS_COLORS.map((color, i) => (
              <button
                key={i}
                onClick={() => setAvatar(i)}
                title={AVATAR_NAMES[i]}
                className="w-full aspect-square rounded-full flex items-center justify-center transition-all"
                style={{
                  background: color,
                  border: `3px solid ${avatar === i ? color : 'transparent'}`,
                  boxShadow: avatar === i ? `0 0 16px ${color}, 0 0 30px ${color}40` : 'none',
                  transform: avatar === i ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {avatar === i && <span className="text-xs">✓</span>}
              </button>
            ))}
          </div>

          <p className="text-center text-white/30 font-[DM Sans] text-[11px] mt-2">
            {AVATAR_NAMES[avatar]}
          </p>
        </div>

        {/* Join button */}
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-xl font-[Oxanium] text-[15px] font-bold tracking-[2px] transition transform hover:-translate-y-[1px] hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
            color: '#050714',
          }}
        >
          ENTER THE COSMOS →
        </button>

        {/* Controls hint */}
        <p className="text-center text-white/20 font-[DM Sans] text-[11px] mt-4">
          Move with WASD or Arrow keys · Chat opens on proximity
        </p>
      </div>
    </div>
  )
}
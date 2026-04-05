import { AVATAR_CSS_COLORS } from '../utils/constants'

export default function HUD({ myUser, onlineCount, connections, connected }) {
  return (
    <>
    
      <div className="absolute top-4 left-4 flex gap-2.5 z-50">
       
        <div className="px-4 py-2 rounded-xl border border-cyan-400/20 backdrop-blur-xl font-[Oxanium] text-sm font-bold tracking-widest whitespace-nowrap bg-gradient-to-br from-cyan-400 to-purple-500 bg-clip-text text-transparent">
           COSMOS
        </div>

      
        <div className={`px-3.5 py-2 rounded-xl backdrop-blur-xl flex items-center gap-1.5 font-[DM Sans] text-xs
          ${connected 
            ? 'border border-emerald-400/30 text-emerald-400' 
            : 'border border-red-400/30 text-red-400'}`}>
          
          <span className={`w-1.5 h-1.5 rounded-full
            ${connected ? 'bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse' : 'bg-red-400 shadow-[0_0_8px_#ef4444]'}`} />
          
          {connected ? 'Connected' : 'Reconnecting...'}
        </div>

       
        <div className="px-3.5 py-2 rounded-xl border border-cyan-400/10 backdrop-blur-xl flex items-center gap-1.5 font-[DM Sans] text-xs text-white/60">
          <span className="text-cyan-400">◉</span>
          {onlineCount} explorer{onlineCount !== 1 ? 's' : ''}
        </div>
      </div>

      
      <div className="absolute bottom-4 left-4 z-50 flex flex-col gap-2">
        
        {connections.size > 0 && (
          <div className="px-3.5 py-2.5 rounded-xl border border-cyan-400/20 backdrop-blur-xl shadow-[0_0_20px_rgba(0,245,255,0.06)] bg-[#080c1ee0]">
            <div className="font-[Oxanium] text-[10px] text-cyan-400 tracking-widest mb-2">
              NEARBY
            </div>

            {Array.from(connections.entries()).map(([userId, conn]) => (
              <div
                key={userId}
                className="flex items-center gap-2 mb-1 font-[DM Sans] text-xs text-slate-300"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: AVATAR_CSS_COLORS[conn.avatar % 6],
                    boxShadow: `0 0 8px ${AVATAR_CSS_COLORS[conn.avatar % 6]}`
                  }}
                />
                {conn.username}
                <span className="text-emerald-400 text-[10px]">● chatting</span>
              </div>
            ))}
          </div>
        )}

        {myUser && (
          <div className="px-3.5 py-2.5 rounded-xl border border-white/10 backdrop-blur-xl flex items-center gap-2.5 bg-[#080c1ed9]">
            <div
              className="w-7 h-7 rounded-full shrink-0"
              style={{
                background: AVATAR_CSS_COLORS[myUser.avatar % 6],
                boxShadow: `0 0 10px ${AVATAR_CSS_COLORS[myUser.avatar % 6]}60`
              }}
            />
            <div>
              <div className="font-[Oxanium] text-xs text-amber-400 font-semibold">
                {myUser.username}
              </div>
              <div className="font-[DM Sans] text-[10px] text-white/30">
                You
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-xl font-[DM Sans] text-[11px] text-white/25 flex gap-4 items-center whitespace-nowrap bg-[#080c1eb3]">
        
        <span>
          <kbd className="bg-white/10 px-1.5 py-[1px] rounded text-[10px]">WASD</kbd> /{" "}
          <kbd className="bg-white/10 px-1.5 py-[1px] rounded text-[10px]">↑↓←→</kbd> Move
        </span>

        <span className="text-white/10">|</span>

        <span>🌐 Chat opens on proximity</span>
      </div>
    </>
  )
}
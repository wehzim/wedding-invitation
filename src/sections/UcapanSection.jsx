import { useState, useEffect, forwardRef } from 'react'
import { fetchWishes } from '../api/wishes'

export const UcapanSection = forwardRef(({ onWriteClick, onRSVPClick }, ref) => {
  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      try {
        const data = await fetchWishes()
        if (!cancelled) setWishes(Array.isArray(data) ? data : [])
      } catch {
        if (!cancelled) setWishes([])
      }
      if (!cancelled) setLoading(false)
    }

    load()
    const interval = setInterval(load, 30000)
    window.addEventListener('ucapan-updated', load)
    return () => {
      cancelled = true
      clearInterval(interval)
      window.removeEventListener('ucapan-updated', load)
    }
  }, [])

  return (
    <section ref={ref} className="flex flex-col items-center justify-start h-screen px-4 pt-40 pb-[80px]">
      <p className="will-reveal text-xs tracking-[0.3em] text-primary mb-1">HEART TO HEART</p>
      <h2 className="will-reveal font-im-fell-english-regular-italic text-5xl text-secondary mb-2" style={{ transitionDelay: '0.08s' }}>Messages</h2>
      <div className="will-reveal w-16 h-px bg-[#c9a27e] mb-6" style={{ transitionDelay: '0.12s' }} />

      <div className="will-reveal w-full max-w-sm flex-1 overflow-y-auto space-y-5 pr-1" style={{ transitionDelay: '0.2s' }}>
        {loading && <p className="text-center text-sm text-primary opacity-60 italic">Loading messages...</p>}
        {!loading && wishes.length === 0 && (
          <p className="text-center text-sm text-primary opacity-60 italic">No messages yet. Be the first! 🌸</p>
        )}
        {wishes.map((w, i) => (
          <div key={i} className="text-center">
            <p className="font-im-fell-english-regular-italic text-lg text-secondary italic">"{w.message}"</p>
            <p className="text-xs tracking-widest text-primary mt-1 font-semibold">{w.name}</p>
            <div className="w-8 h-px bg-[#d4b896] mx-auto mt-3" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs mt-6 shrink-0 items-center">
        <button onClick={onWriteClick}
          className="w-[75%] py-3 rounded-full text-sm text-white tracking-widest"
          style={{ background: '#c9a27e' }}>
          ✦ Write a message
        </button>
        <button onClick={onRSVPClick}
          className="w-[75%] py-3 rounded-full text-sm tracking-widest text-white"
          style={{ background: '#a0785a' }}>
          ✉ Confirm Attendance
        </button>
      </div>
    </section>
  )
})

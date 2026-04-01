import { useState, useEffect, forwardRef } from 'react'
import { fetchWishes } from '../api/wishes'

export const UcapanSection = forwardRef(({ onWriteClick, onRSVPClick }, ref) => {
  const DUMMY_WISHES = [
    { name: 'Farah & Hafiz', message: 'Semoga perkahwinan Azim & Nia diberkati Allah dan kekal bahagia hingga ke syurga. Tahniah!' },
    { name: 'Auntie Rohani', message: 'Moga rumah tangga yang dibina penuh kasih sayang, harmoni dan dipanjangkan rezeki. Selamat pengantin baru!' },
    { name: 'Zul Ariffin', message: 'Congratulations to the beautiful couple! May your love story be an inspiration to all of us.' },
    { name: 'Kak Yati & Family', message: 'Doakan semoga jodoh ini berkekalan dunia akhirat. Barakallahu lakuma wa baraka alaikuma.' },
    { name: 'Syafiq Danial', message: 'Wishing you both a lifetime of laughter, love and happiness. Tahniah Azim & Nia!' },
  ]

  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setWishes(DUMMY_WISHES)
      setLoading(false)
    }, 5000)
    return () => clearTimeout(t)
  }, [])
  const STORAGE_KEY = 'wedding_liked_wishes'
  // TODO: when switching to real data, replace index key `i` with the actual message ID (e.g. w.id)
  //       so liked state survives list reorders

  const [hearts, setHearts] = useState(() => {
    let liked = {}
    try { liked = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch {}
    return DUMMY_WISHES.reduce((acc, _, i) => ({
      ...acc,
      [i]: { liked: !!liked[i], count: Math.floor(Math.random() * 8) },
    }), {})
  })

  const toggleHeart = i => {
    setHearts(h => {
      if (h[i].liked) return h  // already liked — do nothing
      const next = { ...h, [i]: { liked: true, count: h[i].count + 1 } }
      try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, [i]: true }))
      } catch {}
      return next
    })
  }

  // TODO: remove dummy data and uncomment the fetch below when ready
  // useEffect(() => {
  //   let cancelled = false
  //   const load = async () => {
  //     setLoading(true)
  //     try {
  //       const data = await fetchWishes()
  //       if (!cancelled) setWishes(Array.isArray(data) ? data : [])
  //     } catch {
  //       if (!cancelled) setWishes([])
  //     }
  //     if (!cancelled) setLoading(false)
  //   }
  //   load()
  //   const interval = setInterval(load, 30000)
  //   window.addEventListener('ucapan-updated', load)
  //   return () => {
  //     cancelled = true
  //     clearInterval(interval)
  //     window.removeEventListener('ucapan-updated', load)
  //   }
  // }, [])

  return (
    <section ref={ref} className="flex flex-col items-center justify-start px-4 pt-16 pb-[90px]">
      <div className="flex flex-col gap-3 w-full max-w-xs mb-20 shrink-0 items-center">
        <button onClick={onWriteClick}
          className="w-[75%] py-3 rounded-full text-sm text-white tracking-widest"
          style={{ background: '#c9a27e' }}>
          ✦ Write a message
        </button>
        <button onClick={onRSVPClick}
          className="w-[75%] py-3 rounded-full text-sm tracking-widest"
          style={{ background: '#fff', color: '#c9a27e', border: '1px solid #c9a27e' }}>
          ✉ Confirm Attendance
        </button>
      </div>

      <p className="will-reveal text-xs tracking-[0.3em] text-primary mb-1">HEART TO HEART</p>
      <h2 className="will-reveal font-im-fell-english-regular-italic text-5xl text-secondary mb-2" style={{ transitionDelay: '0.08s' }}>Messages</h2>
      <div className="will-reveal w-16 h-px bg-[#c9a27e] mb-6" style={{ transitionDelay: '0.12s' }} />

      <div className="will-reveal w-full max-w-sm space-y-5" style={{ transitionDelay: '0.2s' }}>
        {loading && (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: '40dvh' }}>
            <div className="ucapan-ornaments">
              <span style={{ animationDelay: '0s' }}>✦</span>
              <span style={{ animationDelay: '0.3s' }}>✦</span>
              <span style={{ animationDelay: '0.6s' }}>✦</span>
            </div>
            <p className="font-im-fell-english-regular-italic text-secondary italic text-lg mt-4 ucapan-loading-text">
              Gathering wishes...
            </p>
          </div>
        )}
        {!loading && wishes.length === 0 && (
          <p className="text-center text-sm text-primary opacity-60 italic">No messages yet. Be the first! 🌸</p>
        )}
        {wishes.map((w, i) => (
          <div key={i} className="relative text-center rounded-2xl px-5 pt-4 pb-10" style={{ background: 'rgba(255,250,247,0.85)' }}>
            <p className="font-im-fell-english-regular-italic text-lg text-secondary italic">"{w.message}"</p>
            <div className="w-8 h-px bg-[#d4b896] mx-auto mt-3 mb-2" />
            <p className="text-xs tracking-widest text-primary font-semibold">{w.name}</p>

            <button
              onClick={() => toggleHeart(i)}
              className="absolute bottom-3 right-4 flex items-center gap-1"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <span
                style={{
                  fontSize: '1.4rem',
                  lineHeight: 1,
                  color: hearts[i]?.liked ? '#e07070' : '#d4b896',
                  transform: hearts[i]?.liked ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 0.2s cubic-bezier(0.25, 0, 0, 1), color 0.2s ease',
                  display: 'inline-block',
                }}
              >
                {hearts[i]?.liked ? '♥' : '♡'}
              </span>
              <span className="text-xs" style={{ color: '#c9a27e' }}>{hearts[i]?.count ?? 0}</span>
            </button>
          </div>
        ))}
      </div>

    </section>
  )
})

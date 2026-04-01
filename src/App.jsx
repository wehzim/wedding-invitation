import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './App.css'

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyUpdAMHdCdap0QLpa87MqmGQ_KbrPQ6w1Ul1R0_8sjaNgaDTIlNkrW8Xji2ehuHtk7lA/exec'
// ─── HELPERS ─────────────────────────────────────────────────────────────────
async function fetchWishes() {
  try {
    const res = await fetch(
      `${GOOGLE_SCRIPT_URL}?action=getUcapan&_=${Date.now()}`,
      { method: 'GET' }
    )
    const data = await res.json()
    return data.status === 'ok' && Array.isArray(data.wishes) ? data.wishes : []
  } catch {
    return []
  }
}

async function postWish(name, message) {
  const params = new URLSearchParams({
    action: 'saveUcapan', name, message,
    timestamp: new Date().toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
  })
  await fetch(`${GOOGLE_SCRIPT_URL}?${params}`, { method: 'GET', mode: 'no-cors' })
  window.dispatchEvent(new Event('ucapan-updated'))
}

async function fetchGifts() {
  try {
    const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getGifts`)
    const data = await res.json()
    return data.status === 'ok' ? data.gifts : []
  } catch (err) {
    console.log('fetchGifts failed:', err)
    return []
  }
}

async function postGift(name, gift) {
  const params = new URLSearchParams({
    action: 'saveGift',
    name,
    gift,
    timestamp: new Date().toLocaleString('ms-MY', {
      timeZone: 'Asia/Kuala_Lumpur',
    }),
  })

  await fetch(`${GOOGLE_SCRIPT_URL}?${params}`, {
    method: 'GET',
    mode: 'no-cors',
  })

  window.dispatchEvent(new Event('gift-updated'))
}

// ─── MODAL (portal — escapes card transform/overflow) ────────────────────────
function Modal({ show, onClose, children }) {
  if (!show) return null
  return createPortal(
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', zIndex: 99999 }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-3xl p-6 pb-10"
        style={{ background: '#fffaf7', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') || document.body
  )
}

// ─── CALL MODAL ──────────────────────────────────────────────────────────────
function CallModal({ show, onClose }) {
  const contacts = [
    { name: 'Furqan', role: 'Man of Honor',   number: '+60137795811' },
    { name: 'Syaza',  role: 'Maid of Honor', number: '+601128212348' },
  ]
  return (
    <Modal show={show} onClose={onClose}>
      <h2 className="font-im-fell-english-regular-italic text-3xl text-secondary text-center mb-1">Contact Us</h2>
      <p className="text-xs text-center text-primary tracking-widest mb-6">CONTACT THE PIC</p>
      <div className="flex flex-col gap-3">
        {contacts.map(c => (
          <a key={c.name} href={`tel:${c.number}`}
            className="flex items-center justify-between px-5 py-4 rounded-2xl border border-[#d4b896]"
            style={{ textDecoration: 'none' }}
          >
            <div>
              <p className="font-im-fell-english-regular-italic text-xl text-secondary">{c.name}</p>
              <p className="text-xs tracking-widest text-primary">{c.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#c9a27e' }}>
              <i className="fas fa-phone text-white text-sm"></i>
            </div>
          </a>
        ))}
      </div>
    </Modal>
  )
}

// ─── GIFT MODAL ──────────────────────────────────────────────────────────────
function GiftModal({ show, onClose }) {
  const [gifts, setGifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!show) return

    const load = async () => {
      setLoading(true)
      const data = await fetchGifts()
      setGifts(data)
      setLoading(false)
    }

    load()
  }, [show])

  return (
    <Modal show={show} onClose={onClose}>
      <h2 className="text-3xl font-im-fell-english-regular-italic text-secondary text-center mb-2">Gifts</h2>

      <p className="text-xs text-center text-primary tracking-widest mb-4">
        To avoid duplicate gifts, you can share your gift with others (optional)
      </p>

      {/* LIST */}
      <div className="max-h-[150px] overflow-y-auto space-y-2 mb-4 pr-2">
        {loading && <p className="text-center text-sm">Loading...</p>}
        {!loading && gifts.length === 0 && (
          <p className="text-center text-sm italic">No gifts recorded yet</p>
        )}

        {gifts.map((g, i) => (
          <div key={i} className="text-center text-sm text-secondary">
            <p>"{g.gift}"</p>
            <p className="text-xs text-primary">{g.name}</p>
          </div>
        ))}
      </div>

      {/* BUTTON */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2 bg-[#c9a27e] text-white rounded"
        >
          Claim Gift
        </button>
      )}

      {/* FORM */}
      {showForm && (
        <GiftForm onDone={onClose} />
      )}
    </Modal>
  )
}

// ─── GIFT FORM (inside Gift Modal) ───────────────────────────────────────────
function GiftForm({ onDone }) {
  const [name, setName] = useState('')
  const [gift, setGift] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('SUBMIT CLICKED') // 👈 add this

    await postGift(name, gift)

    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-3">
      <input
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        placeholder="What is your gift?"
        value={gift}
        onChange={(e) => setGift(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-[#c9a27e] text-white py-2 rounded">
        Submit
      </button>
    </form>
  )
}

// ─── RSVP MODAL ──────────────────────────────────────────────────────────────
function RSVPModal({ show, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', attendees: '1', ucapan: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) return
    setStatus('loading')
    try {
      const params = new URLSearchParams({
        name: form.name, phone: form.phone,
        attendees: form.attendees, ucapan: form.ucapan,
        timestamp: new Date().toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
      })
      await fetch(`${GOOGLE_SCRIPT_URL}?${params}`, { method: 'GET', mode: 'no-cors' })
      if (form.ucapan.trim()) {
        await postWish(form.name, form.ucapan)
        setTimeout(() => window.dispatchEvent(new Event('ucapan-updated')), 2000)
      }
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const reset = () => { setForm({ name: '', phone: '', attendees: '1', ucapan: '' }); setStatus('idle') }

  return (
    <Modal show={show} onClose={() => { reset(); onClose() }}>
      <h2 className="font-im-fell-english-regular-italic text-3xl text-secondary text-center mb-1">Confirm Attendance</h2>
      <p className="text-xs text-center text-primary tracking-widest mb-6">RSVP · 4 July 2026</p>
      {status === 'success' ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🌸</div>
          <p className="font-im-fell-english-regular-italic text-2xl text-secondary">Thank you!</p>
          <p className="text-sm text-primary mt-2">Your attendance is confirmed.</p>
          <button onClick={() => { reset(); onClose() }} className="mt-6 px-8 py-2 rounded-full text-sm text-white" style={{ background: '#c9a27e' }}>Close</button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs tracking-widest text-primary block mb-1">FULL NAME *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your name"
              className="w-full border-b border-[#d4b896] bg-transparent py-2 text-sm text-primary outline-none placeholder:text-[#c9b8a8] focus:border-[#c9a27e] transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-widest text-primary block mb-1">PHONE NUMBER *</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="01X-XXXXXXXX" type="tel"
              className="w-full border-b border-[#d4b896] bg-transparent py-2 text-sm text-primary outline-none placeholder:text-[#c9b8a8] focus:border-[#c9a27e] transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-widest text-primary block mb-1">NUMBER OF ATTENDEES</label>
            <div className="flex gap-2 mt-1">
              {['1','2'].map(n => (
                <button key={n} onClick={() => setForm(f => ({ ...f, attendees: n }))}
                  className="w-10 h-10 rounded-full text-sm transition-all border"
                  style={{ background: form.attendees === n ? '#c9a27e' : 'transparent', color: form.attendees === n ? '#fff' : '#a08060', borderColor: form.attendees === n ? '#c9a27e' : '#d4b896' }}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs tracking-widest text-primary block mb-1">MESSAGE (OPTIONAL)</label>
            <textarea name="ucapan" value={form.ucapan} onChange={handleChange} placeholder="Write a message for the couple..." rows={3}
              className="w-full border-b border-[#d4b896] bg-transparent py-2 text-sm text-primary outline-none placeholder:text-[#c9b8a8] focus:border-[#c9a27e] transition-colors resize-none" />
          </div>
          {status === 'error' && <p className="text-xs text-red-400 text-center">Error. Please try again.</p>}
          <button onClick={handleSubmit} disabled={status === 'loading' || !form.name.trim() || !form.phone.trim()}
            className="mt-2 py-3 rounded-full text-sm text-white tracking-widest transition-opacity disabled:opacity-50"
            style={{ background: '#c9a27e' }}>
            {status === 'loading' ? 'Sending...' : 'SEND'}
          </button>
        </div>
      )}
    </Modal>
  )
}

// ─── UCAPAN MODAL ────────────────────────────────────────────────────────────
function UcapanModal({ show, onClose }) {
  const [form, setForm] = useState({ name: '', message: '' })
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.message.trim()) return
    await postWish(form.name, form.message)
    setTimeout(() => window.dispatchEvent(new Event('ucapan-updated')), 2000)
    setDone(true)
  }

  const reset = () => { setForm({ name: '', message: '' }); setDone(false) }

  return (
    <Modal show={show} onClose={() => { reset(); onClose() }}>
      <h2 className="font-im-fell-english-regular-italic text-3xl text-secondary text-center mb-1">Write a message</h2>
      <p className="text-xs text-center text-primary tracking-widest mb-6">WISHES FOR THE COUPLE</p>
      {done ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">💌</div>
          <p className="font-im-fell-english-regular-italic text-2xl text-secondary">Thank you!</p>
          <p className="text-sm text-primary mt-2">Your message has been sent.</p>
          <button onClick={() => { reset(); onClose() }} className="mt-6 px-8 py-2 rounded-full text-sm text-white" style={{ background: '#c9a27e' }}>Close</button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs tracking-widest text-primary block mb-1">Your Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name"
              className="w-full border-b border-[#d4b896] bg-transparent py-2 text-sm text-primary outline-none placeholder:text-[#c9b8a8] focus:border-[#c9a27e] transition-colors" />
          </div>
          <div>
            <label className="text-xs tracking-widest text-primary block mb-1">Message *</label>
            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Congratulations to the couple..." rows={4}
              className="w-full border-b border-[#d4b896] bg-transparent py-2 text-sm text-primary outline-none placeholder:text-[#c9b8a8] focus:border-[#c9a27e] transition-colors resize-none" />
          </div>
          <button onClick={handleSubmit} disabled={!form.name.trim() || !form.message.trim()}
            className="mt-2 py-3 rounded-full text-sm text-white tracking-widest transition-opacity disabled:opacity-50"
            style={{ background: '#c9a27e' }}>
            SEND
          </button>
        </div>
      )}
    </Modal>
  )
}

// ─── IMAGE SLIDER SECTION ────────────────────────────────────────────────────
const GALLERY_IMAGES = [
  'src/assets/1.jpg',
  'src/assets/2.jpg',
  'src/assets/3.jpg',
  'src/assets/4.jpg',
  'src/assets/5.jpeg',
]

function GallerySection() {
  return (
    <section className="flex flex-col items-center justify-center py-16" style={{ overflow: 'hidden', maxWidth: '100%' }}>
      <p className="text-xs tracking-[0.3em] text-primary mb-1">OUR MEMORIES</p>
      <h2 className="font-im-fell-english-regular-italic text-5xl text-secondary mb-2">Gallery</h2>
      <div className="w-16 h-px bg-[#c9a27e] mb-8" />
      <div
        className="flex gap-4 pb-4 px-6"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          overflowX: 'scroll',
          overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {GALLERY_IMAGES.map((src, i) => (
          <div key={i} className="shrink-0 rounded-2xl overflow-hidden shadow-md"
            style={{ width: '280px', aspectRatio: '3/4', scrollSnapAlign: 'center' }}>
            <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-5">
        {GALLERY_IMAGES.map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#c9a27e] opacity-50" />
        ))}
      </div>
    </section>
  )
}

// ─── UCAPAN FEED SECTION ─────────────────────────────────────────────────────
function UcapanSection({ onWriteClick, onRSVPClick }) {
  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)

  // FIX: load defined inside useEffect to avoid stale closure
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
    const interval = setInterval(load, 30000) // re-fetch every 30s
    window.addEventListener('ucapan-updated', load)
    return () => {
      cancelled = true
      clearInterval(interval)
      window.removeEventListener('ucapan-updated', load)
    }
  }, [])

  return (
    <section className="flex flex-col items-center justify-start h-screen px-4 pt-40 pb-10">
      <p className="text-xs tracking-[0.3em] text-primary mb-1">HEART TO HEART</p>
      <h2 className="font-im-fell-english-regular-italic text-5xl text-secondary mb-2">Messages</h2>
      <div className="w-16 h-px bg-[#c9a27e] mb-6" />

      <div className="w-full max-w-sm flex-1 overflow-y-auto space-y-5 pr-1">
        {loading && <p className="text-center text-sm text-primary opacity-60 italic">Loading messages...</p>}
        {!loading && wishes.length === 0 && <p className="text-center text-sm text-primary opacity-60 italic">No messages yet. Be the first! 🌸</p>}
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
          className="w-[75%] py-3 rounded-full text-sm tracking-widest border"
          style={{ borderColor: '#c9a27e', color: '#c9a27e', background: 'transparent' }}>
          ✉ Confirm Attendance
        </button>
      </div>
    </section>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
function App() {
  const [opened, setOpened] = useState(false)
  const [panelsGone, setPanelsGone] = useState(false)
  const [days, setDays] = useState(0)
  const [modal, setModal] = useState(null)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef(null)

  const coverRef   = useRef(null)
  const inviteRef  = useRef(null)
  const programRef = useRef(null)
  const galleryRef = useRef(null)
  const ucapanRef  = useRef(null)

  const weddingDate = new Date('2026-07-04T11:00:00')

  const fadeInAudio = (audio, targetVolume = 0.5, duration = 2000) => {
    audio.volume = 0
    audio.play()

    const stepTime = 50
    const steps = duration / stepTime
    const volumeStep = targetVolume / steps

    let current = 0

    const fade = setInterval(() => {
      current += volumeStep

      if (current >= targetVolume) {
        audio.volume = targetVolume
        clearInterval(fade)
      } else {
        audio.volume = current
      }
    }, stepTime)
  }

  useEffect(() => {
    const calc = () => {
      const diff = weddingDate - new Date()
      if (diff > 0) setDays(Math.floor(diff / (1000 * 60 * 60 * 24)))
    }
    calc()
    const interval = setInterval(calc, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  const scrollTo = ref => ref.current?.scrollIntoView({ behavior: 'smooth' })

  const openLocation = () => {
    window.open('https://maps.google.com/?q=30+Jalan+Timur+Assam+Kumbang+34000+Taiping+Perak', '_blank')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#fdfcf9] to-[#f0e9e0]">
      <div className={`envelope-container ${opened ? 'opened' : ''}`}>
        {!panelsGone && <div className="panel left"></div>}
        {!panelsGone && <div className="panel right"></div>}

        <div className="seal text-center font-im-fell-english-regular-italic"
          onClick={() => {
            setOpened(true)

            const audio = document.getElementById('bg-music')

            if (audio) {
              setTimeout(() => {
                fadeInAudio(audio, 0.5, 2500)
              }, 200)
            }

            setTimeout(() => setPanelsGone(true), 1300)
          }}>
          Azim <br /> & <br /> Nia
        </div>
        <audio ref={audioRef} id="bg-music" loop preload="auto">
          <source src="src/sound/howls-moving-castle.mp3" type="audio/mpeg" />
        </audio>

        <div className="card">

          {/* ── Cover ── */}
          <section ref={coverRef} className="relative flex items-center justify-center min-h-screen bg-[#fcf0f0] overflow-hidden">
            <img src="src/assets/frame.png" alt="Frame" className="w-[90%] h-auto md:w-[80%] lg:w-[70%] mx-auto -mt-[15%] md:-mt-[20%]" />
            <img src="src/assets/flower.png" alt="" className="absolute top-0 left-0 w-24 md:w-32" />
            <img src="src/assets/blue-flower.png" alt="" className="absolute top-1/2 left-0 w-20 md:w-28 -translate-y-1/2" />
            <img src="src/assets/white-flower.png" alt="" className="absolute bottom-0 right-0 w-24 md:w-32 pb-[60px]" />
            <img src="src/assets/pink-flower.png" alt="" className="absolute top-1/2 right-0 w-20 md:w-28 -translate-y-1/2" />
            <img src="src/assets/top-right.png" alt="" className="absolute top-0 right-0 w-40 md:w-48" />
            <img src="src/assets/bot-left.png" alt="" className="absolute bottom-0 left-0 w-40 md:w-48 pb-[60px]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <p className="text-sm mb-5 text-primary tracking-wider">THE WEDDING OF</p>
              <h1 className="font-im-fell-english-regular-italic text-6xl mt-2 text-secondary">Azim</h1>
              <h1 className="font-im-fell-english-regular-italic text-6xl mt-2 mb-2 text-secondary">& Nia</h1>
              <p className="text-md text-third mt-5 tracking-wider">Fourth of July,</p>
              <p className="text-md text-third mb-5 tracking-wider">Twenty Twenty-Six</p>
              <p className="text-sm text-primary tracking-wider">Taiping, Perak</p>
            </div>
          </section>

          {/* ── Invitation ── */}
          <section ref={inviteRef} className="flex items-center justify-center py-16 bg-cover bg-center">
            <div className="max-w-lg mx-auto text-center rounded-lg p-6 pt-16">
              <h2 className="text-2xl mt-5 mb-5 text-primary font-scheherazade">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h2>
              <p className="text-xs text-primary tracking-wider">WITH JOY AND GRATITUDE TO</p>
              <p className="text-xs mb-4 text-primary tracking-wider">ALMIGHTY ALLAH</p>
              <h1 className="font-im-fell-english-regular-italic text-2xl mt-2 text-secondary">Hairol Sham &</h1>
              <h1 className="font-im-fell-english-regular-italic text-2xl mb-3 text-secondary">Bismi Intanti</h1>
              <p className="text-sm text-primary tracking-wider">Cordially invite</p>
              <p className="text-sm text-primary tracking-wider">Sir / Madam / Mr / Miss</p>
              <p className="text-sm text-primary mb-5 tracking-wider">to the wedding reception of our daughter</p>
              <h1 className="font-im-fell-english-regular-italic text-4xl mt-2 text-secondary">Hildania Syazanie</h1>
              <h1 className="font-im-fell-english-regular-italic text-2xl text-secondary">with</h1>
              <h1 className="font-im-fell-english-regular-italic text-4xl mb-5 text-secondary">Mohammad Azim</h1>
              <p className="text-md text-primary mt-5 tracking-wider">VENUE</p>
              <p className="text-sm text-primary tracking-wider">30, Jalan Timur, Assam Kumbang,</p>
              <p className="text-sm mb-4 text-primary tracking-wider">34000 Taiping, Perak</p>
              <p className="text-md text-primary tracking-wider">DATE</p>
              <p className="text-sm text-primary tracking-wider">4 July 2026</p>
              <p className="text-sm mb-4 text-primary tracking-wider">18 Muharram 1448 AH</p>
              <p className="text-md text-primary tracking-wider">TIME</p>
              <p className="text-sm text-primary tracking-wider">11:00 AM - 4:00 PM</p>
            </div>
          </section>

          {/* ── Programme + Countdown ── */}
          <section ref={programRef} className="flex flex-col items-center justify-center py-16 bg-cover bg-center gap-8">
            <div className="relative w-[75%] max-w-xs mx-auto">
              <img src="src/assets/thing.png" alt="Programme" className="w-full h-auto mb-5" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-black">
                <p className="text-lg text-primary mt-5 mb-5 tracking-wider">PROGRAMME</p>
                <p className="text-md mt-5">Lunch:</p>
                <p className="text-md mb-5">11:00 am – 5:00 pm</p>
                <p className="text-md">The Arrival of Bride & Groom:</p>
                <p className="text-md mb-5">12.30 pm</p>
                <p className="text-md">Theme of the Ceremony:</p>
                <p className="text-md">Pastel Pink</p>
              </div>
            </div>
            {days > 0 && (
              <div className="flex flex-col items-center mb-5">
                <p className="text-xs tracking-widest text-primary mb-3">COUNTDOWN</p>
                <div className="border border-[#c9a27e] rounded-full px-8 py-3 flex items-center gap-2">
                  <span className="font-im-fell-english-regular-italic text-4xl text-secondary">{days}</span>
                  <span className="text-xs text-primary tracking-widest">DAYS LEFT</span>
                </div>
              </div>
            )}
          </section>

          {/* ── Gallery Slider ── */}
          <div ref={galleryRef}>
            <GallerySection />
          </div>

          {/* ── Ucapan ── */}
          <div ref={ucapanRef}>
            <UcapanSection
              onWriteClick={() => setModal('ucapan')}
              onRSVPClick={() => setModal('rsvp')}
            />
          </div>

          {/* ── Bottom Menu ── */}
          <div className="bottom-menu">
            <button title="Contact" onClick={() => setModal('call')}>
              <i className="fas fa-phone"></i>
            </button>
            <button title="Location" onClick={openLocation}>
              <i className="fas fa-map-marker-alt"></i>
            </button>
            <button title="RSVP" onClick={() => setModal('rsvp')}>
              <i className="fas fa-envelope-open-text"></i>
            </button>
            <button title="Gift" onClick={() => setModal('gift')}>
              <i className="fas fa-gift"></i>
            </button>
            <button title="Music" onClick={() => {
                const audio = audioRef.current
                if (!audio) return

                if (audio.paused) {
                  audio.volume = 0.5
                  audio.play()
                  setMusicPlaying(true)
                } else {
                  audio.pause()
                  setMusicPlaying(false)
                }
              }}>
              <i className={`fas ${musicPlaying ? 'fa-pause-circle' : 'fa-play-circle'}`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CallModal   show={modal === 'call'}   onClose={() => setModal(null)} />
      <RSVPModal   show={modal === 'rsvp'}   onClose={() => setModal(null)} />
      <UcapanModal show={modal === 'ucapan'} onClose={() => setModal(null)} />
      <GiftModal   show={modal === 'gift'}   onClose={() => setModal(null)} />
    </div>
  )
}

export default App

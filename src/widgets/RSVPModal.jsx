import { useState } from 'react'
import { Modal } from './Modal'
import { postRSVP } from '../api/rsvp'
import { postWish } from '../api/wishes'

export function RSVPModal({ show, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', attendees: '1', ucapan: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) return
    setStatus('loading')
    try {
      await postRSVP(form)
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
              {['1', '2'].map(n => (
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

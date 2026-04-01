import { useState } from 'react'
import { Modal } from './Modal'
import { postWish } from '../api/wishes'

export function UcapanModal({ show, onClose }) {
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

import { useState, useEffect } from 'react'
import { Modal } from './Modal'
import { fetchGifts, postGift } from '../api/gifts'

function GiftForm({ onDone }) {
  const [name, setName] = useState('')
  const [gift, setGift] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    await postGift(name, gift)
    onDone()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-3">
      <input
        placeholder="Name (optional)"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        placeholder="What is your gift?"
        value={gift}
        onChange={e => setGift(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-[#c9a27e] text-white py-2 rounded">
        Submit
      </button>
    </form>
  )
}

export function GiftModal({ show, onClose }) {
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
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2 bg-[#c9a27e] text-white rounded"
        >
          Claim Gift
        </button>
      )}
      {showForm && <GiftForm onDone={onClose} />}
    </Modal>
  )
}

import { Modal } from './Modal'

const contacts = [
  { name: 'Furqan', role: 'Man of Honor',  number: '+60137795811' },
  { name: 'Syaza',  role: 'Maid of Honor', number: '+601128212348' },
]

export function CallModal({ show, onClose }) {
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

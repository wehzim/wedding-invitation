import { forwardRef } from 'react'
import thing from '../assets/thing.png'

export const ProgrammeSection = forwardRef(({ days }, ref) => (
  <section ref={ref} className="flex flex-col items-center justify-center py-16 bg-cover bg-center gap-8">
    <div className="will-reveal px-slow relative w-[75%] max-w-xs mx-auto">
      <img src={thing} alt="Programme" className="w-full h-auto mb-5" />
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
      <div className="will-reveal flex flex-col items-center mb-5" style={{ transitionDelay: '0.15s' }}>
        <p className="text-xs tracking-widest text-primary mb-3">COUNTDOWN</p>
        <div className="border border-[#c9a27e] rounded-full px-8 py-3 flex items-center gap-2">
          <span className="font-im-fell-english-regular-italic text-4xl text-secondary">{days}</span>
          <span className="text-xs text-primary tracking-widest">DAYS LEFT</span>
        </div>
      </div>
    )}
  </section>
))

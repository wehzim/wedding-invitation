import { forwardRef } from 'react'

export const InvitationSection = forwardRef((_, ref) => (
  <section ref={ref} className="flex items-center justify-center py-16 bg-cover bg-center">
    <div className="will-reveal px-slow max-w-lg mx-auto text-center rounded-lg p-6 pt-16">
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
))

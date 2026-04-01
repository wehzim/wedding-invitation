import { forwardRef } from 'react'
import img1 from '../assets/1.jpg'
import img2 from '../assets/2.jpg'
import img3 from '../assets/3.jpg'
import img4 from '../assets/4.jpg'
import img5 from '../assets/5.jpeg'

const GALLERY_IMAGES = [img1, img2, img3, img4, img5]

export const GallerySection = forwardRef((_, ref) => (
  <section ref={ref} className="flex flex-col items-center justify-center py-16" style={{ overflow: 'hidden', maxWidth: '100%' }}>
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
))

import { useState, useEffect, useRef, useCallback, forwardRef } from 'react'
import img1 from '../assets/1.jpg'
import img2 from '../assets/2.jpg'
import img3 from '../assets/3.jpg'
import img4 from '../assets/4.jpg'
import img5 from '../assets/5.jpeg'
import flower from '../assets/flower.png'
import whiteFlower from '../assets/white-flower.png'
import pinkFlower from '../assets/pink-flower.png'

const GALLERY_IMAGES = [img1, img2, img3, img4, img5]
const SLIDE_W = 280
const GAP = 16

export const GallerySection = forwardRef((_, forwardedRef) => {
  const [index, setIndex] = useState(0)
  const [centerOffset, setCenterOffset] = useState(70)
  const [drag, setDrag] = useState({ active: false, startX: 0, startY: 0, offset: 0, locked: null })

  const sectionRef = useRef(null)

  const setRefs = useCallback(node => {
    sectionRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) forwardedRef.current = node
  }, [forwardedRef])

  useEffect(() => {
    const update = () => {
      if (sectionRef.current) {
        setCenterOffset((sectionRef.current.offsetWidth - SLIDE_W) / 2)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const goTo = i => setIndex(i)

  const onPointerDown = e => {
    setDrag({ active: true, startX: e.clientX, startY: e.clientY, offset: 0, locked: null })
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = e => {
    if (!drag.active) return
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY

    // Determine lock direction on first meaningful movement
    if (drag.locked === null && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      const isHorizontal = Math.abs(dx) > Math.abs(dy)
      if (!isHorizontal) {
        // Vertical scroll intent — release capture so Lenis can scroll
        e.currentTarget.releasePointerCapture(e.pointerId)
        setDrag({ active: false, startX: 0, startY: 0, offset: 0, locked: null })
        return
      }
      setDrag(d => ({ ...d, locked: 'h', offset: dx }))
      return
    }

    if (drag.locked === 'h') {
      e.preventDefault()
      setDrag(d => ({ ...d, offset: dx }))
    }
  }

  const onPointerUp = () => {
    if (!drag.active) return
    if (drag.offset < -50) goTo(Math.min(index + 1, GALLERY_IMAGES.length - 1))
    else if (drag.offset > 50) goTo(Math.max(index - 1, 0))
    setDrag({ active: false, startX: 0, startY: 0, offset: 0, locked: null })
  }

  const translateX = centerOffset - index * (SLIDE_W + GAP) + drag.offset

  return (
    <section ref={setRefs} className="relative flex flex-col items-center justify-center py-16" style={{ overflow: 'hidden' }}>
      <p className="will-reveal text-xs tracking-[0.3em] text-primary mb-1">OUR MEMORIES</p>
      <h2
        className="will-reveal font-im-fell-english-regular-italic text-5xl text-secondary mb-2"
        style={{ transitionDelay: '0.08s' }}
      >
        Gallery
      </h2>
      <div className="will-reveal w-16 h-px bg-[#c9a27e] mb-8" style={{ transitionDelay: '0.12s' }} />

      <div
        style={{ width: '100%', overflow: 'hidden', cursor: drag.active ? 'grabbing' : 'grab' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="flex gap-4 pb-4"
          style={{
            transform: `translateX(${translateX}px)`,
            transition: drag.active ? 'none' : 'transform 0.6s cubic-bezier(0.25, 0, 0, 1)',
            willChange: 'transform',
            userSelect: 'none',
          }}
        >
          {GALLERY_IMAGES.map((src, i) => (
            <div
              key={i}
              className="shrink-0 rounded-2xl overflow-hidden shadow-md"
              style={{
                width: `${SLIDE_W}px`,
                aspectRatio: '3/4',
                opacity: i === index ? 1 : 0.55,
                transform: i === index ? 'scale(1)' : 'scale(0.93)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
              }}
            >
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>

      <img src={flower}      alt="" className="px-mid pointer-events-none absolute top-0 left-0 w-24 md:w-28" />
      <img src={pinkFlower}  alt="" className="px-slow pointer-events-none absolute bottom-0 right-0 w-24 md:w-28" />
      <img src={whiteFlower} alt="" className="px-fast pointer-events-none absolute -bottom-40 left-0 w-16 md:w-20 -translate-y-1/2" />

      <div className="flex gap-2 mt-5">
        {GALLERY_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === index ? '20px' : '6px',
              height: '6px',
              borderRadius: '9999px',
              background: '#c9a27e',
              opacity: i === index ? 1 : 0.4,
              transition: 'width 0.35s cubic-bezier(0.25, 0, 0, 1), opacity 0.35s ease',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </section>
  )
})

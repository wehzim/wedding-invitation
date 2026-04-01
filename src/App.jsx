import { useState, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import './App.css'
import music from './sound/howls-moving-castle.mp3'
import { WEDDING_DATE } from './config'
import topRight from './assets/top-right.png'
import botLeft from './assets/bot-left.png'
import flower from './assets/flower.png'
import pinkFlower from './assets/pink-flower.png'
import { CoverSection } from './sections/CoverSection'
import { InvitationSection } from './sections/InvitationSection'
import { ProgrammeSection } from './sections/ProgrammeSection'
import { GallerySection } from './sections/GallerySection'
import { UcapanSection } from './sections/UcapanSection'
import { BottomMenu } from './widgets/BottomMenu'
import { CallModal } from './widgets/CallModal'
import { RSVPModal } from './widgets/RSVPModal'
import { UcapanModal } from './widgets/UcapanModal'
import { GiftModal } from './widgets/GiftModal'

function App() {
  const [opened, setOpened] = useState(false)
  const [panelsGone, setPanelsGone] = useState(false)
  const [days, setDays] = useState(0)
  const [modal, setModal] = useState(null)
  const [musicPlaying, setMusicPlaying] = useState(false)

  const audioRef       = useRef(null)
  const cardRef        = useRef(null)
  const cardContentRef = useRef(null)
  const coverRef       = useRef(null)
  const inviteRef      = useRef(null)
  const programRef     = useRef(null)
  const galleryRef     = useRef(null)
  const ucapanRef      = useRef(null)

  useEffect(() => {
    const calc = () => {
      const diff = WEDDING_DATE - new Date()
      if (diff > 0) setDays(Math.floor(diff / (1000 * 60 * 60 * 24)))
    }
    calc()
    const interval = setInterval(calc, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const card = cardRef.current
    const content = cardContentRef.current
    if (!card || !content) return

    const lenis = new Lenis({
      wrapper: card,
      content,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: true,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
    })

    const checkReveals = () => {
      const cardRect = card.getBoundingClientRect()
      const threshold = cardRect.top + cardRect.height * 0.83
      card.querySelectorAll('.will-reveal:not(.visible)').forEach(el => {
        if (el.getBoundingClientRect().top < threshold) {
          el.classList.add('visible')
        }
      })
    }

    lenis.on('scroll', ({ scroll }) => {
      checkReveals()
      const r = document.documentElement.style
      r.setProperty('--px-slow', `${scroll * 0.05}px`)
      r.setProperty('--px-mid',  `${scroll * 0.12}px`)
      r.setProperty('--px-fast', `${scroll * 0.22}px`)
    })

    let rafId
    const raf = time => { lenis.raf(time); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

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

  const handleSealClick = () => {
    setOpened(true)
    const audio = document.getElementById('bg-music')
    if (audio) setTimeout(() => fadeInAudio(audio, 0.5, 2500), 200)
    setTimeout(() => setPanelsGone(true), 1300)
  }

  const handleMusicToggle = () => {
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
  }

  const openLocation = () => {
    window.open('https://maps.google.com/?q=30+Jalan+Timur+Assam+Kumbang+34000+Taiping+Perak', '_blank')
  }

  return (
		<div
			className="desktop-backdrop flex items-center justify-center"
			style={{ minHeight: "100dvh" }}
		>
			<img
				src={topRight}
				className="desktop-floral desktop-floral-tr"
				alt=""
			/>
			<img
				src={botLeft}
				className="desktop-floral desktop-floral-bl"
				alt=""
			/>
			<img
				src={flower}
				className="desktop-floral desktop-floral-tl"
				alt=""
			/>
			<img
				src={pinkFlower}
				className="desktop-floral desktop-floral-br"
				alt=""
			/>

			<div className={`envelope-container ${opened ? "opened" : ""}`}>
				{!panelsGone && <div className="panel left"></div>}
				{!panelsGone && <div className="panel right"></div>}

				<div
					className="seal text-center font-im-fell-english-regular-italic"
					onClick={handleSealClick}
				>
					Azim <br /> & <br /> Nia
				</div>
				<audio ref={audioRef} id="bg-music" loop preload="auto">
					<source src={music} type="audio/mpeg" />
				</audio>

				<div className="card" ref={cardRef}>
					<div ref={cardContentRef}>
						<CoverSection ref={coverRef} />
						<div
							style={{
								position: "relative",
								height: "60px",
								background:
									"linear-gradient(to bottom, #fcf0f0, transparent)",
								zIndex: 5,
								pointerEvents: "none",
							}}
						/>
						<InvitationSection ref={inviteRef} />
						<ProgrammeSection ref={programRef} days={days} />
						<GallerySection ref={galleryRef} />
						<UcapanSection
							ref={ucapanRef}
							onWriteClick={() => setModal("ucapan")}
							onRSVPClick={() => setModal("rsvp")}
						/>
					</div>
					<BottomMenu
						onCall={() => setModal("call")}
						onLocation={openLocation}
						onRSVP={() => setModal("rsvp")}
						onGift={() => setModal("gift")}
						musicPlaying={musicPlaying}
						onMusicToggle={handleMusicToggle}
					/>
				</div>
			</div>

			<CallModal show={modal === "call"} onClose={() => setModal(null)} />
			<RSVPModal show={modal === "rsvp"} onClose={() => setModal(null)} />
			<UcapanModal
				show={modal === "ucapan"}
				onClose={() => setModal(null)}
			/>
			<GiftModal show={modal === "gift"} onClose={() => setModal(null)} />
		</div>
  );
}

export default App

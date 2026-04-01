export function BottomMenu({ onCall, onLocation, onRSVP, onGift, musicPlaying, onMusicToggle }) {
  return (
    <div className="bottom-menu">
      <button title="Contact" onClick={onCall}>
        <i className="fas fa-phone"></i>
      </button>
      <button title="Location" onClick={onLocation}>
        <i className="fas fa-map-marker-alt"></i>
      </button>
      <button title="RSVP" onClick={onRSVP}>
        <i className="fas fa-envelope-open-text"></i>
      </button>
      <button title="Gift" onClick={onGift}>
        <i className="fas fa-gift"></i>
      </button>
      <button title="Music" onClick={onMusicToggle}>
        <i className={`fas ${musicPlaying ? 'fa-pause-circle' : 'fa-play-circle'}`}></i>
      </button>
    </div>
  )
}

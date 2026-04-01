const ITEMS = (onCall, onLocation, onRSVP, onGift, musicPlaying, onMusicToggle) => [
  { icon: 'fa-phone',             label: 'Call',     action: onCall },
  { icon: 'fa-map-marker-alt',    label: 'Map',      action: onLocation },
  { icon: 'fa-envelope-open-text',label: 'RSVP',     action: onRSVP },
  { icon: 'fa-gift',              label: 'Gift',     action: onGift },
  {
    icon: musicPlaying ? 'fa-pause' : 'fa-music',
    label: musicPlaying ? 'Pause' : 'Music',
    action: onMusicToggle,
    active: musicPlaying,
  },
]

export function BottomMenu({ onCall, onLocation, onRSVP, onGift, musicPlaying, onMusicToggle }) {
  const items = ITEMS(onCall, onLocation, onRSVP, onGift, musicPlaying, onMusicToggle)

  return (
    <div className="bottom-menu">
      <div className="bottom-menu-border">
        <span className="bottom-menu-ornament">✦</span>
      </div>
      {items.map(({ icon, label, action, active }) => (
        <button
          key={label}
          onClick={action}
          className={`bottom-menu-btn${active ? ' active' : ''}`}
          title={label}
        >
          <i className={`fas ${icon} bottom-menu-icon`} />
          <span className="bottom-menu-label">{label}</span>
        </button>
      ))}
    </div>
  )
}

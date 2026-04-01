import { GOOGLE_SCRIPT_URL } from '../config'

export async function fetchGifts() {
  try {
    const res = await fetch(`${GOOGLE_SCRIPT_URL}?action=getGifts`)
    const data = await res.json()
    return data.status === 'ok' ? data.gifts : []
  } catch (err) {
    console.log('fetchGifts failed:', err)
    return []
  }
}

export async function postGift(name, gift) {
  const params = new URLSearchParams({
    action: 'saveGift',
    name,
    gift,
    timestamp: new Date().toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
  })
  await fetch(`${GOOGLE_SCRIPT_URL}?${params}`, { method: 'GET', mode: 'no-cors' })
  window.dispatchEvent(new Event('gift-updated'))
}

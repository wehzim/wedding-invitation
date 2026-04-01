import { GOOGLE_SCRIPT_URL } from '../config'

export async function postRSVP({ name, phone, attendees, ucapan }) {
  const params = new URLSearchParams({
    name, phone, attendees, ucapan,
    timestamp: new Date().toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
  })
  await fetch(`${GOOGLE_SCRIPT_URL}?${params}`, { method: 'GET', mode: 'no-cors' })
}

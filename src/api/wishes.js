import { GOOGLE_SCRIPT_URL } from '../config'

export async function fetchWishes() {
  try {
    const res = await fetch(
      `${GOOGLE_SCRIPT_URL}?action=getUcapan&_=${Date.now()}`,
      { method: 'GET' }
    )
    const data = await res.json()
    return data.status === 'ok' && Array.isArray(data.wishes) ? data.wishes : []
  } catch {
    return []
  }
}

export async function postWish(name, message) {
  const params = new URLSearchParams({
    action: 'saveUcapan', name, message,
    timestamp: new Date().toLocaleString('ms-MY', { timeZone: 'Asia/Kuala_Lumpur' }),
  })
  await fetch(`${GOOGLE_SCRIPT_URL}?${params}`, { method: 'GET', mode: 'no-cors' })
  window.dispatchEvent(new Event('ucapan-updated'))
}

export async function addLike(rowIndex) {
  const params = new URLSearchParams({ action: 'addLike', rowIndex })
  await fetch(`${GOOGLE_SCRIPT_URL}?${params}`, { method: 'GET', mode: 'no-cors' })
}

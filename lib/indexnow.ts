const INDEXNOW_KEY = 'e3fd09fc-a5a3-407e-a090-fe0f2bac6e61'
const HOST = 'https://geo-gastro.vercel.app'

export function pingIndexNow(scannedUrl: string): void {
  const resultUrl = `${HOST}/results?url=${encodeURIComponent(scannedUrl)}`
  fetch(
    `https://api.indexnow.org/indexnow?url=${encodeURIComponent(resultUrl)}&key=${INDEXNOW_KEY}`
  ).catch(() => {})
}

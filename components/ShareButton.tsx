'use client'
import { useState } from 'react'

interface Props {
  score: number
  resultUrl: string
}

export default function ShareButton({ score, resultUrl }: Props) {
  const [copied, setCopied] = useState(false)

  const baseUrl = 'https://geo-gastro.vercel.app'
  const shareText = `Ich hab gerade gecheckt wie gut mein Betrieb bei ChatGPT & Co bekannt ist: ${score}/100. Kennt ChatGPT & Co deinen Betrieb überhaupt? Kostenlos testen: ${baseUrl}`

  function handleWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')
  }

  function handleCopy() {
    navigator.clipboard.writeText(resultUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      <button
        onClick={handleWhatsApp}
        className="h-11 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#25D366' }}
      >
        Via WhatsApp teilen
      </button>
      <button
        onClick={handleCopy}
        className="h-11 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#A8E6A3', color: '#000' }}
      >
        {copied ? 'Kopiert!' : 'Link kopieren'}
      </button>
    </div>
  )
}

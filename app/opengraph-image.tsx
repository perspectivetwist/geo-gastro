import { ImageResponse } from 'next/og'

export const alt = 'GEO Scanner – Wirst du von KI gefunden?'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#0A0A0A',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Glow effect */}
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,230,163,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Score circle */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          border: '4px solid #A8E6A3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 30,
        }}
      >
        <span style={{ fontSize: 48, fontWeight: 'bold', color: '#F0F0F0' }}>GEO</span>
      </div>

      <h1
        style={{
          fontSize: 56,
          fontWeight: 'bold',
          color: '#F0F0F0',
          margin: 0,
          textAlign: 'center',
        }}
      >
        Wirst du von KI gefunden?
      </h1>

      <p
        style={{
          fontSize: 24,
          color: '#A8E6A3',
          margin: '16px 0 0 0',
          textAlign: 'center',
        }}
      >
        Kostenloser GEO-Score in 20 Sekunden
      </p>

      <p
        style={{
          fontSize: 18,
          color: '#666',
          margin: '40px 0 0 0',
        }}
      >
        geo-transformer.vercel.app
      </p>
    </div>,
    { ...size }
  )
}

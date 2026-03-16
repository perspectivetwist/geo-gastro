import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 24,
        background: '#A8E6A3',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#0A0A0A',
        borderRadius: 8,
        fontWeight: 'bold',
      }}
    >
      G
    </div>,
    { ...size }
  )
}

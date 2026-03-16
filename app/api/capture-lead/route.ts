import { NextRequest, NextResponse } from 'next/server'
import { saveGeoLead } from '@/lib/notion'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { email: string; url: string; score: number }
    const { email, url, score } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email fehlt' }, { status: 400 })
    }

    if (email.length > 254) {
      return NextResponse.json({ error: 'Email zu lang' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Ungültige Email-Adresse' }, { status: 400 })
    }

    await saveGeoLead({ email, url: url || '', score: score || 0 })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json({ success: true }) // User sieht Erfolg, Fehler nur im Log
  }
}

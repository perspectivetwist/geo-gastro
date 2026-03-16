import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })

  const key = 'e3fd09fc-a5a3-407e-a090-fe0f2bac6e61'
  try {
    await fetch(`https://www.bing.com/indexnow?url=${encodeURIComponent(url)}&key=${key}`)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'ping failed' }, { status: 500 })
  }
}

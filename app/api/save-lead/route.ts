import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  let email = ''
  let url = ''
  let source = ''

  try {
    const body = await request.json()
    email = String(body.email || '').trim()
    url = String(body.url || '')
    source = String(body.source || '')
  } catch {
    return NextResponse.json({ success: true })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Ungültige Email' }, { status: 400 })
  }

  const notionToken = process.env.NOTION_TOKEN
  const dbId = process.env.NOTION_LEADS_DB_ID

  if (notionToken && dbId) {
    try {
      const res = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          parent: { database_id: dbId },
          properties: {
            'Email': { title: [{ text: { content: email } }] },
            'URL gescannt': { url: url.startsWith('http') ? url : null },
            'Source': { select: { name: source || 'Unknown' } },
            'Status': { select: { name: 'neu' } },
          },
        }),
      })
      // nicht mehr still: Lead-Verlust muss in den Vercel-Logs sichtbar sein
      if (!res.ok) {
        console.error('save-lead: Notion-Write fehlgeschlagen', res.status, await res.text())
      }
    } catch (err) {
      console.error('save-lead: Notion-Write Exception', err)
    }
  } else {
    console.error('save-lead: NOTION_TOKEN oder NOTION_LEADS_DB_ID fehlt — Lead NICHT gespeichert')
  }

  return NextResponse.json({ success: true })
}

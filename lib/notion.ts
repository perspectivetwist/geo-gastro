import { GeoLead } from '@/types/geo'

export async function logScan(url: string, score: number): Promise<void> {
  const dbId = process.env.NOTION_SCANS_DB_ID
  if (!dbId) return

  await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: dbId },
      properties: {
        'URL': { title: [{ text: { content: url } }] },
        'Score': { number: score },
      },
    }),
  }).catch(() => {})
}

export async function saveGeoLead(lead: GeoLead): Promise<void> {
  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_GEO_LEADS_DB_ID },
      properties: {
        'Email': {
          title: [{ text: { content: lead.email } }],
        },
        'URL': {
          rich_text: [{ text: { content: lead.url } }],
        },
        'Score': {
          number: lead.score,
        },
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Notion API Fehler: ${response.status} - ${error}`)
  }
}

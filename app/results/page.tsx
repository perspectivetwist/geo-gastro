import type { Metadata } from 'next'
import ResultsClient from './ResultsClient'

type Props = { searchParams: { url?: string } }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const rawUrl = searchParams.url || ''
  let domain = ''
  try { domain = new URL(decodeURIComponent(rawUrl)).hostname } catch {}

  const title = domain
    ? `KI-Analyse: ${domain} | GEO Gastro Scanner`
    : 'GEO Gastro Scanner für Gastronomie'
  const description = domain
    ? `GEO-Ergebnis für ${domain}: Wie gut ist der KI-Ruf deines Restaurants?`
    : 'Kostenloser GEO-Scan für die Gastronomie'

  return {
    title,
    description,
    openGraph: { title, description },
  }
}

export default function ResultsPage() {
  return <ResultsClient />
}

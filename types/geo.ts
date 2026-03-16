// GEO Scanner V0 – TypeScript Interfaces

/** Rohes Scraping-Ergebnis von Jina.ai */
export interface ScrapedContent {
  url: string
  title: string
  description: string
  bodyText: string
  headings: string[]
  hasJsonLd: boolean
  schemaMarkup: string | null
  hasFaq: boolean
  hasAuthor: boolean
  hasDate: boolean
  hasExternalLinks: boolean
}

/** GEO-Score mit 5 Dimensionen (Total = Summe aller Dimensionen) */
export interface GeoScore {
  total: number // 0–100
  dimensions: {
    schema: number     // 0–25: Schema Markup
    structure: number  // 0–25: Content Structure
    statistics: number // 0–20: Statistics & Citations
    eeat: number       // 0–20: E-E-A-T Signals
    technical: number  // 0–10: Technical GEO
  }
}

/** Aktionsplan pro Dimension */
export interface DimensionAction {
  title: string
  score: string
  status: 'kritisch' | 'verbesserung' | 'gut'
  topFix: string
  steps: string[]
  businessImpact: string
  effort: string
}

export interface GeoActionPlan {
  summary: string
  actions: DimensionAction[]
}

/** Vollständiges Analyse-Ergebnis von Claude Haiku */
export interface GeoAnalysis {
  url: string
  score: GeoScore
  found: string[]
  missing: string[]
  summary: string
  recommendations: string[]
  actionPlan?: GeoActionPlan
  industry: string
  language: string
  scannedAt: string
}

/** Lead-Eintrag für Notion DB */
export interface GeoLead {
  email: string
  url: string
  score: number
}

/** Standard API Response Wrapper */
export interface ApiResponse<T> {
  data?: T
  error?: string
  details?: string
}

/** Score-Bands in KMU-Sprache (keine technischen Begriffe) */
export function getScoreBand(score: number): { label: string; color: string; description: string } {
  if (score >= 80) {
    return {
      label: 'Sehr gut',
      color: '#A8E6A3',
      description: 'Deine Website wird sehr wahrscheinlich von KI-Suchmaschinen zitiert.',
    }
  }
  if (score >= 60) {
    return {
      label: 'Gut',
      color: '#7BC477',
      description: 'Deine Website hat gute Grundlagen, aber es gibt noch Potenzial.',
    }
  }
  if (score >= 40) {
    return {
      label: 'Ausbaufähig',
      color: '#F59E0B',
      description: 'KI-Suchmaschinen finden dich teilweise – mit wenigen Änderungen geht mehr.',
    }
  }
  if (score >= 20) {
    return {
      label: 'Schwach',
      color: '#EF4444',
      description: 'Deine Website ist für die meisten KI-Suchmaschinen unsichtbar.',
    }
  }
  return {
    label: 'Kritisch',
    color: '#DC2626',
    description: 'KI-Suchmaschinen ignorieren deine Website komplett. Dringender Handlungsbedarf.',
  }
}

/** Dimensions-Labels in KMU-Sprache */
export const dimensionLabels: Record<string, { label: string; maxScore: number; description: string }> = {
  schema: {
    label: 'KI-Lesbarkeit',
    maxScore: 25,
    description: 'Können ChatGPT & Co. deine Inhalte strukturiert lesen?',
  },
  structure: {
    label: 'Inhaltsstruktur',
    maxScore: 25,
    description: 'Sind deine Texte klar gegliedert für KI?',
  },
  statistics: {
    label: 'Belege & Quellen',
    maxScore: 20,
    description: 'Untermauerst du deine Aussagen mit Fakten?',
  },
  eeat: {
    label: 'Glaubwürdigkeit',
    maxScore: 20,
    description: 'Erkennen ChatGPT & Co. dich als verlässliche Quelle?',
  },
  technical: {
    label: 'KI-Technik',
    maxScore: 10,
    description: 'Ist deine Website technisch für KI optimiert?',
  },
}

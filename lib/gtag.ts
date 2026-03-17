export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

export function pageview(url: string) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: url })
}

export function event({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

export function trackScanStart(url: string) {
  event({ action: 'scan_start', category: 'scanner', label: url })
}

export function trackScanComplete(url: string, score: number) {
  event({ action: 'scan_complete', category: 'scanner', label: url, value: score })
}

export function trackEmailGate(action: 'shown' | 'submitted' | 'skipped') {
  event({ action: `email_gate_${action}`, category: 'conversion' })
}

export function trackReportDownload() {
  event({ action: 'report_download', category: 'conversion' })
}

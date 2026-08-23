import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('CivicTrack UI error', error, info) }
  render() {
    if (!this.state.hasError) return this.props.children
    return <main className="grid min-h-[100dvh] place-items-center bg-civic-bg px-4"><div className="max-w-lg border border-civic-critical/45 bg-civic-surface p-8"><AlertTriangle className="text-red-300" size={32} strokeWidth={1.6} /><p className="eyebrow mt-6">Application recovery</p><h1 className="mt-2 text-2xl font-semibold">This view could not be rendered</h1><p className="mt-3 text-sm leading-6 text-civic-muted">Your locally saved reports are still intact. Reload the interface to restore the last stable view.</p><button onClick={() => window.location.reload()} className="mt-6 rounded-md border border-civic-accent bg-civic-accent px-4 py-2 text-sm font-semibold text-white">Reload CivicTrack</button></div></main>
  }
}

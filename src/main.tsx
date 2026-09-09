import { Component, type ReactNode, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error('RootErrorBoundary caught render error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: '#0f1117',
          color: '#f87171',
          padding: '32px',
          fontFamily: 'monospace',
          overflow: 'auto',
          zIndex: 999999,
        }}>
          <h1 style={{ color: '#ef4444', fontSize: '20px', marginBottom: '12px' }}>
            React Component Render Error
          </h1>
          <p style={{ color: '#ffffff', marginBottom: '16px' }}>{this.state.error.message}</p>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#94a3b8', fontSize: '13px' }}>
            {this.state.error.stack}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Failed to find root element')
}

createRoot(rootElement).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
)

import { useEffect, useState } from 'react'
import { getHealth } from './api/movieApi'
import { AuthProvider } from './context/AuthContext.jsx'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function AppShell() {
  const [backendStatus, setBackendStatus] = useState('checking')

  useEffect(() => {
    let active = true

    async function run() {
      try {
        await getHealth()
        if (active) setBackendStatus('online')
      } catch {
        if (active) setBackendStatus('offline')
      }
    }

    void run()

    return () => {
      active = false
    }
  }, [])

  return <AppRoutes backendStatus={backendStatus} />
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

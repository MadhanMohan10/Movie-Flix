import { useEffect, useMemo, useState } from 'react'
import { clearAuth, readStoredAuth, storeAuth } from '../utils/auth'
import { AuthContext } from './authContext'

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth())

  useEffect(() => {
    if (auth) {
      storeAuth(auth)
    } else {
      clearAuth()
    }
  }, [auth])

  const value = useMemo(() => {
    return {
      auth,
      isAuthenticated: Boolean(auth?.token),
      login: setAuth,
      logout: () => setAuth(null),
      setAuth,
    }
  }, [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

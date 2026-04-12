import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { API_URL } from '../config'

const AuthContext = createContext(null)

const STORAGE_KEY = 'totm_auth'
const REFRESH_INTERVAL_MS = 60_000

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  })

  // Keep a ref so the polling/focus handlers always see the latest user
  // without needing to be re-bound on every state change.
  const userRef = useRef(user)
  useEffect(() => {
    userRef.current = user
  }, [user])

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = (userData) => setUser(userData)
  const logout = useCallback(() => {
    setUser(null)
    localStorage.clear()
  }, [])

  const refreshUser = useCallback(async () => {
    const current = userRef.current
    if (!current?.token) return
    try {
      const res = await fetch(`${API_URL}/api/login/me`, {
        headers: { Authorization: `Bearer ${current.token}` },
      })
      if (res.status === 401) {
        logout()
        return
      }
      if (!res.ok) return
      const data = await res.json()
      if (data.role !== current.role || data.username !== current.username) {
        setUser({ ...current, username: data.username, role: data.role })
      }
    } catch {
      // Network blip — ignore, next tick will retry.
    }
  }, [logout])

  // Refresh on mount (if a cached user exists), on window focus,
  // and on a slow interval while the tab is active.
  useEffect(() => {
    if (!user) return

    refreshUser()

    const onFocus = () => refreshUser()
    window.addEventListener('focus', onFocus)

    const intervalId = setInterval(refreshUser, REFRESH_INTERVAL_MS)

    return () => {
      window.removeEventListener('focus', onFocus)
      clearInterval(intervalId)
    }
    // We only want this to (re)bind when the user transitions between
    // logged-out and logged-in, not on every role/username change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!user, refreshUser])

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

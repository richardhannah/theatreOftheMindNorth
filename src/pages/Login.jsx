import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import './Login.css'

const API_URL = import.meta.env.VITE_SERVER_URL || (import.meta.env.DEV ? 'http://localhost:8080' : '')

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, action: 'login' }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Login failed')
      }

      const data = await res.json()
      login({ token: data.token, username: data.username, role: data.role })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, password: '', action: 'logout' }),
      })
    } catch {
      // logout locally even if request fails
    }
    logout()
  }

  if (user) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Logged in</h2>
          <p className="login-info">Signed in as <strong>{user.username}</strong></p>
          <p className="login-info login-role">{user.role}</p>
          <button onClick={handleLogout} className="login-btn">Logout</button>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-card">
        <h2>Login</h2>
        {error && <p className="login-error">{error}</p>}
        <input
          autoFocus
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Login

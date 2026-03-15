import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import CharacterSheet from '../components/CharacterSheet/CharacterSheet'

const API_URL = import.meta.env.VITE_SERVER_URL || (import.meta.env.DEV ? 'http://localhost:8080' : '')

function CharacterSheetPage() {
  const { characterId } = useParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [characterData, setCharacterData] = useState(null)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/api/characters/${characterId}`, {
          headers: { 'Authorization': `Bearer ${user.token}` },
        })
        if (!res.ok) throw new Error('Failed to load character')
        const data = await res.json()
        setCharacterData(data)
        setError('')
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [characterId, user])

  if (!user) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>You must be <Link to="/login">logged in</Link> to view a character.</p>
      </div>
    )
  }

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>
  if (error) return <div style={{ padding: 20, textAlign: 'center', color: 'var(--blood-crimson)' }}>{error}</div>

  return (
    <CharacterSheet
      characterId={characterId}
      initialData={characterData}
      token={user.token}
      apiUrl={API_URL}
    />
  )
}

export default CharacterSheetPage

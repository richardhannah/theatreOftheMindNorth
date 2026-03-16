import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { API_URL } from '../config'
import InitialsToken from '../components/TokenPicker/InitialsToken'
import tokens from '../components/VTT/tokens'
import './Characters.css'

const tokenSrcMap = Object.fromEntries(tokens.map((t) => [t.id, t.src]))

function Characters() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [characters, setCharacters] = useState([])
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newClass, setNewClass] = useState('')

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user?.token}`,
  }

  const fetchCharacters = async () => {
    try {
      const res = await fetch(`${API_URL}/api/characters`, { headers })
      if (!res.ok) throw new Error('Failed to load characters')
      setCharacters(await res.json())
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (user) fetchCharacters()
  }, [user])

  const createCharacter = async (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      const res = await fetch(`${API_URL}/api/characters`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: newName.trim(), class: newClass, level: 1, alignment: '' }),
      })
      if (!res.ok) throw new Error('Failed to create character')
      const data = await res.json()
      setShowCreate(false)
      setNewName('')
      setNewClass('')
      navigate(`/characters/${data.character.characterId}`)
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteCharacter = async (id, name) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`${API_URL}/api/characters/${id}`, {
        method: 'DELETE',
        headers,
      })
      if (!res.ok) throw new Error('Failed to delete character')
      fetchCharacters()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user) {
    return (
      <div className="chars-page">
        <h2>Characters</h2>
        <p>You must be <Link to="/login">logged in</Link> to manage characters.</p>
      </div>
    )
  }

  return (
    <div className="chars-page">
      <h2>Characters</h2>
      {error && <p className="chars-error">{error}</p>}

      <div className="chars-list">
        {characters.length === 0 && (
          <div className="chars-empty">No characters yet — create one to get started</div>
        )}
        {characters.map((c) => (
          <div key={c.characterId} className="chars-card">
            <Link to={`/characters/${c.characterId}`} className="chars-card-link">
              {c.tokenId && tokenSrcMap[c.tokenId] ? (
                <img src={tokenSrcMap[c.tokenId]} alt="" className="chars-card-token" />
              ) : (
                <InitialsToken name={c.name || '?'} size={32} />
              )}
              <span className="chars-card-name">{c.name || 'Unnamed'}</span>
              <span className="chars-card-detail">
                {c.class ? `Level ${c.level} ${c.class}` : 'New Character'}
              </span>
            </Link>
            <button
              className="chars-card-delete"
              onClick={() => deleteCharacter(c.characterId, c.name)}
            >x</button>
          </div>
        ))}
      </div>

      {!showCreate ? (
        <button className="chars-create-btn" onClick={() => setShowCreate(true)}>
          + New Character
        </button>
      ) : (
        <form onSubmit={createCharacter} className="chars-create-form">
          <input
            autoFocus
            className="cs-input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Character name"
          />
          <select
            className="cs-select"
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
          >
            <option value="">Class...</option>
            {['Fighter', 'Cleric', 'Magic-User', 'Thief', 'Elf', 'Dwarf', 'Halfling', 'Mystic'].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button type="submit" className="chars-create-btn">Create</button>
          <button type="button" className="chars-cancel-btn" onClick={() => setShowCreate(false)}>Cancel</button>
        </form>
      )}
    </div>
  )
}

export default Characters

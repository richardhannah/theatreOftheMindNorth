import { useState } from 'react'
import tokens from '../VTT/tokens'
import './TokenPicker.css'

function TokenPicker({ onSelect, onClose }) {
  const [filter, setFilter] = useState('')

  const filtered = tokens.filter((t) =>
    t.label.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="token-picker-overlay" onClick={onClose}>
      <div className="token-picker" onClick={(e) => e.stopPropagation()}>
        <div className="token-picker-header">
          <span>Select a Token</span>
          <button className="token-picker-close" onClick={onClose}>x</button>
        </div>
        <input
          autoFocus
          className="token-picker-search"
          type="text"
          placeholder="Search tokens..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="token-picker-grid">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="token-picker-item"
              onClick={() => { onSelect(t); onClose() }}
              title={t.label}
            >
              <img src={t.src} alt={t.label} draggable={false} />
              <span className="token-picker-item-label">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TokenPicker

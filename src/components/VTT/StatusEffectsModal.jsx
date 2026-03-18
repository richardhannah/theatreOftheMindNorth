import { useState } from 'react'
import { BUFFS, PENALTIES } from './statusEffects'

function StatusEffectsModal({ counterLabel, activeEffects = [], onToggle, onClose }) {
  const [tab, setTab] = useState('buffs')
  const effects = tab === 'buffs' ? BUFFS : PENALTIES

  return (
    <div className="vtt-modal-overlay" onClick={onClose}>
      <div className="vtt-modal vtt-modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="vtt-modal-header">
          <span>Status Effects — {counterLabel}</span>
          <button className="vtt-modal-close" onClick={onClose}>&#x2715;</button>
        </div>
        <div className="vtt-status-tabs">
          <button
            className={`vtt-status-tab${tab === 'buffs' ? ' vtt-status-tab-active vtt-status-tab-buff' : ''}`}
            onClick={() => setTab('buffs')}
          >Buffs</button>
          <button
            className={`vtt-status-tab${tab === 'penalties' ? ' vtt-status-tab-active vtt-status-tab-penalty' : ''}`}
            onClick={() => setTab('penalties')}
          >Penalties</button>
        </div>
        <div className="vtt-modal-body vtt-status-list">
          {effects.map((e) => {
            const active = activeEffects.includes(e.id)
            return (
              <button
                key={e.id}
                className={`vtt-status-item${active ? ' vtt-status-active' : ''}`}
                onClick={() => onToggle(e.id)}
              >
                <span className="vtt-status-icon">{e.icon}</span>
                <div className="vtt-status-info">
                  <span className="vtt-status-name">{e.label}</span>
                  <span className="vtt-status-desc">{e.description}</span>
                </div>
                {active && <span className="vtt-status-check">&#x2713;</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default StatusEffectsModal

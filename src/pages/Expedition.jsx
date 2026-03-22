import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../auth/AuthContext'
import { API_URL } from '../config'
import { usePersistence } from '../hooks/usePersistence'
import TokenPicker from '../components/TokenPicker/TokenPicker'
import InitialsToken from '../components/TokenPicker/InitialsToken'
import tokens from '../components/VTT/tokens'
import { PACK_ANIMAL_MAP, WAGON_MAP, PACK_ANIMAL_TYPES, WAGON_TYPES, MERCENARY_TYPES, MERCENARY_RACES, SPECIALIST_TYPES } from './expeditionData'
import './Expedition.css'

const tokenSrcMap = Object.fromEntries(tokens.map((t) => [t.id, t.src]))
const COIN_TYPES = ['platinum', 'gold', 'electrum', 'silver', 'copper']
const COIN_LABELS = { platinum: 'PP', gold: 'GP', electrum: 'EP', silver: 'SP', copper: 'CP' }

const DEFAULT_EXPEDITION = {
  foreman: { name: '', tokenId: '' },
  animals: [],
  wagons: [],
  mercenaries: {},
  disabledRaces: [],
  specialists: {},
  notes: '',
}

async function loadExpeditionFromApi(headers) {
  const [stashData, animalsData, wagonsData, stateData, mercsData, specsData] = await Promise.all([
    fetch(`${API_URL}/api/expedition/stash`, { headers }).then((r) => r.ok ? r.json() : null),
    fetch(`${API_URL}/api/expedition/animals`, { headers }).then((r) => r.ok ? r.json() : []),
    fetch(`${API_URL}/api/expedition/wagons`, { headers }).then((r) => r.ok ? r.json() : []),
    fetch(`${API_URL}/api/expedition/state`, { headers }).then((r) => r.ok ? r.json() : null),
    fetch(`${API_URL}/api/expedition/mercenaries`, { headers }).then((r) => r.ok ? r.json() : []),
    fetch(`${API_URL}/api/expedition/specialists`, { headers }).then((r) => r.ok ? r.json() : []),
  ])

  const result = { ...DEFAULT_EXPEDITION, _stash: null, _equipment: [] }

  if (stashData) {
    result._stash = stashData
    try {
      result._equipment = typeof stashData.equipment === 'string' ? JSON.parse(stashData.equipment) : (stashData.equipment || [])
    } catch { result._equipment = [] }
  }

  if (animalsData.length > 0 || wagonsData.length > 0) {
    result.animals = animalsData.map((a) => ({
      id: a.packAnimalId, type: a.type, name: a.name, notes: a.notes, assignedWagonId: a.assignedWagonId || null,
    }))
    result.wagons = wagonsData.map((w) => ({
      id: w.wagonId, type: w.type, name: w.name, notes: w.notes,
    }))
  }

  if (stateData) {
    result.foreman = { name: stateData.foremanName || '', tokenId: stateData.foremanTokenId || '' }
    try { result.disabledRaces = typeof stateData.disabledRaces === 'string' ? JSON.parse(stateData.disabledRaces) : (stateData.disabledRaces || []) } catch { /* keep default */ }
    result.notes = stateData.notes || ''
  }

  if (mercsData.length > 0) {
    const mercMap = {}
    mercsData.forEach((m) => { if (m.count > 0) mercMap[`${m.type}|${m.race}`] = m.count })
    result.mercenaries = mercMap
  }

  if (specsData.length > 0) {
    const specMap = {}
    specsData.forEach((s) => { if (s.count > 0) specMap[s.type] = s.count })
    result.specialists = specMap
  }

  return result
}

async function saveExpeditionToApi(data, headers) {
  // Sync state (foreman, disabled races)
  await fetch(`${API_URL}/api/expedition/state`, {
    method: 'PUT', headers,
    body: JSON.stringify({
      foremanName: data.foreman.name,
      foremanTokenId: data.foreman.tokenId,
      disabledRaces: JSON.stringify(data.disabledRaces),
      notes: data.notes,
    }),
  })

  // Sync animals
  const serverAnimals = await fetch(`${API_URL}/api/expedition/animals`, { headers }).then((r) => r.json())
  const serverIds = new Set(serverAnimals.map((a) => a.packAnimalId))
  const localIds = new Set(data.animals.filter((a) => a.id).map((a) => a.id))

  for (const sa of serverAnimals) {
    if (!localIds.has(sa.packAnimalId)) {
      await fetch(`${API_URL}/api/expedition/animals/${sa.packAnimalId}`, { method: 'DELETE', headers })
    }
  }

  const updatedAnimals = [...data.animals]
  for (let i = 0; i < updatedAnimals.length; i++) {
    const a = updatedAnimals[i]
    if (!a.type) continue
    if (a.id && serverIds.has(a.id)) {
      await fetch(`${API_URL}/api/expedition/animals/${a.id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ type: a.type, name: a.name, notes: a.notes, assignedWagonId: a.assignedWagonId }),
      })
    } else if (!a.id) {
      const res = await fetch(`${API_URL}/api/expedition/animals`, {
        method: 'POST', headers,
        body: JSON.stringify({ type: a.type, name: a.name, notes: a.notes }),
      })
      if (res.ok) {
        const created = await res.json()
        updatedAnimals[i] = { ...a, id: created.packAnimalId }
      }
    }
  }

  // Sync wagons
  const serverWagons = await fetch(`${API_URL}/api/expedition/wagons`, { headers }).then((r) => r.json())
  const serverWagonIds = new Set(serverWagons.map((w) => w.wagonId))
  const localWagonIds = new Set(data.wagons.filter((w) => w.id).map((w) => w.id))

  for (const sw of serverWagons) {
    if (!localWagonIds.has(sw.wagonId)) {
      await fetch(`${API_URL}/api/expedition/wagons/${sw.wagonId}`, { method: 'DELETE', headers })
    }
  }

  for (let i = 0; i < data.wagons.length; i++) {
    const w = data.wagons[i]
    if (!w.type) continue
    if (w.id && serverWagonIds.has(w.id)) {
      await fetch(`${API_URL}/api/expedition/wagons/${w.id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ type: w.type, name: w.name, notes: w.notes }),
      })
    } else if (!w.id) {
      const res = await fetch(`${API_URL}/api/expedition/wagons`, {
        method: 'POST', headers,
        body: JSON.stringify({ type: w.type, name: w.name, notes: w.notes }),
      })
      if (res.ok) {
        const created = await res.json()
        data.wagons[i] = { ...w, id: created.wagonId }
      }
    }
  }

  // Sync mercenaries
  const mercList = Object.entries(data.mercenaries)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => { const [type, race] = key.split('|'); return { type, race, count } })
  await fetch(`${API_URL}/api/expedition/mercenaries`, { method: 'PUT', headers, body: JSON.stringify(mercList) })

  // Sync specialists
  const specList = Object.entries(data.specialists)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => ({ type, count }))
  await fetch(`${API_URL}/api/expedition/specialists`, { method: 'PUT', headers, body: JSON.stringify(specList) })
}

function Expedition() {
  const { user } = useAuth()
  const isDM = user?.role === 'Admin'
  const [showTokenPicker, setShowTokenPicker] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Stash is read-only, loaded separately (not part of persisted expedition data)
  const [stash, setStash] = useState(null)
  const [equipment, setEquipment] = useState([])

  const { data: exp, setData: setExp, loaded } = usePersistence({
    storageKey: 'expedition_data',
    defaultValue: DEFAULT_EXPEDITION,
    loadFromApi: loadExpeditionFromApi,
    saveToApi: saveExpeditionToApi,
    token: user?.token,
  })

  // Load stash from the API result (stored in _stash/_equipment by loadFromApi)
  useEffect(() => {
    if (exp._stash) { setStash(exp._stash); setEquipment(exp._equipment || []) }
  }, [exp._stash, exp._equipment])

  // Convenience updaters
  const update = (field, value) => setExp((prev) => ({ ...prev, [field]: value }))
  const foreman = exp.foreman
  const animals = exp.animals
  const wagons = exp.wagons
  const mercenaries = exp.mercenaries
  const disabledRaces = exp.disabledRaces
  const specialists = exp.specialists
  const setForeman = (v) => update('foreman', typeof v === 'function' ? v(foreman) : v)
  const setAnimals = (v) => update('animals', typeof v === 'function' ? v(animals) : v)
  const setWagons = (v) => update('wagons', typeof v === 'function' ? v(wagons) : v)
  const setMercenaries = (v) => update('mercenaries', typeof v === 'function' ? v(mercenaries) : v)
  const setDisabledRaces = (v) => update('disabledRaces', typeof v === 'function' ? v(disabledRaces) : v)
  const setSpecialists = (v) => update('specialists', typeof v === 'function' ? v(specialists) : v)
  const notes = exp.notes
  const setNotes = (v) => update('notes', typeof v === 'function' ? v(notes) : v)

  const tokenSrc = foreman.tokenId ? tokenSrcMap[foreman.tokenId] : null

  // Assign best available animal to a wagon
  const assignAnimal = (wagonId) => {
    const wagon = wagons.find((w) => w.id === wagonId)
    if (!wagon?.type) return
    const wagonData = WAGON_MAP[wagon.type]
    if (!wagonData) return
    const currentCount = animals.filter((a) => a.assignedWagonId === wagonId).length
    if (currentCount >= wagonData.maxAnimals) return

    const candidates = animals
      .filter((a) => a.type && a.id && !a.assignedWagonId && wagonData.allowedAnimals.includes(a.type))
      .sort((a, b) => (PACK_ANIMAL_MAP[b.type]?.draftCapacity || 0) - (PACK_ANIMAL_MAP[a.type]?.draftCapacity || 0))

    if (candidates.length === 0) return
    setAnimals((prev) => prev.map((a) => a.id === candidates[0].id ? { ...a, assignedWagonId: wagonId } : a))
  }

  const unassignAnimal = (wagonId) => {
    const assigned = animals.filter((a) => a.assignedWagonId === wagonId)
    if (assigned.length === 0) return
    const last = assigned[assigned.length - 1]
    setAnimals((prev) => prev.map((a) => a.id === last.id ? { ...a, assignedWagonId: null } : a))
  }

  return (
    <div className="expedition-page">
      <h2>The Expedition</h2>

      <div className="exp-tabs">
        <button className={`exp-tab${activeTab === 'overview' ? ' exp-tab-active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`exp-tab${activeTab === 'transport' ? ' exp-tab-active' : ''}`} onClick={() => setActiveTab('transport')}>Transport</button>
        <button className={`exp-tab${activeTab === 'mercenaries' ? ' exp-tab-active' : ''}`} onClick={() => setActiveTab('mercenaries')}>Mercenaries</button>
        <button className={`exp-tab${activeTab === 'specialists' ? ' exp-tab-active' : ''}`} onClick={() => setActiveTab('specialists')}>Specialists</button>
        <button className={`exp-tab${activeTab === 'notes' ? ' exp-tab-active' : ''}`} onClick={() => setActiveTab('notes')}>Notes</button>
      </div>

      {activeTab === 'overview' && <>
      {/* Foreman */}
      <div className="exp-section">
        <div className="exp-section-header">Expedition Foreman</div>
        <div className="exp-foreman">
          <div className="exp-foreman-token" onClick={() => setShowTokenPicker(true)} title="Click to select a token">
            {tokenSrc ? (
              <img src={tokenSrc} alt={foreman.name} className="exp-foreman-token-img" />
            ) : (
              <InitialsToken name={foreman.name || '?'} size={64} />
            )}
          </div>
          <div className="exp-foreman-details">
            <label className="exp-label">Name</label>
            <input
              className="exp-input"
              value={foreman.name}
              onChange={(e) => setForeman({ ...foreman, name: e.target.value })}
              placeholder="Foreman name..."
            />
          </div>
        </div>
      </div>

      {/* Expedition Stash */}
      <div className="exp-section">
        <div className="exp-section-header">Expedition Caravan</div>
        {stash && (() => {
          const coinWeight = COIN_TYPES.reduce((sum, c) => sum + (stash[c] || 0), 0)
          const equipWeight = equipment.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0) * (parseInt(item.weight, 10) || 0), 0)
          const totalWeight = coinWeight + equipWeight
          const unassignedCapacity = animals.filter((a) => a.type && !a.assignedWagonId).reduce((sum, a) => sum + (PACK_ANIMAL_MAP[a.type]?.packCapacity || 0), 0)
          const wagonCapacity = wagons.reduce((sum, w) => {
            if (!w.type || !w.id) return sum
            const wData = WAGON_MAP[w.type]
            if (!wData) return sum
            const teamDraft = animals.filter((a) => a.assignedWagonId === w.id).reduce((s, a) => s + (PACK_ANIMAL_MAP[a.type]?.draftCapacity || 0), 0)
            return sum + Math.min(teamDraft, wData.capacity)
          }, 0)
          const totalCapacity = unassignedCapacity + wagonCapacity
          const overloaded = totalWeight > totalCapacity && totalCapacity > 0
          return (
            <div className="exp-treasure">
              {COIN_TYPES.map((coin) => (
                <div key={coin} className="exp-coin">
                  <span className="exp-coin-label">{COIN_LABELS[coin]}</span>
                  <span className="exp-coin-value">{stash[coin] || 0}</span>
                </div>
              ))}
              <div className="exp-coin exp-coin-enc">
                <span className="exp-coin-label">Encumbrance</span>
                <span className={`exp-coin-value${overloaded ? ' exp-overloaded' : ''}`}>{totalWeight || 0}/{totalCapacity || '—'} cn</span>
              </div>
            </div>
          )
        })()}
        {equipment.length === 0 && <div className="exp-empty">No equipment in the caravan</div>}
        {equipment.length > 0 && (
          <table className="exp-equipment">
            <thead><tr><th>Item</th><th>Qty</th><th>Weight</th><th>Notes</th></tr></thead>
            <tbody>
              {equipment.map((item, i) => (
                <tr key={i}>
                  <td>{item.name || '—'}</td>
                  <td className="exp-eq-num">{item.qty || 0}</td>
                  <td className="exp-eq-num">{item.weight ? `${item.weight} cn` : '—'}</td>
                  <td className="exp-eq-notes">{item.notes || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!stash && <div className="exp-empty">Loading...</div>}
      </div>
      </>}

      {activeTab === 'transport' && <>
      {/* Pack Animals */}
      <div className="exp-section">
        <div className="exp-section-header">Pack Animals</div>
        <table className="exp-animals-table">
          <tbody>
            {PACK_ANIMAL_TYPES.map((t) => {
              const count = animals.filter((a) => a.type === t.type).length
              const assignedCount = animals.filter((a) => a.type === t.type && a.assignedWagonId).length
              return (
                <tr key={t.type}>
                  <td className="exp-animal-type">{t.type}</td>
                  <td className="exp-animal-stats">{t.packCapacity.toLocaleString()} / {t.draftCapacity.toLocaleString()} cn</td>
                  <td className="exp-animal-controls">
                    <button className="exp-team-btn" onClick={() => {
                      const idx = animals.findLastIndex((a) => a.type === t.type && !a.assignedWagonId)
                      if (idx >= 0) setAnimals((prev) => prev.filter((_, j) => j !== idx))
                    }} disabled={count === 0 || count === assignedCount}>-</button>
                    <span className="exp-animal-count">{count}</span>
                    <button className="exp-team-btn" onClick={() => setAnimals((prev) => [...prev, { id: null, type: t.type, name: '', notes: '', assignedWagonId: null }])}>+</button>
                  </td>
                  <td className="exp-animal-assigned-cell">
                    {assignedCount > 0 ? (
                      <span className="exp-animal-assigned">{assignedCount} assigned</span>
                    ) : (
                      <span className="exp-animal-assigned-spacer">&nbsp;</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Wagons */}
      <div className="exp-section">
        <div className="exp-section-header">
          Wagons
          <button className="exp-header-btn" onClick={() => setWagons((prev) => [...prev, { id: null, type: '', name: '', notes: '' }])}>+ Add</button>
        </div>
        {wagons.length === 0 && <div className="exp-empty">No wagons in the expedition</div>}
        {wagons.map((wagon, i) => {
          const wagonData = WAGON_MAP[wagon.type]
          const assigned = animals.filter((a) => a.assignedWagonId === wagon.id)
          const atMax = wagonData ? assigned.length >= wagonData.maxAnimals : true
          return (
            <div key={wagon.id || i} className="exp-wagon-card">
              <div className="exp-livestock-row">
                <select className="exp-input exp-livestock-type" value={wagon.type} onChange={(e) => {
                  const wId = wagon.id
                  if (wId) setAnimals((prev) => prev.map((a) => a.assignedWagonId === wId ? { ...a, assignedWagonId: null } : a))
                  setWagons((prev) => prev.map((w, j) => j === i ? { ...w, type: e.target.value } : w))
                }}>
                  <option value="">Type...</option>
                  {WAGON_TYPES.map((t) => <option key={t.type} value={t.type}>{t.type}</option>)}
                </select>
                <input className="exp-input exp-livestock-name" value={wagon.name} onChange={(e) => setWagons((prev) => prev.map((w, j) => j === i ? { ...w, name: e.target.value } : w))} placeholder="Name (optional)" />
                <input className="exp-input exp-livestock-notes" value={wagon.notes} onChange={(e) => setWagons((prev) => prev.map((w, j) => j === i ? { ...w, notes: e.target.value } : w))} placeholder="Notes" />
                <button className="exp-remove-btn" onClick={() => {
                  const wId = wagon.id
                  if (wId) setAnimals((prev) => prev.map((a) => a.assignedWagonId === wId ? { ...a, assignedWagonId: null } : a))
                  setWagons((prev) => prev.filter((_, j) => j !== i))
                }}>x</button>
              </div>
              {wagon.type && wagon.id && (() => {
                const teamDraft = assigned.reduce((s, a) => s + (PACK_ANIMAL_MAP[a.type]?.draftCapacity || 0), 0)
                const wCap = wagonData?.capacity || 0
                const overTeamed = teamDraft > wCap && assigned.length > 0
                return (
                  <div className="exp-wagon-team">
                    <div className="exp-wagon-team-header">
                      <span className="exp-wagon-team-label">Team ({assigned.length}/{wagonData?.maxAnimals || 0})</span>
                      {assigned.length > 0 && (
                        <span className={`exp-wagon-draft${overTeamed ? ' exp-wagon-overteamed' : ''}`}>
                          Draft: {teamDraft.toLocaleString()}/{wCap.toLocaleString()} cn{overTeamed && ' ⚠'}
                        </span>
                      )}
                    </div>
                    <div className="exp-wagon-team-row">
                      <div className="exp-wagon-team-list">
                        {assigned.map((a) => <span key={a.id} className="exp-wagon-animal">{a.name || a.type}</span>)}
                        {assigned.length === 0 && <span className="exp-wagon-no-team">No animals assigned</span>}
                      </div>
                      <div className="exp-wagon-team-btns">
                        <button className="exp-team-btn" onClick={() => assignAnimal(wagon.id)} disabled={atMax}>+</button>
                        <button className="exp-team-btn" onClick={() => unassignAnimal(wagon.id)} disabled={assigned.length === 0}>-</button>
                      </div>
                    </div>
                  </div>
                )
              })()}
              {wagon.type && !wagon.id && (
                <div className="exp-wagon-team"><span className="exp-wagon-no-team">Save pending — team assignment available after sync</span></div>
              )}
            </div>
          )
        })}
      </div>
      </>}

      {activeTab === 'mercenaries' && <>
      <div className="exp-section">
        <div className="exp-section-header">Mercenaries</div>
        <table className="exp-merc-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Equipment</th>
              {MERCENARY_RACES.map((r) => (
                <th key={r} className={`exp-merc-race${disabledRaces.includes(r) ? ' exp-merc-disabled-header' : ''}`}>
                  {isDM && (
                    <input type="checkbox" className="exp-merc-race-toggle"
                      checked={!disabledRaces.includes(r)}
                      onChange={(e) => e.target.checked ? setDisabledRaces((prev) => prev.filter((x) => x !== r)) : setDisabledRaces((prev) => [...prev, r])}
                      title={disabledRaces.includes(r) ? `Enable ${r} mercenaries` : `Disable ${r} mercenaries`} />
                  )}
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MERCENARY_TYPES.map((m) => (
              <tr key={m.type}>
                <td className="exp-merc-type">{m.type}</td>
                <td className="exp-merc-equip">{m.equipment}</td>
                {MERCENARY_RACES.map((race) => {
                  const cost = m.costs[race]
                  if (cost == null) return <td key={race} className="exp-merc-cell exp-merc-na">—</td>
                  const raceDisabled = disabledRaces.includes(race)
                  const key = `${m.type}|${race}`
                  const count = mercenaries[key] || 0
                  return (
                    <td key={race} className="exp-merc-cell" title={`${cost} gp/month`}>
                      <div className="exp-merc-hire">
                        <button className="exp-team-btn" disabled={count === 0} onClick={() => setMercenaries((prev) => {
                          const n = { ...prev }; if (n[key] > 1) n[key]--; else delete n[key]; return n
                        })}>-</button>
                        <span className="exp-merc-count">{count}</span>
                        <button className="exp-team-btn" disabled={raceDisabled} onClick={() => setMercenaries((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }))}>+</button>
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="exp-merc-total-label">Monthly Cost</td>
              {MERCENARY_RACES.map((race) => {
                const total = MERCENARY_TYPES.reduce((sum, m) => sum + (mercenaries[`${m.type}|${race}`] || 0) * (m.costs[race] || 0), 0)
                return <td key={race} className="exp-merc-cell exp-merc-total">{total > 0 ? `${total} gp` : ''}</td>
              })}
            </tr>
            <tr>
              <td colSpan={2} className="exp-merc-total-label">Grand Total</td>
              <td colSpan={MERCENARY_RACES.length} className="exp-merc-grand-total">
                {(() => {
                  const grand = MERCENARY_TYPES.reduce((sum, m) => sum + MERCENARY_RACES.reduce((s, race) => s + (mercenaries[`${m.type}|${race}`] || 0) * (m.costs[race] || 0), 0), 0)
                  return grand > 0 ? `${grand} gp/month` : '—'
                })()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      </>}

      {activeTab === 'specialists' && <>
      <div className="exp-section">
        <div className="exp-section-header">Specialists</div>
        <table className="exp-animals-table">
          <tbody>
            {SPECIALIST_TYPES.map((s) => {
              const count = specialists[s.type] || 0
              return (
                <tr key={s.type}>
                  <td className="exp-animal-type">{s.type}</td>
                  <td className="exp-animal-stats" title={s.description}>{s.description}</td>
                  <td className="exp-animal-controls">
                    <button className="exp-team-btn" disabled={count === 0} onClick={() => setSpecialists((prev) => {
                      const n = { ...prev }; if (n[s.type] > 1) n[s.type]--; else delete n[s.type]; return n
                    })}>-</button>
                    <span className="exp-animal-count">{count}</span>
                    <button className="exp-team-btn" onClick={() => setSpecialists((prev) => ({ ...prev, [s.type]: (prev[s.type] || 0) + 1 }))}>+</button>
                  </td>
                  <td className="exp-specialist-cost">{s.cost.toLocaleString()} gp</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2} className="exp-merc-total-label">Monthly Cost</td>
              <td></td>
              <td className="exp-specialist-total">
                {(() => {
                  const total = SPECIALIST_TYPES.reduce((sum, s) => sum + (specialists[s.type] || 0) * s.cost, 0)
                  return total > 0 ? `${total.toLocaleString()} gp` : '—'
                })()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      </>}

      {activeTab === 'notes' && <>
      <div className="exp-section">
        <div className="exp-section-header">Expedition Notes</div>
        <div className="exp-notes-wrap">
          <textarea
            className="exp-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Record any notes about the expedition here..."
          />
        </div>
      </div>
      </>}

      {showTokenPicker && (
        <TokenPicker
          onSelect={(t) => setForeman({ ...foreman, tokenId: t.id })}
          onClose={() => setShowTokenPicker(false)}
        />
      )}
    </div>
  )
}

export default Expedition

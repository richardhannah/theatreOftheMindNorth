import { useState, useCallback } from 'react'
import { useHoldTransfer } from './useHoldTransfer'

const COIN_TYPES = ['platinum', 'gold', 'electrum', 'silver', 'copper']
const COIN_LABELS = { platinum: 'PP', gold: 'GP', electrum: 'EP', silver: 'SP', copper: 'CP' }

function TabEquipment({ char, setChar }) {
  const [viewIndex, setViewIndex] = useState(0)
  const [targetIndex, setTargetIndex] = useState(1)
  const [showStashManager, setShowStashManager] = useState(false)

  const stashes = char.stashes
  const viewing = stashes[viewIndex]
  const target = stashes[targetIndex]

  // Stash helpers
  const updateStash = (stashIdx, field, value) => {
    setChar((prev) => ({
      ...prev,
      stashes: prev.stashes.map((s, i) =>
        i === stashIdx ? { ...s, [field]: value } : s
      ),
    }))
  }

  const addStash = () => {
    setChar((prev) => ({
      ...prev,
      stashes: [...prev.stashes, { name: '', removable: true, platinum: '', gold: '', electrum: '', silver: '', copper: '', equipment: [] }],
    }))
  }

  const removeStash = (idx) => {
    if (!stashes[idx].removable) return
    setChar((prev) => {
      const updated = prev.stashes.filter((_, i) => i !== idx)
      return { ...prev, stashes: updated }
    })
    if (viewIndex >= stashes.length - 1) setViewIndex(0)
    if (targetIndex >= stashes.length - 1) setTargetIndex(0)
    if (viewIndex === idx) setViewIndex(0)
    if (targetIndex === idx) setTargetIndex(0)
  }

  // Equipment
  const addItem = () => {
    setChar((prev) => ({
      ...prev,
      stashes: prev.stashes.map((s, i) =>
        i === viewIndex ? { ...s, equipment: [...s.equipment, { name: '', qty: '1', weight: '', notes: '' }] } : s
      ),
    }))
  }

  const updateItem = (itemIdx, field, value) => {
    setChar((prev) => ({
      ...prev,
      stashes: prev.stashes.map((s, i) =>
        i === viewIndex ? { ...s, equipment: s.equipment.map((item, j) => j === itemIdx ? { ...item, [field]: value } : item) } : s
      ),
    }))
  }

  const removeItem = (itemIdx) => {
    setChar((prev) => ({
      ...prev,
      stashes: prev.stashes.map((s, i) =>
        i === viewIndex ? { ...s, equipment: s.equipment.filter((_, j) => j !== itemIdx) } : s
      ),
    }))
  }

  const transferItemQty = useCallback((itemIdx, amount) => {
    setChar((prev) => {
      const src = prev.stashes[viewIndex]
      const item = src.equipment[itemIdx]
      if (!item) return prev
      const available = parseInt(item.qty, 10) || 0
      const transfer = Math.min(amount, available)
      if (transfer <= 0) return prev

      const remaining = available - transfer

      return {
        ...prev,
        stashes: prev.stashes.map((s, i) => {
          if (i === viewIndex) {
            const updatedEquip = remaining > 0
              ? s.equipment.map((it, j) => j === itemIdx ? { ...it, qty: String(remaining) } : it)
              : s.equipment.filter((_, j) => j !== itemIdx)
            return { ...s, equipment: updatedEquip }
          }
          if (i === targetIndex) {
            // If the same item already exists in target, add to its qty
            const existingIdx = s.equipment.findIndex((it) => it.name === item.name && it.weight === item.weight && it.notes === item.notes)
            if (existingIdx >= 0) {
              return {
                ...s,
                equipment: s.equipment.map((it, j) =>
                  j === existingIdx ? { ...it, qty: String((parseInt(it.qty, 10) || 0) + transfer) } : it
                ),
              }
            }
            return { ...s, equipment: [...s.equipment, { ...item, qty: String(transfer) }] }
          }
          return s
        }),
      }
    })
  }, [viewIndex, targetIndex, setChar])

  const itemSendHold = useHoldTransfer(transferItemQty)

  const transferItemBack = useCallback((itemIdx, amount) => {
    setChar((prev) => {
      const src = prev.stashes[targetIndex]
      const item = src.equipment[itemIdx]
      if (!item) return prev
      const available = parseInt(item.qty, 10) || 0
      const transfer = Math.min(amount, available)
      if (transfer <= 0) return prev

      const remaining = available - transfer

      return {
        ...prev,
        stashes: prev.stashes.map((s, i) => {
          if (i === targetIndex) {
            const updatedEquip = remaining > 0
              ? s.equipment.map((it, j) => j === itemIdx ? { ...it, qty: String(remaining) } : it)
              : s.equipment.filter((_, j) => j !== itemIdx)
            return { ...s, equipment: updatedEquip }
          }
          if (i === viewIndex) {
            const existingIdx = s.equipment.findIndex((it) => it.name === item.name && it.weight === item.weight && it.notes === item.notes)
            if (existingIdx >= 0) {
              return {
                ...s,
                equipment: s.equipment.map((it, j) =>
                  j === existingIdx ? { ...it, qty: String((parseInt(it.qty, 10) || 0) + transfer) } : it
                ),
              }
            }
            return { ...s, equipment: [...s.equipment, { ...item, qty: String(transfer) }] }
          }
          return s
        }),
      }
    })
  }, [viewIndex, targetIndex, setChar])

  const itemRecvHold = useHoldTransfer(transferItemBack)

  // Treasure transfer
  const transferCoinTo = useCallback((coin, amount) => {
    setChar((prev) => {
      const src = prev.stashes[viewIndex]
      const carried = parseInt(src[coin], 10) || 0
      const transfer = Math.min(amount, carried)
      if (transfer <= 0) return prev
      return {
        ...prev,
        stashes: prev.stashes.map((s, i) => {
          if (i === viewIndex) return { ...s, [coin]: String(carried - transfer) }
          if (i === targetIndex) return { ...s, [coin]: String((parseInt(s[coin], 10) || 0) + transfer) }
          return s
        }),
      }
    })
  }, [viewIndex, targetIndex, setChar])

  const transferCoinFrom = useCallback((coin, amount) => {
    setChar((prev) => {
      const src = prev.stashes[targetIndex]
      const stored = parseInt(src[coin], 10) || 0
      const transfer = Math.min(amount, stored)
      if (transfer <= 0) return prev
      return {
        ...prev,
        stashes: prev.stashes.map((s, i) => {
          if (i === targetIndex) return { ...s, [coin]: String(stored - transfer) }
          if (i === viewIndex) return { ...s, [coin]: String((parseInt(s[coin], 10) || 0) + transfer) }
          return s
        }),
      }
    })
  }, [viewIndex, targetIndex, setChar])

  const sendHold = useHoldTransfer(transferCoinTo)
  const recvHold = useHoldTransfer(transferCoinFrom)

  // Encumbrance (only meaningful for Carried = index 0)
  const carriedStash = stashes[0]
  const coinWeight = COIN_TYPES.reduce((sum, c) => sum + (parseInt(carriedStash[c], 10) || 0), 0)
  const equipWeight = carriedStash.equipment.reduce((sum, item) => {
    const qty = parseInt(item.qty, 10) || 0
    const wt = parseInt(item.weight, 10) || 0
    return sum + qty * wt
  }, 0)
  const totalWeight = coinWeight + equipWeight

  return (
    <>
      {/* Stash selector row */}
      <div className="cs-section">
        <div className="cs-section-header">
          <div className="cs-stash-selectors">
            <label className="cs-stash-selector-label">Viewing</label>
            <select
              className="cs-stash-dropdown"
              value={viewIndex}
              onChange={(e) => setViewIndex(parseInt(e.target.value, 10))}
            >
              {stashes.map((s, i) => (
                <option key={i} value={i}>{s.name || `Stash ${i + 1}`}</option>
              ))}
            </select>
            <span className="cs-stash-arrow">&#x21C4;</span>
            <label className="cs-stash-selector-label">Transfer</label>
            <select
              className="cs-stash-dropdown"
              value={targetIndex}
              onChange={(e) => setTargetIndex(parseInt(e.target.value, 10))}
            >
              {stashes.map((s, i) => (
                <option key={i} value={i}>{s.name || `Stash ${i + 1}`}</option>
              ))}
            </select>
          </div>
          <button className="cs-header-btn" onClick={() => setShowStashManager(true)}>Stashes</button>
        </div>
      </div>

      {/* Treasure */}
      <div className="cs-section">
        <div className="cs-section-header">Treasure</div>
        <div className="cs-treasure-layout">
          {/* Viewing stash column */}
          <div className="cs-treasure-col">
            <div className="cs-treasure-col-header">{viewing.name || `Stash ${viewIndex + 1}`}</div>
            {COIN_TYPES.map((coin) => (
              <div key={coin} className="cs-treasure-row">
                <span className="cs-treasure-coin-label">{COIN_LABELS[coin]}</span>
                <input
                  className="cs-treasure-input"
                  type="number"
                  min="0"
                  value={viewing[coin]}
                  onChange={(e) => updateStash(viewIndex, coin, e.target.value)}
                />
              </div>
            ))}
            {viewIndex === 0 && (
              <div className="cs-treasure-row cs-treasure-enc-row">
                <span className="cs-treasure-coin-label">ENC</span>
                <span className="cs-treasure-enc">{totalWeight || '—'}</span>
              </div>
            )}
          </div>

          {/* Transfer arrows */}
          {viewIndex !== targetIndex && (
            <div className="cs-treasure-col cs-treasure-transfer-col">
              <div className="cs-treasure-col-header">&nbsp;</div>
              {COIN_TYPES.map((coin) => (
                <div key={coin} className="cs-treasure-row cs-treasure-arrow-row">
                  <button
                    className="cs-arrow-btn"
                    onMouseDown={() => sendHold.start(coin)}
                    onMouseUp={sendHold.stop}
                    onMouseLeave={sendHold.stop}
                    title="Send"
                  >&#x2192;</button>
                  <button
                    className="cs-arrow-btn cs-arrow-retrieve"
                    onMouseDown={() => recvHold.start(coin)}
                    onMouseUp={recvHold.stop}
                    onMouseLeave={recvHold.stop}
                    title="Receive"
                  >&#x2190;</button>
                </div>
              ))}
            </div>
          )}

          {/* Target stash column */}
          {viewIndex !== targetIndex && (
            <div className="cs-treasure-col">
              <div className="cs-treasure-col-header">{target.name || `Stash ${targetIndex + 1}`}</div>
              {COIN_TYPES.map((coin) => (
                <div key={coin} className="cs-treasure-row">
                  <span className="cs-treasure-coin-label">{COIN_LABELS[coin]}</span>
                  <input
                    className="cs-treasure-input"
                    type="number"
                    min="0"
                    value={target[coin]}
                    onChange={(e) => updateStash(targetIndex, coin, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Equipment */}
      <div className="cs-section">
        <div className="cs-section-header">
          Equipment
          <button className="cs-header-btn" onClick={addItem}>+ Add</button>
        </div>
        <div className="cs-equip-columns">
          {/* Viewing stash items */}
          <div className="cs-equip-col">
            <div className="cs-equip-col-header">{viewing.name || `Stash ${viewIndex + 1}`}</div>
            {viewing.equipment.length === 0 && (
              <div className="cs-empty">Empty</div>
            )}
            {viewing.equipment.map((item, i) => (
              <div key={i} className="cs-equip-item">
                <div className="cs-equip-item-info">
                  <input
                    className="cs-input cs-equip-name"
                    value={item.name}
                    onChange={(e) => updateItem(i, 'name', e.target.value)}
                    placeholder="Item name"
                  />
                  <input
                    className="cs-input cs-equip-qty"
                    type="number"
                    min="0"
                    value={item.qty}
                    onChange={(e) => updateItem(i, 'qty', e.target.value)}
                    title="Qty"
                  />
                  <input
                    className="cs-input cs-equip-wt"
                    type="number"
                    min="0"
                    value={item.weight}
                    onChange={(e) => updateItem(i, 'weight', e.target.value)}
                    title="Weight (cn)"
                    placeholder="cn"
                  />
                </div>
                <div className="cs-equip-item-actions">
                  {viewIndex !== targetIndex && (
                    <button
                      className="cs-arrow-btn"
                      onMouseDown={() => itemSendHold.start(i)}
                      onMouseUp={itemSendHold.stop}
                      onMouseLeave={itemSendHold.stop}
                      title={`Send to ${target.name || `Stash ${targetIndex + 1}`}`}
                    >&#x2192;</button>
                  )}
                  <button className="cs-remove-btn-inline" onClick={() => removeItem(i)}>x</button>
                </div>
              </div>
            ))}
          </div>

          {/* Target stash items */}
          {viewIndex !== targetIndex && (
            <div className="cs-equip-col">
              <div className="cs-equip-col-header">{target.name || `Stash ${targetIndex + 1}`}</div>
              {target.equipment.length === 0 && (
                <div className="cs-empty">Empty</div>
              )}
              {target.equipment.map((item, i) => (
                <div key={i} className="cs-equip-item">
                  <div className="cs-equip-item-info">
                    <span className="cs-equip-item-name">{item.name || '(unnamed)'}</span>
                    <span className="cs-equip-item-qty">x{item.qty || 0}</span>
                  </div>
                  <div className="cs-equip-item-actions">
                    <button
                      className="cs-arrow-btn cs-arrow-retrieve"
                      onMouseDown={() => itemRecvHold.start(i)}
                      onMouseUp={itemRecvHold.stop}
                      onMouseLeave={itemRecvHold.stop}
                      title={`Bring to ${viewing.name || `Stash ${viewIndex + 1}`}`}
                    >&#x2190;</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stash Manager Modal */}
      {showStashManager && (
        <div className="admin-modal-overlay" onClick={() => setShowStashManager(false)}>
          <div className="cs-stash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cs-stash-modal-header">
              <h3>Manage Stashes</h3>
              <button className="cs-remove-btn-inline" onClick={() => setShowStashManager(false)}>x</button>
            </div>
            <div className="cs-stash-list">
              {stashes.map((stash, i) => (
                <div key={i} className="cs-stash-item">
                  <input
                    className="cs-input cs-stash-name-input"
                    value={stash.name}
                    onChange={(e) => updateStash(i, 'name', e.target.value)}
                    disabled={!stash.removable}
                  />
                  <span className="cs-stash-summary">
                    {COIN_TYPES.reduce((sum, c) => sum + (parseInt(stash[c], 10) || 0), 0)} coins, {stash.equipment.length} items
                  </span>
                  {stash.removable && (
                    <button
                      className="cs-remove-btn-inline"
                      onClick={() => {
                        if (confirm(`Delete "${stash.name || `Stash ${i + 1}`}"? Contents will be lost.`)) {
                          removeStash(i)
                        }
                      }}
                    >x</button>
                  )}
                </div>
              ))}
            </div>
            <button className="cs-stash-add-btn" onClick={addStash}>+ Add Stash</button>
          </div>
        </div>
      )}
    </>
  )
}

export default TabEquipment

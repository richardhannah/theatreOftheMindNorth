import { useState } from 'react'

function TabSpells({ char, set, setChar }) {
  const [spellbookOpen, setSpellbookOpen] = useState(true)
  const addSpell = () => {
    setChar((prev) => ({
      ...prev,
      spellbook: [...prev.spellbook, { name: '', level: '1', notes: '' }],
    }))
  }

  const updateSpell = (index, field, value) => {
    setChar((prev) => ({
      ...prev,
      spellbook: prev.spellbook.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }))
  }

  const removeSpell = (index) => {
    setChar((prev) => ({
      ...prev,
      spellbook: prev.spellbook.filter((_, i) => i !== index),
    }))
  }

  const prepareSpell = (index) => {
    const spell = char.spellbook[index]
    setChar((prev) => ({
      ...prev,
      preparedSpells: [...prev.preparedSpells, { name: spell.name, level: spell.level, cast: false }]
        .slice().sort((a, b) => parseInt(a.level, 10) - parseInt(b.level, 10)),
    }))
  }

  const castSpell = (index) => {
    setChar((prev) => ({
      ...prev,
      preparedSpells: prev.preparedSpells.map((s, i) =>
        i === index ? { ...s, cast: true } : s
      ),
    }))
  }

  const reprepareSpell = (index) => {
    setChar((prev) => ({
      ...prev,
      preparedSpells: prev.preparedSpells.map((s, i) =>
        i === index ? { ...s, cast: false } : s
      ),
    }))
  }

  const removePrepared = (index) => {
    setChar((prev) => ({
      ...prev,
      preparedSpells: prev.preparedSpells.filter((_, i) => i !== index),
    }))
  }

  const clearCast = () => {
    setChar((prev) => ({
      ...prev,
      preparedSpells: prev.preparedSpells.filter((s) => !s.cast),
    }))
  }

  const isCaster = ['Cleric', 'Magic-User', 'Elf', 'Druid'].includes(char.class)

  if (!isCaster && char.spellbook.length === 0) {
    return (
      <div className="cs-section">
        <div className="cs-section-header">Spells</div>
        <div className="cs-empty">
          {char.class ? `${char.class}s do not cast spells` : 'Select a class to see spell options'}
        </div>
      </div>
    )
  }

  return (
    <div className="cs-spells-columns">
      {/* Prepared Spells */}
      <div className="cs-section cs-spells-col">
        <div className="cs-section-header">
          Prepared Spells
          {char.preparedSpells.some((s) => s.cast) && (
            <button className="cs-header-btn" onClick={clearCast}>Clear Cast</button>
          )}
        </div>
        {char.preparedSpells.length === 0 && (
          <div className="cs-empty">No spells prepared</div>
        )}
        {char.preparedSpells.map((s, i) => (
          <div key={i} className={`cs-prepared-row${s.cast ? ' cs-prepared-cast' : ''}`}>
            <span className="cs-prepared-level">Lvl {s.level}</span>
            <span className="cs-prepared-name">{s.name}</span>
            {s.cast ? (
              <button className="cs-reprepare-btn" onClick={() => reprepareSpell(i)}>Re-prepare</button>
            ) : (
              <button className="cs-cast-btn" onClick={() => castSpell(i)}>Cast</button>
            )}
            <button className="cs-remove-btn-inline" onClick={() => removePrepared(i)}>x</button>
          </div>
        ))}
      </div>

      {/* Spellbook */}
      <div className={`cs-section cs-spells-col${spellbookOpen ? '' : ' cs-spells-col-collapsed'}`}>
        <div className="cs-section-header">
          <button className="cs-collapse-btn" onClick={() => setSpellbookOpen(!spellbookOpen)}>
            {spellbookOpen ? '\u25C0' : '\u25B6'}
          </button>
          {spellbookOpen && 'Spellbook'}
          {spellbookOpen && <button className="cs-header-btn" onClick={addSpell}>+ Add</button>}
        </div>
        {spellbookOpen && char.spellbook.length === 0 && (
          <div className="cs-empty">No spells recorded</div>
        )}
        {spellbookOpen && char.spellbook.map((s, i) => (
          <div key={i} className="cs-spellbook-row">
            <span className="cs-prepared-level">Lvl {s.level}</span>
            <input
              className="cs-input cs-spellbook-name"
              value={s.name}
              onChange={(e) => updateSpell(i, 'name', e.target.value)}
              placeholder="Spell name"
            />
            <input
              className="cs-input cs-spellbook-lvl"
              type="number"
              min="1"
              max="9"
              value={s.level}
              onChange={(e) => updateSpell(i, 'level', e.target.value)}
              title="Level"
            />
            <button className="cs-prepare-btn" onClick={() => prepareSpell(i)}>Prepare</button>
            <button className="cs-remove-btn-inline" onClick={() => removeSpell(i)}>x</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TabSpells

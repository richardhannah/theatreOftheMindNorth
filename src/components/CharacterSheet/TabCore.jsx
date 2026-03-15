const CLASSES = [
  'Fighter', 'Cleric', 'Magic-User', 'Thief',
  'Elf', 'Dwarf', 'Halfling', 'Mystic',
]

const ALIGNMENTS = ['Lawful', 'Neutral', 'Chaotic']

const ABILITY_KEYS = [
  { key: 'str', label: 'STR' },
  { key: 'int', label: 'INT' },
  { key: 'wis', label: 'WIS' },
  { key: 'dex', label: 'DEX' },
  { key: 'con', label: 'CON' },
  { key: 'cha', label: 'CHA' },
]

const SAVES = [
  { key: 'deathPoison', label: 'Death / Poison' },
  { key: 'wands', label: 'Wands' },
  { key: 'paralysisStone', label: 'Paralysis / Stone' },
  { key: 'breathAttack', label: 'Breath Attack' },
  { key: 'spellsStaffRod', label: 'Spells / Staff / Rod' },
]

function abilityMod(score) {
  const n = parseInt(score, 10)
  if (isNaN(n)) return ''
  if (n >= 18) return '+3'
  if (n >= 16) return '+2'
  if (n >= 13) return '+1'
  if (n >= 9) return '0'
  if (n >= 6) return '-1'
  if (n >= 4) return '-2'
  return '-3'
}

function TabCore({ char, set, setChar }) {
  const setAbility = (key, value) => {
    setChar((prev) => ({
      ...prev,
      abilities: { ...prev.abilities, [key]: value },
    }))
  }

  const setSave = (key, value) => {
    setChar((prev) => ({
      ...prev,
      saves: { ...prev.saves, [key]: value },
    }))
  }

  return (
    <>
      {/* Identity */}
      <div className="cs-section">
        <div className="cs-section-header">Identity</div>
        <div className="cs-row">
          <div className="cs-field cs-field-wide">
            <label className="cs-label">Character Name</label>
            <input
              className="cs-input"
              value={char.name}
              onChange={(e) => set('name', e.target.value)}
            />
          </div>
          <div className="cs-field">
            <label className="cs-label">Player Name</label>
            <input
              className="cs-input"
              value={char.playerName}
              onChange={(e) => set('playerName', e.target.value)}
            />
          </div>
        </div>
        <div className="cs-row">
          <div className="cs-field">
            <label className="cs-label">Class</label>
            <select
              className="cs-select"
              value={char.class}
              onChange={(e) => set('class', e.target.value)}
            >
              <option value="">—</option>
              {CLASSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="cs-field cs-field-narrow">
            <label className="cs-label">Level</label>
            <input
              className="cs-input"
              type="number"
              min="1"
              value={char.level}
              onChange={(e) => set('level', e.target.value)}
            />
          </div>
          <div className="cs-field">
            <label className="cs-label">XP</label>
            <input
              className="cs-input"
              type="number"
              min="0"
              value={char.xp}
              onChange={(e) => set('xp', e.target.value)}
            />
          </div>
          <div className="cs-field">
            <label className="cs-label">Alignment</label>
            <select
              className="cs-select"
              value={char.alignment}
              onChange={(e) => set('alignment', e.target.value)}
            >
              <option value="">—</option>
              {ALIGNMENTS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div className="cs-field">
            <label className="cs-label">Title</label>
            <input
              className="cs-input"
              value={char.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Warrior, Swordmaster..."
            />
          </div>
        </div>
      </div>

      {/* Ability Scores */}
      <div className="cs-section">
        <div className="cs-section-header">Ability Scores</div>
        <div className="cs-abilities">
          {ABILITY_KEYS.map((ab) => (
            <div key={ab.key} className="cs-ability">
              <span className="cs-ability-label">{ab.label}</span>
              <input
                className="cs-ability-input"
                type="number"
                min="3"
                max="18"
                value={char.abilities[ab.key]}
                onChange={(e) => setAbility(ab.key, e.target.value)}
              />
              <span className="cs-ability-mod">{abilityMod(char.abilities[ab.key])}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Combat Stats */}
      <div className="cs-section">
        <div className="cs-section-header">Combat</div>
        <div className="cs-combat">
          <div className="cs-combat-stat">
            <span className="cs-combat-label">HP</span>
            <input
              className="cs-combat-value"
              type="number"
              value={char.hp}
              onChange={(e) => set('hp', e.target.value)}
            />
          </div>
          <div className="cs-combat-stat">
            <span className="cs-combat-label">Max HP</span>
            <input
              className="cs-combat-value"
              type="number"
              value={char.maxHp}
              onChange={(e) => set('maxHp', e.target.value)}
            />
          </div>
          <div className="cs-combat-stat">
            <span className="cs-combat-label">AC</span>
            <input
              className="cs-combat-value"
              type="number"
              value={char.ac}
              onChange={(e) => set('ac', e.target.value)}
            />
          </div>
          <div className="cs-combat-stat">
            <span className="cs-combat-label">THAC0</span>
            <input
              className="cs-combat-value"
              type="number"
              value={char.thac0}
              onChange={(e) => set('thac0', e.target.value)}
            />
          </div>
          <div className="cs-combat-stat">
            <span className="cs-combat-label">Movement</span>
            <input
              className="cs-combat-value"
              value={char.movement}
              onChange={(e) => set('movement', e.target.value)}
              placeholder="120'"
            />
          </div>
          <div className="cs-combat-stat">
            <span className="cs-combat-label">Initiative</span>
            <input
              className="cs-combat-value"
              value={char.initiative}
              onChange={(e) => set('initiative', e.target.value)}
              placeholder="+0"
            />
          </div>
        </div>
      </div>

      {/* Saving Throws */}
      <div className="cs-section">
        <div className="cs-section-header">Saving Throws</div>
        <div className="cs-saves">
          {SAVES.map((s) => (
            <div key={s.key} className="cs-save">
              <span className="cs-save-label">{s.label}</span>
              <input
                className="cs-save-input"
                type="number"
                value={char.saves[s.key]}
                onChange={(e) => setSave(s.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default TabCore

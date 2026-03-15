const MASTERY_LEVELS = ['Basic', 'Skilled', 'Expert', 'Master', 'Grand Master']

function TabAbilities({ char, setChar }) {
  const addClassAbility = () => {
    setChar((prev) => ({
      ...prev,
      classAbilities: [...prev.classAbilities, { name: '', description: '' }],
    }))
  }

  const updateClassAbility = (index, field, value) => {
    setChar((prev) => ({
      ...prev,
      classAbilities: prev.classAbilities.map((a, i) =>
        i === index ? { ...a, [field]: value } : a
      ),
    }))
  }

  const removeClassAbility = (index) => {
    setChar((prev) => ({
      ...prev,
      classAbilities: prev.classAbilities.filter((_, i) => i !== index),
    }))
  }

  const addSkill = () => {
    setChar((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: '', ability: '', bonus: '' }],
    }))
  }

  const updateSkill = (index, field, value) => {
    setChar((prev) => ({
      ...prev,
      skills: prev.skills.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }))
  }

  const removeSkill = (index) => {
    setChar((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const addMastery = () => {
    setChar((prev) => ({
      ...prev,
      weaponMasteries: [...prev.weaponMasteries, { weapon: '', level: 'Basic' }],
    }))
  }

  const updateMastery = (index, field, value) => {
    setChar((prev) => ({
      ...prev,
      weaponMasteries: prev.weaponMasteries.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      ),
    }))
  }

  const removeMastery = (index) => {
    setChar((prev) => ({
      ...prev,
      weaponMasteries: prev.weaponMasteries.filter((_, i) => i !== index),
    }))
  }

  return (
    <>
      {/* Class Abilities */}
      <div className="cs-section">
        <div className="cs-section-header">
          Class Abilities
          <button className="cs-header-btn" onClick={addClassAbility}>+ Add</button>
        </div>
        {char.classAbilities.length === 0 && (
          <div className="cs-empty">No class abilities recorded</div>
        )}
        {char.classAbilities.map((a, i) => (
          <div key={i} className="cs-row cs-row-removable">
            <div className="cs-field" style={{ flex: '0 0 180px' }}>
              <label className="cs-label">Name</label>
              <input
                className="cs-input"
                value={a.name}
                onChange={(e) => updateClassAbility(i, 'name', e.target.value)}
                placeholder="e.g. Turn Undead"
              />
            </div>
            <div className="cs-field cs-field-wide">
              <label className="cs-label">Description</label>
              <input
                className="cs-input"
                value={a.description}
                onChange={(e) => updateClassAbility(i, 'description', e.target.value)}
              />
            </div>
            <button className="cs-remove-btn" onClick={() => removeClassAbility(i)}>x</button>
          </div>
        ))}
      </div>

      {/* Secondary Skills */}
      <div className="cs-section">
        <div className="cs-section-header">
          Skills
          <button className="cs-header-btn" onClick={addSkill}>+ Add</button>
        </div>
        {char.skills.length === 0 && (
          <div className="cs-empty">No skills recorded</div>
        )}
        {char.skills.map((s, i) => (
          <div key={i} className="cs-row cs-row-removable">
            <div className="cs-field" style={{ flex: '0 0 180px' }}>
              <label className="cs-label">Skill</label>
              <input
                className="cs-input"
                value={s.name}
                onChange={(e) => updateSkill(i, 'name', e.target.value)}
                placeholder="e.g. Healing"
              />
            </div>
            <div className="cs-field cs-field-narrow">
              <label className="cs-label">Ability</label>
              <input
                className="cs-input"
                value={s.ability}
                onChange={(e) => updateSkill(i, 'ability', e.target.value)}
                placeholder="INT"
              />
            </div>
            <div className="cs-field cs-field-narrow">
              <label className="cs-label">Bonus</label>
              <input
                className="cs-input"
                value={s.bonus}
                onChange={(e) => updateSkill(i, 'bonus', e.target.value)}
                placeholder="+0"
              />
            </div>
            <button className="cs-remove-btn" onClick={() => removeSkill(i)}>x</button>
          </div>
        ))}
      </div>

      {/* Weapon Masteries */}
      <div className="cs-section">
        <div className="cs-section-header">
          Weapon Masteries
          <button className="cs-header-btn" onClick={addMastery}>+ Add</button>
        </div>
        {char.weaponMasteries.length === 0 && (
          <div className="cs-empty">No weapon masteries recorded</div>
        )}
        {char.weaponMasteries.map((m, i) => (
          <div key={i} className="cs-row cs-row-removable">
            <div className="cs-field cs-field-wide">
              <label className="cs-label">Weapon</label>
              <input
                className="cs-input"
                value={m.weapon}
                onChange={(e) => updateMastery(i, 'weapon', e.target.value)}
                placeholder="e.g. Normal Sword"
              />
            </div>
            <div className="cs-field" style={{ flex: '0 0 150px' }}>
              <label className="cs-label">Mastery Level</label>
              <select
                className="cs-select"
                value={m.level}
                onChange={(e) => updateMastery(i, 'level', e.target.value)}
              >
                {MASTERY_LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <button className="cs-remove-btn" onClick={() => removeMastery(i)}>x</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default TabAbilities

import { useState } from 'react'
import {
  WEAPONMASTERY_DATA,
  MISSILE_WEAPONS,
  HANDHELD_EASILYTHROWN,
  HANDHELD_ONLY,
  HANDHELD_RARELYTHROWN,
} from './weaponMasteryData'
import './WeaponMastery.css'

const ALL_CATEGORIES = [
  MISSILE_WEAPONS,
  HANDHELD_EASILYTHROWN,
  HANDHELD_ONLY,
  HANDHELD_RARELYTHROWN,
]

function WeaponMastery() {
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([...ALL_CATEGORIES])

  const toggleCategory = (cat) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const filtered = WEAPONMASTERY_DATA.filter((w) => {
    const textMatch = w.weaponName.toLowerCase().includes(search.toLowerCase())
    const catMatch = categories.includes(w.category)
    return textMatch && catMatch
  })

  return (
    <div className="weapon-mastery">
      <h1>Weapon Mastery</h1>

      <div className="wm-filters">
        <div className="wm-checkboxes">
          {ALL_CATEGORIES.map((cat) => (
            <label key={cat} className="wm-checkbox">
              <input
                type="checkbox"
                checked={categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
        <input
          type="text"
          className="wm-search"
          placeholder="Search by weapon name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="wm-table-wrapper">
        <table className="wm-table">
          <thead>
            <tr>
              <th>Weapon</th>
              <th>Level</th>
              <th>Ranges</th>
              <th>Damage</th>
              <th>Defense</th>
              <th>Special Effects</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((weapon) => (
              <tr key={weapon.weaponName}>
                <td className="wm-weapon-cell">
                  <div className="wm-weapon-name">{weapon.weaponName}</div>
                  <div>Primary Target Type: {weapon.primary}</div>
                  <div>Attributes: {weapon.attributes.join(', ')}</div>
                  <div>Cost: {weapon.cost}</div>
                  <div>Encumbrance: {weapon.enc}</div>
                </td>
                <td>
                  {weapon.masteries.map((m) => (
                    <div key={m.level}>{m.level}</div>
                  ))}
                </td>
                <td>
                  {weapon.masteries.map((m) => (
                    <div key={m.level}>
                      {m.ranges.short}/{m.ranges.medium}/{m.ranges.long}
                    </div>
                  ))}
                </td>
                <td>
                  {weapon.masteries.map((m) => (
                    <div key={m.level}>
                      P: {m.damage.primary}
                      {m.damage.secondary !== 'Nil' && <> S: {m.damage.secondary}</>}
                    </div>
                  ))}
                </td>
                <td>
                  {weapon.masteries.map((m) => (
                    <div key={m.level}>{m.defense}</div>
                  ))}
                </td>
                <td>
                  {weapon.masteries.map((m) => (
                    <div key={m.level}>{m.special}</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default WeaponMastery

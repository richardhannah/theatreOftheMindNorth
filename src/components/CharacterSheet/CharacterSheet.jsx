import { useState } from 'react'
import { usePersistence } from '../../hooks/usePersistence'
import { API_URL } from '../../config'
import TabCore from './TabCore'
import TabAbilities from './TabAbilities'
import TabSpells from './TabSpells'
import TabEquipment from './TabEquipment'
import TabNotes from './TabNotes'
import './CharacterSheet.css'

const TABS = [
  { key: 'core', label: 'Character' },
  { key: 'abilities', label: 'Abilities & Skills' },
  { key: 'spells', label: 'Spells' },
  { key: 'equipment', label: 'Equipment' },
  { key: 'notes', label: 'Notes' },
]

const EMPTY_CHAR = {
  // Identity
  name: '',
  playerName: '',
  tokenId: '',
  class: '',
  level: '',
  xp: '',
  alignment: '',
  title: '',
  // Ability scores
  abilities: { str: '', int: '', wis: '', dex: '', con: '', cha: '' },
  // Combat
  hp: '',
  maxHp: '',
  ac: '',
  thac0: '',
  movement: '',
  initiative: '',
  // Saves
  saves: { deathPoison: '', wands: '', paralysisStone: '', breathAttack: '', spellsStaffRod: '' },
  // Abilities & Skills
  classAbilities: [],
  skills: [],
  weaponMasteries: [],
  // Spells
  preparedSpells: [],
  spellbook: [],
  // Stashes (index 0 = Carried, index 1 = Expedition Caravan, rest are user-created)
  stashes: [
    { name: 'Carried', removable: false, platinum: '', gold: '', electrum: '', silver: '', copper: '', equipment: [] },
    { name: 'Expedition Caravan', removable: false, platinum: '', gold: '', electrum: '', silver: '', copper: '', equipment: [] },
  ],
  // Notes
  notes: '',
}

function mapApiData(data) {
  if (!data) return EMPTY_CHAR
  const c = data.character || {}
  const stashes = (data.stashes || []).map((s) => ({
    stashId: s.stashId,
    name: s.name,
    removable: s.removable,
    shared: s.shared,
    sortOrder: s.sortOrder,
    platinum: s.platinum || '',
    gold: s.gold || '',
    electrum: s.electrum || '',
    silver: s.silver || '',
    copper: s.copper || '',
    equipment: typeof s.equipment === 'string' ? JSON.parse(s.equipment) : (s.equipment || []),
  }))
  return {
    name: c.name || '',
    playerName: c.playerName || '',
    tokenId: c.tokenId || '',
    class: c.class || '',
    level: c.level || '',
    xp: c.xp || '',
    alignment: c.alignment || '',
    title: c.title || '',
    abilities: {
      str: c.str || '',
      int: c.int || '',
      wis: c.wis || '',
      dex: c.dex || '',
      con: c.con || '',
      cha: c.cha || '',
    },
    hp: c.hp || '',
    maxHp: c.maxHp || '',
    ac: c.ac || '',
    thac0: c.thac0 || '',
    movement: c.movement || '',
    initiative: c.initiative || '',
    saves: {
      deathPoison: c.savDeathPoison || '',
      wands: c.savWands || '',
      paralysisStone: c.savParalysisStone || '',
      breathAttack: c.savBreathAttack || '',
      spellsStaffRod: c.savSpellsStaffRod || '',
    },
    classAbilities: typeof c.classAbilities === 'string' ? JSON.parse(c.classAbilities) : (c.classAbilities || []),
    skills: typeof c.skills === 'string' ? JSON.parse(c.skills) : (c.skills || []),
    weaponMasteries: typeof c.weaponMasteries === 'string' ? JSON.parse(c.weaponMasteries) : (c.weaponMasteries || []),
    preparedSpells: typeof c.preparedSpells === 'string' ? JSON.parse(c.preparedSpells) : (c.preparedSpells || []),
    spellbook: typeof c.spellbook === 'string' ? JSON.parse(c.spellbook) : (c.spellbook || []),
    stashes: stashes.length > 0 ? stashes : EMPTY_CHAR.stashes,
    notes: c.notes || '',
  }
}

function mapToApi(char) {
  return {
    name: char.name,
    playerName: char.playerName,
    tokenId: char.tokenId,
    class: char.class,
    level: Number(char.level) || 0,
    xp: Number(char.xp) || 0,
    alignment: char.alignment,
    title: char.title,
    str: Number(char.abilities.str) || 0,
    int: Number(char.abilities.int) || 0,
    wis: Number(char.abilities.wis) || 0,
    dex: Number(char.abilities.dex) || 0,
    con: Number(char.abilities.con) || 0,
    cha: Number(char.abilities.cha) || 0,
    hp: Number(char.hp) || 0,
    maxHp: Number(char.maxHp) || 0,
    ac: Number(char.ac) || 0,
    thac0: Number(char.thac0) || 0,
    movement: char.movement,
    initiative: char.initiative,
    savDeathPoison: Number(char.saves.deathPoison) || 0,
    savWands: Number(char.saves.wands) || 0,
    savParalysisStone: Number(char.saves.paralysisStone) || 0,
    savBreathAttack: Number(char.saves.breathAttack) || 0,
    savSpellsStaffRod: Number(char.saves.spellsStaffRod) || 0,
    classAbilities: JSON.stringify(char.classAbilities),
    skills: JSON.stringify(char.skills),
    weaponMasteries: JSON.stringify(char.weaponMasteries),
    preparedSpells: JSON.stringify(char.preparedSpells),
    spellbook: JSON.stringify(char.spellbook),
    notes: char.notes,
  }
}

async function saveCharacterToApi(data, headers, characterId) {
  const charRes = await fetch(`${API_URL}/api/characters/${characterId}`, {
    method: 'PUT', headers,
    body: JSON.stringify(mapToApi(data)),
  })
  if (!charRes.ok) throw new Error('Save failed')

  const stashPromises = (data.stashes || [])
    .filter((s) => s.stashId)
    .map((s) =>
      fetch(`${API_URL}/api/characters/${characterId}/stashes/${s.stashId}`, {
        method: 'PUT', headers,
        body: JSON.stringify({
          name: s.name,
          shared: s.shared || false,
          platinum: Number(s.platinum) || 0,
          gold: Number(s.gold) || 0,
          electrum: Number(s.electrum) || 0,
          silver: Number(s.silver) || 0,
          copper: Number(s.copper) || 0,
          equipment: JSON.stringify(s.equipment || []),
        }),
      })
    )
  await Promise.all(stashPromises)
}

function CharacterSheet({ characterId, initialData, token }) {
  const [activeTab, setActiveTab] = useState('core')
  const [saveStatus, setSaveStatus] = useState('')

  const { data: char, setData: setChar } = usePersistence({
    storageKey: `character_${characterId}`,
    defaultValue: () => mapApiData(initialData),
    saveToApi: (data, headers) => saveCharacterToApi(data, headers, characterId),
    token,
    onSaveStatus: setSaveStatus,
  })

  const set = (field, value) => {
    setChar((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="cs">
      <div className="cs-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`cs-tab${activeTab === tab.key ? ' cs-tab-active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        {saveStatus && <span className="cs-save-status">{saveStatus}</span>}
      </div>

      <div className="cs-tab-content">
        {activeTab === 'core' && <TabCore char={char} set={set} setChar={setChar} />}
        {activeTab === 'abilities' && <TabAbilities char={char} set={set} setChar={setChar} />}
        {activeTab === 'spells' && <TabSpells char={char} set={set} setChar={setChar} />}
        {activeTab === 'equipment' && <TabEquipment char={char} set={set} setChar={setChar} />}
        {activeTab === 'notes' && <TabNotes char={char} set={set} />}
      </div>
    </div>
  )
}

export default CharacterSheet

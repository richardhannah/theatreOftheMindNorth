export const BUFFS = [
  { id: 'blessed', label: 'Blessed', icon: '\u2728', description: '+1 to hit, +1 to saves' },
  { id: 'hasted', label: 'Hasted', icon: '\u26A1', description: 'Double movement, +2 AC, extra attack' },
  { id: 'shielded', label: 'Shield', icon: '\u{1F6E1}', description: '+4 AC vs targeted attacks' },
  { id: 'invisible', label: 'Invisible', icon: '\u{1F47B}', description: 'Cannot be seen' },
  { id: 'enlarged', label: 'Enlarged', icon: '\u2B06', description: 'Increased size and damage' },
  { id: 'protected', label: 'Protection', icon: '\u{1F4AB}', description: 'Protection from evil' },
  { id: 'regenerating', label: 'Regenerating', icon: '\u{1F49A}', description: 'Recovering HP over time' },
  { id: 'flying', label: 'Flying', icon: '\u{1F985}', description: 'Airborne movement' },
  { id: 'heroism', label: 'Heroism', icon: '\u{1F451}', description: 'Bonus to hit and morale' },
  { id: 'mirrored', label: 'Mirror Image', icon: '\u{1F5BC}', description: 'Illusory duplicates absorb attacks' },
  { id: 'stoneskin', label: 'Stoneskin', icon: '\u{1FAA8}', description: 'Absorbs physical damage' },
  { id: 'freeaction', label: 'Free Action', icon: '\u{1F3C3}', description: 'Immune to hold/paralysis' },
  { id: 'resistfire', label: 'Resist Fire', icon: '\u{1F525}', description: 'Fire resistance' },
  { id: 'resistcold', label: 'Resist Cold', icon: '\u2744', description: 'Cold resistance' },
  { id: 'trueseeing', label: 'True Seeing', icon: '\u{1F441}', description: 'See through illusions and invisibility' },
  { id: 'strengthened', label: 'Strength', icon: '\u{1F4AA}', description: 'Magically enhanced strength' },
]

export const PENALTIES = [
  { id: 'blinded', label: 'Blinded', icon: '\u{1F648}', description: '-4 to hit, +4 AC penalty' },
  { id: 'stunned', label: 'Stunned', icon: '\u{1F4AB}', description: 'Cannot act' },
  { id: 'delayed', label: 'Delayed', icon: '\u23F3', description: 'Acts last in initiative' },
  { id: 'paralyzed', label: 'Paralyzed', icon: '\u26D4', description: 'Cannot move or act' },
  { id: 'poisoned', label: 'Poisoned', icon: '\u2620', description: 'Taking poison damage' },
  { id: 'frightened', label: 'Frightened', icon: '\u{1F631}', description: 'Must flee, -2 to hit' },
  { id: 'charmed', label: 'Charmed', icon: '\u{1F495}', description: 'Treats caster as ally' },
  { id: 'confused', label: 'Confused', icon: '\u2753', description: 'Acts randomly' },
  { id: 'held', label: 'Held', icon: '\u{1F9CA}', description: 'Magically immobilized' },
  { id: 'slowed', label: 'Slowed', icon: '\u{1F422}', description: 'Half movement, -2 initiative' },
  { id: 'cursed', label: 'Cursed', icon: '\u{1F480}', description: '-1 to hit and saves' },
  { id: 'silenced', label: 'Silenced', icon: '\u{1F910}', description: 'Cannot cast spells' },
  { id: 'sleeping', label: 'Sleeping', icon: '\u{1F4A4}', description: 'Unconscious, auto-hit in melee' },
  { id: 'prone', label: 'Prone', icon: '\u{1F938}', description: 'On the ground, -2 melee AC' },
  { id: 'entangled', label: 'Entangled', icon: '\u{1FAB4}', description: 'Cannot move, -2 to hit' },
  { id: 'deafened', label: 'Deafened', icon: '\u{1F649}', description: 'Cannot hear, -1 initiative' },
  { id: 'burning', label: 'Burning', icon: '\u{1F525}', description: 'Taking fire damage over time' },
  { id: 'petrified', label: 'Petrified', icon: '\u{1FAA8}', description: 'Turned to stone' },
  { id: 'unconscious', label: 'Unconscious', icon: '\u{1F635}', description: 'At 0 HP, helpless' },
  { id: 'wounded', label: 'Wounded', icon: '\u{1FA78}', description: 'Below half HP' },
]

export const ALL_EFFECTS = [...BUFFS, ...PENALTIES]
export const EFFECT_MAP = Object.fromEntries(ALL_EFFECTS.map((e) => [e.id, e]))

export const PACK_ANIMAL_TYPES = [
  { type: 'Draft Horse', packCapacity: 9000, draftCapacity: 15000, movement: 18 },
  { type: 'Riding Horse', packCapacity: 6000, draftCapacity: 10000, movement: 48 },
  { type: 'War Horse', packCapacity: 8000, draftCapacity: 13000, movement: 24 },
  { type: 'Mule', packCapacity: 6000, draftCapacity: 9000, movement: 24 },
  { type: 'Camel', packCapacity: 6000, draftCapacity: 9000, movement: 30 },
  { type: 'Ox', packCapacity: 10000, draftCapacity: 20000, movement: 12 },
  { type: 'Elephant', packCapacity: 15000, draftCapacity: 30000, movement: 24 },
  { type: 'Human', packCapacity: 1200, draftCapacity: 2000, movement: 18 },
]

const ANY_ANIMAL = ['Draft Horse', 'Riding Horse', 'War Horse', 'Mule', 'Camel', 'Ox', 'Elephant']

export const WAGON_TYPES = [
  { type: 'Pull Cart', capacity: 3000, maxAnimals: 2, allowedAnimals: ['Human'] },
  { type: 'Mule Cart', capacity: 4000, maxAnimals: 1, allowedAnimals: ['Mule'] },
  { type: 'Horse Cart', capacity: 10000, maxAnimals: 1, allowedAnimals: ['Draft Horse', 'Riding Horse', 'War Horse', 'Ox'] },
  { type: 'Small Wagon', capacity: 20000, maxAnimals: 2, allowedAnimals: ANY_ANIMAL },
  { type: 'Medium Wagon', capacity: 40000, maxAnimals: 4, allowedAnimals: ANY_ANIMAL },
  { type: 'Large Wagon', capacity: 60000, maxAnimals: 8, allowedAnimals: ANY_ANIMAL },
]

export const PACK_ANIMAL_MAP = Object.fromEntries(PACK_ANIMAL_TYPES.map((a) => [a.type, a]))
export const WAGON_MAP = Object.fromEntries(WAGON_TYPES.map((w) => [w.type, w]))

// Mercenaries (all 1st level, costs in gp/month, double for wartime)
export const MERCENARY_TYPES = [
  { type: 'Archer', equipment: 'Leather, short bow, sword', costs: { Man: 5, Dwarf: null, Elf: 10, Orc: 3, Goblin: 2 } },
  { type: 'Bowman, Mounted', equipment: 'Light horse, short bow', costs: { Man: 15, Dwarf: null, Elf: 30, Orc: null, Goblin: null } },
  { type: 'Crossbowman', equipment: 'Chain, heavy crossbow', costs: { Man: 4, Dwarf: 6, Elf: null, Orc: 2, Goblin: null } },
  { type: 'Crossbowman, Mounted', equipment: 'Mule, crossbow', costs: { Man: null, Dwarf: 15, Elf: null, Orc: null, Goblin: null } },
  { type: 'Footman, Light', equipment: 'Leather, shield, sword', costs: { Man: 2, Dwarf: null, Elf: 4, Orc: 1, Goblin: 0.5 } },
  { type: 'Footman, Heavy', equipment: 'Chain, shield, sword', costs: { Man: 3, Dwarf: 5, Elf: 6, Orc: 1.5, Goblin: null } },
  { type: 'Horseman, Light', equipment: 'Leather, lance', costs: { Man: 10, Dwarf: null, Elf: 20, Orc: null, Goblin: null } },
  { type: 'Horseman, Medium', equipment: 'Chain, lance', costs: { Man: 15, Dwarf: null, Elf: 20, Orc: null, Goblin: null } },
  { type: 'Horseman, Heavy', equipment: 'Plate, sword, lance', costs: { Man: 20, Dwarf: null, Elf: null, Orc: null, Goblin: null } },
  { type: 'Longbowman', equipment: 'Chain, longbow, sword', costs: { Man: 10, Dwarf: null, Elf: 20, Orc: null, Goblin: null } },
  { type: 'Normal Man', equipment: 'Peasant, spear', costs: { Man: 1, Dwarf: null, Elf: null, Orc: null, Goblin: null } },
  { type: 'Wolf-Rider', equipment: 'Leather, spear, wolf', costs: { Man: null, Dwarf: null, Elf: null, Orc: null, Goblin: 5 } },
]

export const MERCENARY_RACES = ['Man', 'Dwarf', 'Elf', 'Orc', 'Goblin']

// Specialists (costs in gp/month unless noted)
export const SPECIALIST_TYPES = [
  { type: 'Alchemist', cost: 1000, description: 'Brews potions and identifies substances' },
  { type: 'Animal Trainer', cost: 500, description: 'Trains and handles animals' },
  { type: 'Armorer', cost: 100, description: 'Maintains and repairs armour and weapons' },
  { type: 'Engineer', cost: 750, description: 'Designs and constructs fortifications' },
  { type: 'Magic-User', cost: 3000, description: 'Arcane services and spell research' },
  { type: 'Sage', cost: 2000, description: 'Research and knowledge' },
  { type: 'Spy', cost: 500, description: 'Reconnaissance and intelligence (per mission)' },
  { type: 'Trader', cost: 50, description: 'Provides Basic gear while out of town (some items may be more expensive or unavailable' },
]

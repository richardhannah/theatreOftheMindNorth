export const PRIMARY_A = 'A'
export const PRIMARY_M = 'M'
export const PRIMARY_H = 'H'

export const MISSILE_WEAPONS = 'Missile Weapons'
export const HANDHELD_EASILYTHROWN = 'Hand-Held Weapons Easily Thrown'
export const HANDHELD_ONLY = 'Weapons for Hand-Held Use Only'
export const HANDHELD_RARELYTHROWN = 'Hand-Held Weapons Rarely Thrown'

export const ATTR_ONEHAND = '1-H'
export const ATTR_TWOHAND = '2-H'
export const ATTR_CANUSEWITHSHIELD = 'Shield'
export const ATTR_MISSILE = 'Missile'
export const ATTR_MELEE = 'Melee'
export const ATTR_THROWN = 'Thrown'
export const ATTR_SMALL = 'Small'
export const ATTR_MEDIUM = 'Medium'
export const ATTR_LARGE = 'Large'
export const ATTR_MOUNTED = 'Mounted'

export const CLEARED_WEAPON_FILTER = {
  searchText: "",
  categories: [MISSILE_WEAPONS,HANDHELD_EASILYTHROWN,HANDHELD_ONLY,HANDHELD_RARELYTHROWN]
}


export const WEAPONMASTERY_DATA = [
  {
    weaponName: 'Blowgun up to 2 feet',
    primary: PRIMARY_A,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_MISSILE,ATTR_SMALL],
    cost: '3 gp',
    enc: '6 cn',
    category: MISSILE_WEAPONS,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '15', medium: '20',long: '30'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: '-',
        special: 'By Poison'
      },
      {
        level: 'SK',
        ranges: {short: '15', medium: '25',long: '30'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: '-',
        special: 'By Poison (save -1)'
      },
      {
        level: 'EX',
        ranges: {short: '15', medium: '25',long: '35'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: '-',
        special: 'By Poison (save -2)'
      },
      {
        level: 'MS',
        ranges: {short: '20', medium: '25',long: '35'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: '-',
        special: 'By Poison (save -3)'
      },
      {
        level: 'GM',
        ranges: {short: '25', medium: '30',long: '40'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: '-',
        special: 'By Poison (save -4)'
      }
    ]

  },
  {
    weaponName: 'Blowgun over 2 feet',
    primary: PRIMARY_A,
    attributes: [ATTR_TWOHAND,ATTR_MISSILE,ATTR_MEDIUM],
    cost: '6 gp',
    enc: '15 cn',
    category: MISSILE_WEAPONS,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '20', medium: '25',long: '30'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: '-',
        special: 'By Poison'
      },
      {
        level: 'SK',
        ranges: {short: '20', medium: '25',long: '30'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: '-',
        special: 'By Poison (save -1)'
      },
      {
        level: 'EX',
        ranges: {short: '25', medium: '30',long: '40'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: '-',
        special: 'By Poison (save -2)'
      },
      {
        level: 'MS',
        ranges: {short: '30', medium: '35',long: '40'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: '-',
        special: 'By Poison (save -3)'
      },
      {
        level: 'GM',
        ranges: {short: '30', medium: '40',long: '50'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: '-',
        special: 'By Poison (save -4)'
      }
    ]

  },
  {
    weaponName: 'Bola',
    primary: PRIMARY_H,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_THROWN,ATTR_MEDIUM],
    cost: '5 gp',
    enc: '5 cn',
    category: MISSILE_WEAPONS,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '20', medium: '40',long: '60'},
        damage: {primary: '1d2', secondary: 'Nil'},
        defense: '-',
        special: 'Strangle(20)'
      },
      {
        level: 'SK',
        ranges: {short: '25', medium: '40',long: '60'},
        damage: {primary: '1d3', secondary: 'Nil'},
        defense: 'H: -1AC/1',
        special: 'Strangle(20) (save -1)'
      },
      {
        level: 'EX',
        ranges: {short: '30', medium: '50',long: '70'},
        damage: {primary: '1d3+1', secondary: 'Nil'},
        defense: 'H: -2AC/2',
        special: 'Strangle(19-20) (save -2)'
      },
      {
        level: 'MS',
        ranges: {short: '35', medium: '50',long: '70'},
        damage: {primary: '1d3+2', secondary: 'Nil'},
        defense: 'H: -3AC/3',
        special: 'Strangle(18-20) (P = save -3) (S = save -2)'
      },
      {
        level: 'GM',
        ranges: {short: '40', medium: '60',long: '80'},
        damage: {primary: '1d3+3', secondary: 'Nil'},
        defense: 'H: -4AC/3',
        special: 'Strangle(17-20) (P = save -4) (S = save -2)'
      }
    ]

  },
  {
    weaponName: 'Bow, Long',
    primary: PRIMARY_M,
    attributes: [ATTR_TWOHAND,ATTR_MISSILE,ATTR_LARGE],
    cost: '40 gp',
    enc: '30 cn',
    category: MISSILE_WEAPONS,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '70', medium: '140',long: '210'},
        damage: {primary: '1d6', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '90', medium: '150',long: '220'},
        damage: {primary: '1d8+1', secondary: 'Nil'},
        defense: 'H: -1AC/1',
        special: 'Delay (s/m)'
      },
      {
        level: 'EX',
        ranges: {short: '110', medium: '170',long: '230'},
        damage: {primary: '1d10+2', secondary: 'Nil'},
        defense: 'H: -2AC/1',
        special: 'Delay (s/m)'
      },
      {
        level: 'MS',
        ranges: {short: '130', medium: '180',long: '240'},
        damage: {primary: '3d6', secondary: '1d10+4'},
        defense: 'H: -2AC/2',
        special: 'Delay (s/m)'
      },
      {
        level: 'GM',
        ranges: {short: '150', medium: '200',long: '250'},
        damage: {primary: '4d4+2', secondary: '1d10+6'},
        defense: 'H: -2AC/2',
        special: 'Delay (s/m)'
      }
    ]

  },
  {
    weaponName: 'Bow, Short',
    primary: PRIMARY_M,
    attributes: [ATTR_TWOHAND,ATTR_MISSILE,ATTR_MEDIUM],
    cost: '25 gp',
    enc: '20 cn',
    category: MISSILE_WEAPONS,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '50', medium: '100',long: '150'},
        damage: {primary: '1d6', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '60', medium: '110',long: '160'},
        damage: {primary: '1d6+2', secondary: 'Nil'},
        defense: 'H: -1AC/1',
        special: 'Delay (s)'
      },
      {
        level: 'EX',
        ranges: {short: '80', medium: '130',long: '170'},
        damage: {primary: '1d6+4', secondary: 'Nil'},
        defense: 'H: -1AC/2',
        special: 'Delay (s)'
      },
      {
        level: 'MS',
        ranges: {short: '90', medium: '130',long: '180'},
        damage: {primary: '1d8+6', secondary: '1d4+6'},
        defense: 'H: -2AC/2',
        special: 'Delay (s)'
      },
      {
        level: 'GM',
        ranges: {short: '110', medium: '140',long: '190'},
        damage: {primary: '1d10+8', secondary: '1d6+7'},
        defense: 'H: -2AC/2',
        special: 'Delay (s)'
      }
    ]

  },
  {
    weaponName: 'Crossbow,Heavy',
    primary: PRIMARY_H,
    attributes: [ATTR_TWOHAND,ATTR_MISSILE,ATTR_LARGE],
    cost: '50 gp',
    enc: '80 cn',
    category: MISSILE_WEAPONS,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '80', medium: '160',long: '240'},
        damage: {primary: '2d4', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '90', medium: '160',long: '240'},
        damage: {primary: '2d6', secondary: 'Nil'},
        defense: 'M: -1AC/1',
        special: 'Stun (s/m)'
      },
      {
        level: 'EX',
        ranges: {short: '100', medium: '170',long: '240'},
        damage: {primary: '2d6+2', secondary: 'Nil'},
        defense: 'H: -2AC/2',
        special: 'Stun (s/m)'
      },
      {
        level: 'MS',
        ranges: {short: '110', medium: '170',long: '240'},
        damage: {primary: '3d6+2', secondary: '1d12+4'},
        defense: 'H: -3AC/2',
        special: 'Stun (s/m)'
      },
      {
        level: 'GM',
        ranges: {short: '120', medium: '180',long: '240'},
        damage: {primary: '4d4+4', secondary: '1d10+6'},
        defense: 'H: -2AC/2',
        special: 'Stun (s/m)'
      }
    ]

  },
  {
    weaponName: 'Crossbow,Light',
    primary: PRIMARY_H,
    attributes: [ATTR_TWOHAND,ATTR_MISSILE,ATTR_MEDIUM],
    cost: '30 gp',
    enc: '50 cn',
    category: MISSILE_WEAPONS,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '60', medium: '120',long: '180'},
        damage: {primary: '1d6', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '60', medium: '120',long: '180'},
        damage: {primary: '1d6+2', secondary: 'Nil'},
        defense: 'M: -1AC/1',
        special: 'Stun (s)'
      },
      {
        level: 'EX',
        ranges: {short: '75', medium: '130',long: '180'},
        damage: {primary: '1d6+4', secondary: 'Nil'},
        defense: 'M: -2AC/2',
        special: 'Stun (s)'
      },
      {
        level: 'MS',
        ranges: {short: '75', medium: '130',long: '180'},
        damage: {primary: '1d8+6', secondary: '1d4+6'},
        defense: 'M: -2AC/3',
        special: 'Stun (s)'
      },
      {
        level: 'GM',
        ranges: {short: '90', medium: '140',long: '180'},
        damage: {primary: '1d6+7', secondary: '2d4+5'},
        defense: 'M: -3AC/3',
        special: 'Stun (s)'
      }
    ]

  },
  {
    weaponName: 'Sling',
    primary: PRIMARY_H,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_MISSILE,ATTR_SMALL],
    cost: '2 gp',
    enc: '20 cn',
    category: MISSILE_WEAPONS,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '40', medium: '80',long: '160'},
        damage: {primary: '1d4', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '40', medium: '80',long: '160'},
        damage: {primary: '1d6', secondary: 'Nil'},
        defense: 'H: -1AC/2',
        special: 'Stun (s/m)'
      },
      {
        level: 'EX',
        ranges: {short: '60', medium: '110',long: '170'},
        damage: {primary: '2d4', secondary: 'Nil'},
        defense: 'H: -2AC/3',
        special: 'Stun (s/m)'
      },
      {
        level: 'MS',
        ranges: {short: '60', medium: '110',long: '170'},
        damage: {primary: '3d4', secondary: '1d8+2'},
        defense: 'H: -3AC/3',
        special: 'Stun (s/m)'
      },
      {
        level: 'GM',
        ranges: {short: '80', medium: '130',long: '180'},
        damage: {primary: '4d4', secondary: '1d10+2'},
        defense: 'H: -4AC/4',
        special: 'Stun (s/m)'
      }
    ]

  },
  {
    weaponName: 'Axe, Hand',
    primary: PRIMARY_M,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_THROWN,ATTR_SMALL],
    cost: '25 gp',
    enc: '20 cn',
    category: HANDHELD_EASILYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '10', medium: '20',long: '30'},
        damage: {primary: '1d6', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '15', medium: '25',long: '35'},
        damage: {primary: '1d6+2', secondary: 'Nil'},
        defense: 'M: -1AC/1',
        special: ''
      },
      {
        level: 'EX',
        ranges: {short: '25', medium: '35',long: '45'},
        damage: {primary: '1d6+3', secondary: 'Nil'},
        defense: 'M: -2AC/2',
        special: ''
      },
      {
        level: 'MS',
        ranges: {short: '30', medium: '40',long: '50'},
        damage: {primary: '2d4+4', secondary: '1d6+4'},
        defense: 'M: -3AC/3',
        special: ''
      },
      {
        level: 'GM',
        ranges: {short: '40', medium: '50',long: '60'},
        damage: {primary: '2d4+7', secondary: '1d6+6'},
        defense: 'M: -3AC/3',
        special: ''
      }
    ]

  },
  {
    weaponName: 'Dagger',
    primary: PRIMARY_H,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_THROWN,ATTR_SMALL],
    cost: '3 gp',
    enc: '10 cn',
    category: HANDHELD_EASILYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '10', medium: '20',long: '30'},
        damage: {primary: '1d4', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '15', medium: '25',long: '35'},
        damage: {primary: '1d6', secondary: 'Nil'},
        defense: 'H: -1AC/1',
        special: 'Double Damage (20)'
      },
      {
        level: 'EX',
        ranges: {short: '20', medium: '30',long: '45'},
        damage: {primary: '2d4', secondary: 'Nil'},
        defense: 'H: -2AC/2',
        special: 'Double Damage (19-20)'
      },
      {
        level: 'MS',
        ranges: {short: '25', medium: '35',long: '50'},
        damage: {primary: '3d4', secondary: '2d4+2'},
        defense: 'H: -2AC/2',
        special: 'Double Damage (18-20)'
      },
      {
        level: 'GM',
        ranges: {short: '30', medium: '50',long: '60'},
        damage: {primary: '4d4', secondary: '3d4+1'},
        defense: 'H: -3AC/3',
        special: 'Double Damage (17-20)'
      }
    ]

  },
  {
    weaponName: 'Hammer, Throwing',
    primary: PRIMARY_H,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_THROWN,ATTR_MEDIUM],
    cost: '4 gp',
    enc: '25 cn',
    category: HANDHELD_EASILYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '10', medium: '20',long: '30'},
        damage: {primary: '1d4', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '10', medium: '20',long: '30'},
        damage: {primary: '1d4+2', secondary: 'Nil'},
        defense: 'M: -1AC/2',
        special: 'Stun (s/m)'
      },
      {
        level: 'EX',
        ranges: {short: '20', medium: '30',long: '45'},
        damage: {primary: '1d6+2', secondary: 'Nil'},
        defense: 'M: -2AC/3',
        special: 'Stun (s/m)'
      },
      {
        level: 'MS',
        ranges: {short: '20', medium: '30',long: '45'},
        damage: {primary: '1d6+4', secondary: '1d4+4'},
        defense: 'M: -3AC/4',
        special: 'Stun (s/m)'
      },
      {
        level: 'GM',
        ranges: {short: '30', medium: '50',long: '60'},
        damage: {primary: '1d6+6', secondary: '1d4+6'},
        defense: 'M: -4AC/5',
        special: 'Stun (s/m)'
      }
    ]

  },
  {
    weaponName: 'Javelin',
    primary: PRIMARY_H,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_THROWN,ATTR_MEDIUM],
    cost: '1 gp',
    enc: '20 cn',
    category: HANDHELD_EASILYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '30', medium: '60',long: '90'},
        damage: {primary: '1d6', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '30', medium: '60',long: '90'},
        damage: {primary: '1d6+2', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'EX',
        ranges: {short: '40', medium: '80',long: '120'},
        damage: {primary: '1d6+4', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'MS',
        ranges: {short: '40', medium: '80',long: '120'},
        damage: {primary: '1d6+6', secondary: '1d4+6'},
        defense: '-',
        special: '-'
      },
      {
        level: 'GM',
        ranges: {short: '50', medium: '100',long: '150'},
        damage: {primary: '1d6+9', secondary: '1d4+8'},
        defense: '-',
        special: '-'
      }
    ]

  },
  {
    weaponName: 'Net, One Handed',
    primary: PRIMARY_M,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_THROWN,ATTR_MEDIUM],
    cost: '1 sp/sq ft',
    enc: '1 cn/sq ft',
    category: HANDHELD_EASILYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '10', medium: '20',long: '30'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: '-',
        special: 'Entangle'
      },
      {
        level: 'SK',
        ranges: {short: '15', medium: '25',long: '35'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: 'A: -2AC/1',
        special: 'Entangle (Save -1)'
      },
      {
        level: 'EX',
        ranges: {short: '20', medium: '30',long: '40'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: 'A: -4AC/2',
        special: 'Entangle (Save -2)'
      },
      {
        level: 'MS',
        ranges: {short: '25', medium: '35',long: '45'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: 'A: -6AC/3',
        special: 'Entangle (P=Save -4) (S=Save -6)'
      },
      {
        level: 'GM',
        ranges: {short: '30', medium: '40',long: '50'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: 'A: -8AC/4',
        special: 'Entangle (P=Save -6) (S=Save -3)'
      }
    ]

  },
  {
    weaponName: 'Net, Two Handed',
    primary: PRIMARY_M,
    attributes: [ATTR_TWOHAND,ATTR_THROWN,ATTR_LARGE],
    cost: '1 sp/sq ft',
    enc: '1 cn/sq ft',
    category: HANDHELD_EASILYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '10', medium: '20',long: '30'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: '-',
        special: 'Entangle'
      },
      {
        level: 'SK',
        ranges: {short: '15', medium: '25',long: '35'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: 'A: -2AC/1',
        special: 'Entangle (Save -1)'
      },
      {
        level: 'EX',
        ranges: {short: '20', medium: '30',long: '40'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: 'A: -4AC/2',
        special: 'Entangle (Save -2)'
      },
      {
        level: 'MS',
        ranges: {short: '25', medium: '35',long: '45'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: 'A: -6AC/3',
        special: 'Entangle (P=Save -4) (S=Save -6)'
      },
      {
        level: 'GM',
        ranges: {short: '30', medium: '40',long: '50'},
        damage: {primary: 'Nil', secondary: 'Nil'},
        defense: 'A: -8AC/4',
        special: 'Entangle (P=Save -6) (S=Save -3)'
      }
    ]

  },
  {
    weaponName: 'Spear',
    primary: PRIMARY_A,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_THROWN,ATTR_LARGE],
    cost: '3 gp',
    enc: '30 cn',
    category: HANDHELD_EASILYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '20', medium: '40',long: '60'},
        damage: {primary: '1d6', secondary: 'Nil'},
        defense: '-',
        special: 'Set'
      },
      {
        level: 'SK',
        ranges: {short: '20', medium: '40',long: '60'},
        damage: {primary: '1d6+2', secondary: 'Nil'},
        defense: '-',
        special: 'Set'
      },
      {
        level: 'EX',
        ranges: {short: '40', medium: '60',long: '75'},
        damage: {primary: '2d4+2', secondary: 'Nil'},
        defense: '-',
        special: 'Set + Stun'
      },
      {
        level: 'MS',
        ranges: {short: '40', medium: '60',long: '75'},
        damage: {primary: '2d4+4', secondary: 'Nil'},
        defense: '-',
        special: 'Set + Stun'
      },
      {
        level: 'GM',
        ranges: {short: '60', medium: '75',long: '90'},
        damage: {primary: '2d4+6', secondary: 'Nil'},
        defense: '-',
        special: 'Set + Stun'
      }
    ]

  },
  {
    weaponName: 'Tossed Object',
    primary: PRIMARY_A,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_THROWN,ATTR_SMALL],
    cost: '-',
    enc: '-',
    category: HANDHELD_EASILYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '10', medium: '30',long: '50'},
        damage: {primary: 'Stone 1d3', secondary: 'Nil'},
        defense: '-',
        special: 'Stun (s)'
      },
      {
        level: 'BS',
        ranges: {short: '10', medium: '30',long: '50'},
        damage: {primary: 'Oil 1d8', secondary: 'Nil'},
        defense: '-',
        special: 'Ignite'
      },
      {
        level: 'BS',
        ranges: {short: '10', medium: '30',long: '50'},
        damage: {primary: 'Holy Water 1d8', secondary: 'Nil'},
        defense: '-',
        special: '-'
      }
    ]

  },
  {
    weaponName: 'Trident',
    primary: PRIMARY_M,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_THROWN,ATTR_LARGE],
    cost: '5 gp',
    enc: '25 cn',
    category: HANDHELD_EASILYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '10', medium: '20',long: '30'},
        damage: {primary: '1d6', secondary: 'Nil'},
        defense: '-',
        special: 'Set'
      },
      {
        level: 'SK',
        ranges: {short: '10', medium: '20',long: '30'},
        damage: {primary: '1d8+1', secondary: 'Nil'},
        defense: '-',
        special: 'Skewer (up to 4 HD)'
      },
      {
        level: 'EX',
        ranges: {short: '20', medium: '30',long: '45'},
        damage: {primary: '1d8+4', secondary: 'Nil'},
        defense: '-',
        special: 'Skewer (up to 7 HD)'
      },
      {
        level: 'MS',
        ranges: {short: '20', medium: '30',long: '45'},
        damage: {primary: '1d8+6', secondary: '1d6+6'},
        defense: '-',
        special: 'Skewer (up to 10 HD)'
      },
      {
        level: 'GM',
        ranges: {short: '30', medium: '45',long: '60'},
        damage: {primary: '1d6+9', secondary: '1d4+8'},
        defense: '-',
        special: 'Skewer (up to 15 HD)'
      }
    ]

  },
  {
    weaponName: 'BlackJack',
    primary: PRIMARY_H,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_MELEE,ATTR_SMALL],
    cost: '5 gp',
    enc: '5 cn',
    category: HANDHELD_ONLY,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d2', secondary: 'Nil'},
        defense: '-',
        special: 'Knockout'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '2d2', secondary: 'Nil'},
        defense: '-',
        special: 'Knockout (save -1)'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4+1', secondary: 'Nil'},
        defense: '-',
        special: 'Knockout (save -2)'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4+3', secondary: '1d6+1'},
        defense: '-',
        special: 'Knockout (save -3)'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4+5', secondary: '1d6+2'},
        defense: '-',
        special: 'Knockout (save -4)'
      }
    ]

  },
  {
    weaponName: 'Cestus',
    primary: PRIMARY_H,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_MELEE,ATTR_SMALL],
    cost: '5 gp',
    enc: '10 cn',
    category: HANDHELD_ONLY,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d3', secondary: 'Nil'},
        defense: '-',
        special: 'No off-hand penalty'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4+1', secondary: 'Nil'},
        defense: '-',
        special: 'No off-hand penalty'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '2d4', secondary: 'Nil'},
        defense: '-',
        special: 'No off-hand penalty'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '2d4', secondary: '1d4+3'},
        defense: '-',
        special: 'No off-hand penalty'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '3d4', secondary: '2d4+3'},
        defense: '-',
        special: 'No off-hand penalty'
      }
    ]

  },
  {
    weaponName: 'Halberd',
    primary: PRIMARY_H,
    attributes: [ATTR_TWOHAND,ATTR_MELEE,ATTR_LARGE],
    cost: '7 gp',
    enc: '150 cn',
    category: HANDHELD_ONLY,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d10', secondary: 'Nil'},
        defense: '-',
        special: 'Hook + disarm'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d10+2', secondary: 'Nil'},
        defense: 'H: -1AC/1',
        special: 'Hook(save -1) + disarm'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d10+5', secondary: 'Nil'},
        defense: 'H: -2AC/1',
        special: 'Hook(save -2) + deflect(1) + disarm'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d8+10', secondary: '1d8+8'},
        defense: 'H: -2AC/2',
        special: 'Hook(save -3) + deflect(1) + disarm'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6+15', secondary: '1d6+12'},
        defense: 'H: -3AC/2',
        special: 'Hook(save -4) + deflect(2) + disarm'
      }
    ]

  },
  {
    weaponName: 'Lance',
    primary: PRIMARY_M,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_MOUNTED,ATTR_MELEE,ATTR_LARGE],
    cost: '10 gp',
    enc: '180 cn',
    category: HANDHELD_ONLY,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d10', secondary: 'Nil'},
        defense: '-',
        special: 'Charge'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d10+3', secondary: 'Nil'},
        defense: 'M: -2AC/1',
        special: 'Charge'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d10+7', secondary: 'Nil'},
        defense: 'M: -3AC/1',
        special: 'Charge'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d8+12', secondary: '1d8+10'},
        defense: 'M: -3AC/2',
        special: 'Charge'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d8+16', secondary: '1d6+12'},
        defense: 'M: -4AC/2',
        special: 'Charge'
      }
    ]

  },
  {
    weaponName: 'Pike',
    primary: PRIMARY_H,
    attributes: [ATTR_TWOHAND,ATTR_MELEE,ATTR_LARGE],
    cost: '3 gp',
    enc: '80 cn',
    category: HANDHELD_ONLY,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d10', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d12+2', secondary: 'Nil'},
        defense: 'H: -2AC/1',
        special: 'Deflect (1)'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d12+5', secondary: 'Nil'},
        defense: 'H: -2AC/2',
        special: 'Deflect (1)'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d12+9', secondary: '1d10+8'},
        defense: 'H: -3AC/2',
        special: 'Deflect (2)'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d10+14', secondary: '1d8+10'},
        defense: 'H: -3AC/3',
        special: 'Deflect (2)'
      }
    ]

  },
  {
    weaponName: 'Poleaxe',
    primary: PRIMARY_H,
    attributes: [ATTR_TWOHAND,ATTR_MELEE,ATTR_LARGE],
    cost: '5 gp',
    enc: '120 cn',
    category: HANDHELD_ONLY,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d10', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d10+3', secondary: 'Nil'},
        defense: 'H: -1AC/1',
        special: 'Deflect (1)'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d10+6', secondary: 'Nil'},
        defense: 'H: -2AC/1',
        special: 'Deflect (1)'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d10+10', secondary: '1d10+8'},
        defense: 'H: -2AC/2',
        special: 'Deflect (2)'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d8+16', secondary: '1d8+12'},
        defense: 'H: -3AC/2',
        special: 'Deflect (2)'
      }
    ]

  },
  {
    weaponName: 'Shield, Horned',
    primary: PRIMARY_A,
    attributes: [ATTR_ONEHAND,ATTR_MELEE,ATTR_SMALL],
    cost: '15 gp',
    enc: '20 cn',
    category: HANDHELD_ONLY,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d2', secondary: 'Nil'},
        defense: 'A: -1AC/1',
        special: 'Second attack'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '2d2', secondary: 'Nil'},
        defense: 'A: -1AC/1',
        special: 'Second attack'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4+1', secondary: 'Nil'},
        defense: 'A: -1AC/2',
        special: 'Second attack'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4+3', secondary: '1d6+1'},
        defense: 'A: -1AC/4',
        special: 'Second attack'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4+5', secondary: '1d6+2'},
        defense: 'A: -1AC/6',
        special: 'Second attack'
      }
    ]

  },
  {
    weaponName: 'Shield, Knife',
    primary: PRIMARY_A,
    attributes: [ATTR_ONEHAND,ATTR_MELEE,ATTR_SMALL],
    cost: '65 gp',
    enc: '70 cn',
    category: HANDHELD_ONLY,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4+1', secondary: 'Nil'},
        defense: 'A: -1AC',
        special: 'Second attack + breaks'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6+1', secondary: 'Nil'},
        defense: 'A: -1AC',
        special: 'Second attack + breaks'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '2d4+1', secondary: 'Nil'},
        defense: 'A: -2AC',
        special: 'Second attack + breaks'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '3d4', secondary: '2d4+2'},
        defense: 'A: -2AC',
        special: 'Second attack + breaks'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '4d4', secondary: '3d4+1'},
        defense: 'A: -2AC',
        special: 'Second attack + breaks'
      }
    ]

  },
  {
    weaponName: 'Shield, Sword',
    primary: PRIMARY_A,
    attributes: [ATTR_ONEHAND,ATTR_MELEE,ATTR_MEDIUM],
    cost: '200 gp',
    enc: '185 cn',
    category: HANDHELD_ONLY,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4+2', secondary: 'Nil'},
        defense: 'A: -1AC/2',
        special: 'Second attack + breaks'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6+3', secondary: 'Nil'},
        defense: 'A: -1AC/2',
        special: 'Second attack + breaks'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6+4', secondary: 'Nil'},
        defense: 'A: -2AC/3',
        special: 'Second attack + breaks'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6+7', secondary: '1d4+7'},
        defense: 'A: -2AC/3',
        special: 'Second attack + breaks'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6+9', secondary: '1d4+9'},
        defense: 'A: -2AC/4',
        special: 'Second attack + breaks'
      }
    ]

  },
  {
    weaponName: 'Shield, Tusked',
    primary: PRIMARY_A,
    attributes: [ATTR_TWOHAND,ATTR_MELEE,ATTR_LARGE],
    cost: '200 gp',
    enc: '275 cn',
    category: HANDHELD_ONLY,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4+1', secondary: 'Nil'},
        defense: 'A: -1AC',
        special: 'Two attacks + breaks'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6+2', secondary: 'Nil'},
        defense: 'A: -2AC',
        special: 'Two attacks + breaks'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '2d4+2', secondary: 'Nil'},
        defense: 'A: -2AC',
        special: 'Two attacks + breaks'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '2d4+4', secondary: '1d6+5'},
        defense: 'A: -3AC',
        special: 'Two attacks + breaks'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '2d4+6', secondary: '1d8+5'},
        defense: 'A: -3AC',
        special: 'Two attacks + breaks'
      }
    ]

  },
  {
    weaponName: 'Staff',
    primary: PRIMARY_A,
    attributes: [ATTR_TWOHAND,ATTR_MELEE,ATTR_MEDIUM],
    cost: '5 gp',
    enc: '40 cn',
    category: HANDHELD_ONLY,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6+2', secondary: 'Nil'},
        defense: 'A: -1AC/2',
        special: 'Deflect(1)'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d8+2', secondary: 'Nil'},
        defense: 'A: -2AC/2',
        special: 'Deflect(2)'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d8+5', secondary: '1d6+4'},
        defense: 'A: -3AC/3',
        special: 'Deflect(3)'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d8+7', secondary: '1d6+7'},
        defense: 'A: -4AC/4',
        special: 'Deflect(4)'
      }
    ]

  },
  {
    weaponName: 'Sword, Two-Handed',
    primary: PRIMARY_M,
    attributes: [ATTR_TWOHAND,ATTR_MELEE,ATTR_LARGE],
    cost: '15 gp',
    enc: '100 cn',
    category: HANDHELD_ONLY,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d10', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '2d6+1', secondary: 'Nil'},
        defense: '-',
        special: 'Stun + deflect(1)'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '2d8+2', secondary: 'Nil'},
        defense: '-',
        special: 'Stun + deflect(2)'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '3d6+3', secondary: '2d8+3'},
        defense: '-',
        special: 'Stun + deflect(2)'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '3d6+6', secondary: '3d6+2'},
        defense: '-',
        special: 'Stun + deflect(3)'
      }
    ]

  },
  {
    weaponName: 'Whip',
    primary: PRIMARY_M,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_MELEE,ATTR_MEDIUM],
    cost: '1 gp/ft',
    enc: '10 cn/ft',
    category: HANDHELD_ONLY,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d2', secondary: 'Nil'},
        defense: '-',
        special: 'Entangle'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4', secondary: 'Nil'},
        defense: 'M: -2AC/2',
        special: 'Entangle (save -1)'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4+1', secondary: 'Nil'},
        defense: 'M: -3AC/3',
        special: 'Entangle (save -2)'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4+3', secondary: '1d3+2'},
        defense: 'M: -4AC/3',
        special: 'Entangle (save -3)'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4+5', secondary: '1d3+3'},
        defense: 'M: -4AC/4',
        special: 'Entangle (save -4)'
      }
    ]

  },
  {
    weaponName: 'Axe, Battle',
    primary: PRIMARY_M,
    attributes: [ATTR_TWOHAND,ATTR_MELEE,ATTR_MEDIUM],
    cost: '7 gp',
    enc: '60 cn',
    category: HANDHELD_RARELYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d8', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d8+2', secondary: 'Nil'},
        defense: 'M: -2AC/2',
        special: 'Delay'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '5',long: '10'},
        damage: {primary: '1d8+4', secondary: 'Nil'},
        defense: 'M: -3AC/2',
        special: 'Delay'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '5',long: '10'},
        damage: {primary: '1d8+8', secondary: '1d8+6'},
        defense: 'M: -3AC/3',
        special: 'Delay + stun'
      },
      {
        level: 'GM',
        ranges: {short: '5', medium: '10',long: '15'},
        damage: {primary: '1d10+10', secondary: '1d8+8'},
        defense: 'M: -4AC/4',
        special: 'Delay + stun'
      }
    ]

  },
  {
    weaponName: 'Club or Torch',
    primary: PRIMARY_M,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_MELEE,ATTR_MEDIUM],
    cost: '3 gp',
    enc: '50 cn',
    category: HANDHELD_RARELYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d4', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6+1', secondary: 'Nil'},
        defense: 'H: -1AC/2',
        special: 'Deflect (1)'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '15',long: '25'},
        damage: {primary: '1d6+3', secondary: 'Nil'},
        defense: 'H: -2AC/2',
        special: 'Deflect (1)'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '15',long: '25'},
        damage: {primary: '1d6+5', secondary: '1d4+5'},
        defense: 'H: -3AC/3',
        special: 'Deflect (2)'
      },
      {
        level: 'GM',
        ranges: {short: '10', medium: '25',long: '40'},
        damage: {primary: '1d6+6', secondary: '1d4+6'},
        defense: 'H: -4AC/4',
        special: 'Deflect (2)'
      }
    ]

  },
  {
    weaponName: 'Hammer, War',
    primary: PRIMARY_H,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_MELEE,ATTR_MEDIUM],
    cost: '5 gp',
    enc: '50 cn',
    category: HANDHELD_RARELYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6+2', secondary: 'Nil'},
        defense: 'M: -2AC/2',
        special: '-'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '10',long: '20'},
        damage: {primary: '1d8+2', secondary: 'Nil'},
        defense: 'M: -3AC/3',
        special: '-'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '10',long: '20'},
        damage: {primary: '1d8+5', secondary: '1d6+4'},
        defense: 'M: -4AC/3',
        special: '-'
      },
      {
        level: 'GM',
        ranges: {short: '10', medium: '20',long: '30'},
        damage: {primary: '1d8+7', secondary: '1d6+7'},
        defense: 'M: -5AC/4',
        special: '-'
      }
    ]

  },
  {
    weaponName: 'Mace',
    primary: PRIMARY_A,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_MELEE,ATTR_MEDIUM],
    cost: '5 gp',
    enc: '30 cn',
    category: HANDHELD_RARELYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '2d4', secondary: 'Nil'},
        defense: 'H: -1AC/1',
        special: '-'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '10',long: '20'},
        damage: {primary: '2d4+2', secondary: 'Nil'},
        defense: 'H: -2AC/2',
        special: '-'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '10',long: '20'},
        damage: {primary: '2d4+4', secondary: 'Nil'},
        defense: 'H: -3AC/3',
        special: '-'
      },
      {
        level: 'GM',
        ranges: {short: '10', medium: '20',long: '30'},
        damage: {primary: '2d4+6', secondary: 'Nil'},
        defense: 'H: -4AC/3',
        special: '-'
      }
    ]

  },
  {
    weaponName: 'Sword, Bastard (1-H)',
    primary: PRIMARY_H,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_MELEE,ATTR_LARGE],
    cost: '15 gp',
    enc: '80 cn',
    category: HANDHELD_RARELYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6+1', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6+3', secondary: 'Nil'},
        defense: 'H: -1AC/1',
        special: '-'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6+5', secondary: 'Nil'},
        defense: 'H: -2AC/2',
        special: 'Deflect (1)'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d8+8', secondary: '1d6+7'},
        defense: 'H: -3AC/2',
        special: 'Deflect (1)'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d8+10', secondary: '1d6+8'},
        defense: 'H: -4AC/3',
        special: 'Deflect (2)'
      }
    ]

  },
  {
    weaponName: 'Sword, Bastard (2-H)',
    primary: PRIMARY_H,
    attributes: [ATTR_TWOHAND,ATTR_MELEE,ATTR_LARGE],
    cost: '15 gp',
    enc: '80 cn',
    category: HANDHELD_RARELYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d8+1', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d8+3', secondary: 'Nil'},
        defense: '-',
        special: 'Deflect (1)'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '-',long: '5'},
        damage: {primary: '1d8+5', secondary: 'Nil'},
        defense: 'H: -1AC/1',
        special: 'Deflect (1)'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '-',long: '5'},
        damage: {primary: '1d10+8', secondary: '1d8+7'},
        defense: 'H: -2AC/2',
        special: 'Deflect (2)'
      },
      {
        level: 'GM',
        ranges: {short: '-', medium: '5',long: '10'},
        damage: {primary: '1d12+10', secondary: '1d10+8'},
        defense: 'H: -3AC/2',
        special: 'Deflect (3)'
      }
    ]

  },
  {
    weaponName: 'Sword, Normal',
    primary: PRIMARY_H,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_MELEE,ATTR_MEDIUM],
    cost: '10 gp',
    enc: '60 cn',
    category: HANDHELD_RARELYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d8', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d12', secondary: 'Nil'},
        defense: 'H: -2AC/1',
        special: 'Deflect (1) + disarm'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '5',long: '10'},
        damage: {primary: '2d8', secondary: 'Nil'},
        defense: 'H: -2AC/2',
        special: 'Deflect (2) + disarm (save +1)'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '5',long: '10'},
        damage: {primary: '2d8+4', secondary: '2d6+4'},
        defense: 'H: -3AC/3',
        special: 'Deflect (2) + disarm (save +2)'
      },
      {
        level: 'GM',
        ranges: {short: '5', medium: '10',long: '15'},
        damage: {primary: '2d6+8', secondary: '2d4+8'},
        defense: 'H: -4AC/3',
        special: 'Deflect (3) + disarm (save +4)'
      }
    ]

  },
  {
    weaponName: 'Sword, Short',
    primary: PRIMARY_H,
    attributes: [ATTR_ONEHAND,ATTR_CANUSEWITHSHIELD,ATTR_MELEE,ATTR_SMALL],
    cost: '7 gp',
    enc: '30 cn',
    category: HANDHELD_RARELYTHROWN,
    masteries: [
      {
        level: 'BS',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6', secondary: 'Nil'},
        defense: '-',
        special: '-'
      },
      {
        level: 'SK',
        ranges: {short: '-', medium: '-',long: '-'},
        damage: {primary: '1d6+2', secondary: 'Nil'},
        defense: 'H: -1AC/1',
        special: 'Deflect (1) + disarm (save +1)'
      },
      {
        level: 'EX',
        ranges: {short: '-', medium: '10',long: '20'},
        damage: {primary: '1d6+4', secondary: 'Nil'},
        defense: 'H: -2AC/2',
        special: 'Deflect (2) + disarm (save +2)'
      },
      {
        level: 'MS',
        ranges: {short: '-', medium: '10',long: '20'},
        damage: {primary: '1d6+7', secondary: '1d4+7'},
        defense: 'H: -2AC/3',
        special: 'Deflect (3) + disarm (save +4)'
      },
      {
        level: 'GM',
        ranges: {short: '10', medium: '20',long: '30'},
        damage: {primary: '1d6+9', secondary: '1d4+9'},
        defense: 'H: -3AC/4',
        special: 'Deflect (3) + disarm (save +6)'
      }
    ]

  }
]

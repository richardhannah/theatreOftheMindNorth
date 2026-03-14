const fs = require('fs');
const path = require('path');

const BASE = 'D:/projects/Tabletop RPG Stuff/Dungeons and Dragons/Fortune and Glory/player-notes/lore/';

// Smart paragraph joining for prose text with soft wraps.
// Strategy: join ALL lines into one big string, then RE-split into paragraphs
// by detecting paragraph boundaries.
//
// For files where the original has NO blank lines between paragraphs,
// we must join everything and the caller provides pre-split content.
//
// For files WITH blank lines, we use those as paragraph markers.

function joinByBlankLines(lines, wrapThreshold) {
  // Uses blank lines as paragraph separators.
  // Within each paragraph block, joins soft-wrapped lines.
  const blocks = [];
  let currentBlock = [];

  for (const line of lines) {
    if (line.trim() === '') {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock);
        currentBlock = [];
      }
    } else {
      currentBlock.push(line.trim());
    }
  }
  if (currentBlock.length > 0) blocks.push(currentBlock);

  // Within each block, join lines that are soft-wrapped
  const paragraphs = blocks.map(block => {
    let result = block[0];
    for (let i = 1; i < block.length; i++) {
      const prevLen = result.split('\n').pop().length;
      if (prevLen >= wrapThreshold) {
        result += ' ' + block[i];
      } else {
        result += '\n' + block[i];
      }
    }
    return result;
  });

  return paragraphs.join('\n\n');
}

// For structured/tabular content - keep line breaks, only join very long wraps
function joinStructured(lines, wrapThreshold = 150) {
  return joinByBlankLines(lines, wrapThreshold);
}

// For prose without blank lines between paragraphs:
// Join all lines, then we just return them joined as one string
// The caller must handle paragraph splitting manually
function joinAllLines(lines) {
  const result = [];
  let current = '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') {
      if (current) { result.push(current); current = ''; }
      continue;
    }
    if (current === '') {
      current = trimmed;
    } else {
      current += ' ' + trimmed;
    }
  }
  if (current) result.push(current);
  return result.join('\n\n');
}

function stripHead(lines) {
  if (lines.length > 0 && lines[0].startsWith('#')) lines.shift();
  while (lines.length > 0 && lines[0].trim() === '') lines.shift();
  while (lines.length > 0 && lines[0].trim().match(/^!\[.*\]\(.*\)$/)) {
    lines.shift();
    while (lines.length > 0 && lines[0].trim() === '') lines.shift();
  }
  return lines;
}

function stripTrailingMeta(lines) {
  while (lines.length > 0) {
    const last = lines[lines.length - 1].trim();
    if (last === '' ||
        last.match(/^\d{2} (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/) ||
        last.match(/^\d{2}:\d{2}$/) ||
        last === 'Untitled') {
      lines.pop();
    } else break;
  }
  return lines;
}

function readAndClean(file) {
  const raw = fs.readFileSync(path.join(BASE, file), 'utf8');
  let lines = raw.replace(/\r\n/g, '\n').split('\n');
  lines = stripHead(lines);
  lines = stripTrailingMeta(lines);
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
  return lines;
}

// ==================== INDIVIDUAL PROCESSORS ====================

function process14() {
  return 'A mysterious note';
}

function process15() {
  // Diary of Jacques de Voulon - no blank lines between paragraphs, wraps at ~100
  let lines = readAndClean('diary-of-jacques-de-voulon.md');
  if (lines[lines.length-1].trim() === 'Diary of Jacques de Voulon, Mage of New Averoigne') lines.pop();
  while (lines.length && lines[lines.length-1].trim() === '') lines.pop();

  // Join all into one text, then manually split into paragraphs
  const text = joinAllLines(lines);
  // This is one big blob. Split on known paragraph boundaries:
  const paragraphs = [];
  paragraphs.push('Diary of Jacques de Voulon, Mage of New Averoigne');
  paragraphs.push('14th day of Felmont, AC 1017');
  // Split the remaining text at paragraph-starting phrases
  const bodyStart = text.indexOf('Quelle humiliation!');
  const body = text.substring(bodyStart);

  const splits = [
    'It began innocently enough.',
    'Now, these Krondar,',
    'It was one of these Krondar',
    'The next morning,',
    'I must admit,',
  ];

  let remaining = body;
  for (const split of splits) {
    const idx = remaining.indexOf(split);
    if (idx > 0) {
      paragraphs.push(remaining.substring(0, idx).trim());
      remaining = remaining.substring(idx);
    }
  }
  if (remaining.trim()) paragraphs.push(remaining.trim());

  return paragraphs.join('\n\n');
}

function process16() {
  let lines = readAndClean('elven-language.md');
  return joinStructured(lines, 150);
}

function process17() {
  // Journal of Einar Valen - no blank lines, wraps at ~100-120
  let lines = readAndClean('journal-of-einar-valen.md');
  lines = lines.filter(l => l.trim() !== 'Journal of Einar Valen, Traveler and Chronicler of the Lands of Mystara');
  // Collapse consecutive blank lines
  const cleaned = [];
  let prevBlank = false;
  for (const l of lines) {
    if (l.trim() === '') {
      if (!prevBlank) cleaned.push(l);
      prevBlank = true;
    } else {
      cleaned.push(l);
      prevBlank = false;
    }
  }

  // Join all into text, then split into paragraphs by content
  const text = joinAllLines(cleaned);

  // Known paragraph starts (from reading the source content):
  const splits = [
    // Reedle intro
    'The town is blessed with rich and fertile lands,',
    "Reedle\u2019s strategic location along a well-traveled trail",
    'Yet, for all its prosperity, Reedle is a town riddled with intrigue.',
    // Mooncrest
    'The Mooncrest District of Reedle',
    'The architecture of Mooncrest is a testament',
    'One of the most charming features of this district',
    'The streets of Mooncrest are immaculate,',
    'The merchants themselves are a study in quiet affluence.',
    'In Mooncrest, one can sense the pulse of commerce',
    // Cattle Knot
    'The Cattle Knot District of Reedle',
    'The structures in the Cattle Knot are built',
    'As I walked through the Cattle Knot,',
    'The heart of Cattle Knot is undoubtedly the council chambers,',
    "As I strolled through the streets, I couldn\u2019t help but notice",
    'In the Cattle Knot, one senses the weight of tradition',
    // Black Churches
    'The Black Churches District of Reedle',
    'As I entered the district, I was immediately struck',
    'The origin of the district\u2019s name, "Black Churches,"',
    'In time, these forges became known as the "Black Churches,"',
    'Over the years, the name stuck,',
    'In the Black Churches, the work is never done.',
    "As I wandered the narrow streets, I couldn\u2019t help but feel",
    // Red Hills
    'The Red Hills District of Reedle',
    'As I ventured into the Red Hills,',
    'The people of the Red Hills are a rough and ready lot,',
    'Women, too, are a common sight on these streets,',
    'Children play in the dirt streets,',
    'The Red Hills district is a place where the veneer',
    'As I made my way back to the more prosperous quarters',
  ];

  return splitTextByPhrases(text, splits);
}

function splitTextByPhrases(text, splits) {
  const paragraphs = [];
  let remaining = text;

  for (const split of splits) {
    const idx = remaining.indexOf(split);
    if (idx > 0) {
      paragraphs.push(remaining.substring(0, idx).trim());
      remaining = remaining.substring(idx);
    }
  }
  if (remaining.trim()) paragraphs.push(remaining.trim());

  return paragraphs.join('\n\n');
}

function process18() {
  let lines = readAndClean('journal-of-gaius-marcellus.md');
  lines = lines.filter(l => l.trim() !== '\u2022' && l.trim() !== '•');
  const text = joinAllLines(lines);

  const splits = [
    'Date: XXII day of Maius,',
    'The words of the prayer came to me,',
    '"O Horon, Keeper of Sight Beyond Veils,',
    'With reverence, I translated each phrase',
    '"O Horonet,"',
    '"Seshemti Heru-nefer,"',
    '"Ankheth-en-nek"',
    '"Heqet ka en pet"',
    '"Sehenu khaibit en setau-khai"',
    '"Heh en-nek iunet em akhet-khai"',
    '"Ankheth nefret weret her-akhbit"',
    '"Djehuti em kheperu heri-sefbit"',
    'Thus, my prayer was both a plea',
    'I record these events in my journal,',
    'Gaius Marcellus, with one foot',
  ];

  return splitTextByPhrases(text, splits);
}

function process19() {
  let lines = readAndClean('mystaran-astrology.md');
  lines = lines.filter(l => l.trim() !== 'Mystaran Astrology');
  return joinStructured(lines, 200);
}

function process20() {
  let lines = readAndClean('mystaran-calendar.md');
  lines = lines.filter(l => l.trim() !== 'Mystaran Calendar');
  return joinStructured(lines, 150);
}

function process21() {
  let lines = readAndClean('the-eight-fold-way.md');
  const text = joinAllLines(lines);
  const splits = [
    'To the Disciple Who Seeks Mastery',
    'The Eight-Fold Way is the embodiment of balance,',
    '1. Earth Stance:',
    '2. Air Technique:',
    '3. Fire Form:',
    '4. Water Flow:',
    '5. Energy Sphere:',
    '6. Thought Sphere:',
    '7. Matter Sphere:',
    '8. Time Sphere:',
    'The Path Forward',
    'Take this wisdom, disciple,',
  ];
  return splitTextByPhrases(text, splits);
}

function process22() {
  let lines = readAndClean('the-key-of-ixion.md');
  const text = joinAllLines(lines);
  const splits = [
    'Here is a full listing of the twelve books of the Key of Ixion:',
    'Excerpts:',
    'Book VI: Discernment and Judgement. Chapter 4: Signs of the Bewitched',
    'So spake the Lord Ixion, and the people hearkened',
    'Book VII: Sanctity of Freedom. Chapter 6: On the Sanctity of Freedom',
    'So spake the Lord Ixion, and His words were a beacon',
    'High Archons of Ixion',
    'These Archons are the most revered servants of Ixion,',
    'Prayer of Exorcism to Ixion',
  ];

  return splitTextByPhrases(text, splits);
}

function process23() {
  let lines = readAndClean('the-sacra-vindictae.md');
  if (lines[0].trim() === 'The Sacra Vindictae') lines.shift();
  while (lines.length && lines[0].trim() === '') lines.shift();

  const text = joinAllLines(lines);
  const splits = [
    '"In thy deeds, embody the unseen,',
    '"Bring forth offerings forged',
    '"Cast thine eyes not towards the heavens,',
    '"Tread the path serpentine,',
  ];
  return splitTextByPhrases(text, splits);
}

function process24() {
  let lines = readAndClean('town-history-of-nemiston.md');
  const text = joinAllLines(lines);
  const splits = [
    'Chapter 12: Law and Order',
    'Marshall Eldmire: The Unyielding Enforcer',
    "In the annals of Nemiston\u2019s history,",
    "Eldmire\u2019s early years in law enforcement",
    'His most notorious pursuit,',
    'The pursuit of Blackbeard was fraught with peril,',
    'The disappearance of Marshall Eldmire',
    'In the years following his disappearance,',
    'End of Page 157',
  ];
  return splitTextByPhrases(text, splits);
}

function process25() {
  let lines = readAndClean('vas-maleficarum.md');
  const text = joinAllLines(lines);
  const splits = [
    '\u2014From "The Solarium Chronicles,"',
    '"In the Age of Wonders,',
    'With the Crucible, spells are no longer',
    'The Blackmoorians sought to weaponize',
    '\u2014From the "Codex Malignis Arcana,"',
    'Excerpt from the Journal of Archmage Nythara',
    '"The Vas Maleficarum. What a name,',
    '"Oh, how the scholars laugh!',
    '"Consider what this device could mean',
    '"And yet... there is a reason',
    '"Perhaps it is better left as legend,',
    '"I dreamt last night of a shard',
    '"For now, I remain a fool',
  ];
  return splitTextByPhrases(text, splits);
}

function processEldmireLines(lines) {
  const text = joinAllLines(lines);
  // For Eldmire, split on date lines and paragraph-starting sentences
  // We need to find dates and paragraph starts
  return text; // will be overridden per fragment
}

function process26() {
  let lines = readAndClean('eldmires-journal/fragment-xiii.md');
  if (lines[0].trim().match(/^Marshal Eldmire/)) lines.shift();
  while (lines.length && lines[0].trim() === '') lines.shift();
  if (lines[lines.length-1].trim() === 'Journal of Marshal Eldmire, Fragment XIII') lines.pop();
  while (lines.length && lines[lines.length-1].trim() === '') lines.pop();

  const text = joinAllLines(lines);
  const splits = [
    'The trail of Blackbeard has led us',
    'We ventured into the labyrinth',
    'The trap was sprung with a whisper',
    'The remaining five scrambled',
    'It is a cruel calculus,',
    'The path ahead stretches',
    'I press on, though each step',
    'The torches flicker as we move,',
  ];
  return splitTextByPhrases(text, splits);
}

function process27() {
  let lines = readAndClean('eldmires-journal/fragment-xiv.md');
  if (lines[0].trim().match(/^Marshal Eldmire/)) lines.shift();
  while (lines.length && lines[0].trim() === '') lines.shift();
  while (lines.length) {
    const last = lines[lines.length-1].trim();
    if (last === '' || last === 'Journal of Marshal Eldmire, Fragment XIV' ||
        last.match(/^\d{2} (January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/) ||
        last.match(/^\d{2}:\d{2}$/)) {
      lines.pop();
    } else break;
  }

  const text = joinAllLines(lines);
  const splits = [
    'The catacombs twist and churn,',
    'We lost Jareth first.',
    'The whispers started after that.',
    'Willem was the last.',
    'And now I am alone.',
    'The maze breathes.',
    'I see the Basilisk first,',
    'The Chimera looms next,',
    'The Griffon comes last,',
    'The constellations move',
    'I have reached the end,',
    'The maze has taken everything.',
    'It whispers still.',
  ];
  return splitTextByPhrases(text, splits);
}

function process28() {
  let lines = readAndClean('eldmires-journal/fragment-xv.md');
  if (lines[0].trim().match(/^Marshal Eldmire/)) lines.shift();
  while (lines.length && lines[0].trim() === '') lines.shift();
  while (lines.length) {
    const last = lines[lines.length-1].trim();
    if (last === '' || last === '...' || last === 'Journal of Marshal Eldmire, Fragment XV') {
      lines.pop();
    } else break;
  }

  const text = joinAllLines(lines);
  const splits = [
    'Here it is\u2014the great wheel of stone,',
    'Eirmont. The Warrior must be first.',
    'The chariot. Ankhmare, the conqueror,',
    'Then faith\u2014Ixion\u2019s Key.',
    'The final step.',
    '"Turn forward, turn back,',
    'The Hydra\u2019s coils tighten',
    'I place my hand on the wheel.',
    'Do I turn?',
    'The heavens spin.',
    'And the Warrior watches still.',
  ];
  return splitTextByPhrases(text, splits);
}

function processNithianFile(file, extraStrip) {
  let lines = readAndClean('nithian/' + file);
  if (extraStrip) {
    for (const s of extraStrip) {
      while (lines.length && lines[lines.length-1].trim() === '') lines.pop();
      if (lines.length && lines[lines.length-1].trim() === s) lines.pop();
    }
    while (lines.length && lines[lines.length-1].trim() === '') lines.pop();
  }
  return joinAllLines(lines);
}

function process29() {
  const text = processNithianFile('chronicles-of-nithian-triumphs.md');
  const splits = [
    'Let it be known to all generations',
    "In the Western Territories,",
    'A bold explorer of our empire,',
    'The Cursed One, roused from its eons-long slumber,',
    'It was by the divine gift of flame,',
    'When the fire had done its righteous work,',
    'This act of bravery and wisdom',
    'So it is written, so let it be known.',
    'Ptahmes, High Scribe',
  ];
  return splitTextByPhrases(text, splits);
}

function process30() {
  const text = processNithianFile('chronicles-of-the-sacred-scribes.md');
  const splits = [
    'In the times of antiquity,',
    'This monument, which came to be known',
    'To realize this hubristic vision,',
    'For years the tower rose,',
    'The gods, in their displeasure,',
    'And so, the Tower of Ra crumbled.',
    'The fall of the tower brought about',
    'Penned by High Scribe Amunherkhepeshef,',
  ];
  return splitTextByPhrases(text, splits);
}

function process31() {
  const text = processNithianFile('eternal-scrolls-of-nithian-law.md');
  const splits = [
    'Let it be known throughout the ages,',
    'The First Pillar: The Sanctity of Law',
    'The Second Pillar: The Majesty of Logic',
    'The Third Pillar: The Order of Hierarchy',
    'These pillars stand not alone',
    'So let it be written in the time',
    'Penned by High Scribe Maat-hor-neferu-Re',
  ];
  return splitTextByPhrases(text, splits);
}

function process32() {
  const text = processNithianFile('great-chronicles-of-nithia.md');
  const splits = [
    'In the era marked by the alignment',
    'Sethi, robed in the azure fabrics',
    'His mind was a labyrinth of schemes,',
    'The chronicles speak of his grandest deceit,',
    "Yet, let it be inscribed that Sethi\u2019s trickery",
    'In his pursuit of power and prestige,',
    "And so, Sethi\u2019s name was recorded",
    'Penned by the hand of Scribe Ankhu,',
  ];
  return splitTextByPhrases(text, splits);
}

function process33() {
  const text = processNithianFile('papyrus-of-timeless-solitudes.md');
  const splits = [
    'In the days of the ancients,',
    'Khaemwese, once a scribe',
    'It was told by those few',
    'The scrolls speak little of Khaemwese,',
    'In his silent vigil,',
    'And so, Khaemwese, the silent hermit,',
    'This account, penned by the hand',
  ];
  return splitTextByPhrases(text, splits);
}

function process34() {
  let text = processNithianFile('royal-annals-menkare.md', ['Enlightened', 'Royal Annals of the Court of Pharaoh Menkare the']);
  const splits = [
    'In the prosperous reign',
    'Aken-Aton, often garbed in the vibrant hues',
    'Though his demeanor was oft light-hearted,',
    'His tales, though wrapped in the guise',
    'Thus, Aken-Aton served as an unwitting oracle,',
    'It is said that Pharaoh Menkare himself,',
    'Thus, the royal court of our Pharaoh',
    'So has it been inscribed by the hand of I,',
  ];
  return splitTextByPhrases(text, splits);
}

function process35() {
  const text = processNithianFile('royal-records-of-nithia.md');
  const splits = [
    'In the reign of our sovereign,',
    'This noble chariot, the vehicle',
    'Upon its side panels were the exquisitely',
    'In battle, this celestial chariot bore',
    'In times of peace, the very same chariot,',
    'Let this record stand in testament',
    'Penned by the Royal Scribe, Tetmosis,',
  ];
  return splitTextByPhrases(text, splits);
}

function process36() {
  const text = processNithianFile('sacred-chronicles-of-the-lunar-oracle.md');
  const splits = [
    'In the Year of the Silver Flood,',
    'The Moon Seer, whose name was bestowed',
    'Her fame as an oracle grew,',
    'Iset the Enlightened spoke thus,',
    'The people of Nithia pondered her words,',
    'The Pharaohs, too, heeded',
    'Let this account of the Moon Seer',
  ];
  return splitTextByPhrases(text, splits);
}

function process37() {
  const text = processNithianFile('sacred-codex-of-nithian-theocracy.md');
  const splits = [
    'In the age of Pharaoh Menkaure the Divine,',
    'The High Priest of Osiris:',
    'The Council of Shadows:',
    'The Keepers of the Scales:',
    'The Embalmers and Anointers:',
    'The Chanters of Lamentations:',
    'The Acolytes of the Sacred Order:',
    'This structure, as decreed',
    'So it has been inscribed by I,',
  ];
  return splitTextByPhrases(text, splits);
}

function process38() {
  const text = processNithianFile('sacred-scrolls-of-eternal-nithia.md');
  const splits = [
    'In the Era of the Golden Sun,',
    'This Eye, crafted by the high priests',
    "Alas, the Eye\u2019s fate was as tumultuous",
    'The scrolls recount that the Chamber',
    'And thus, the Eye of Horon rests,',
    'This account is inscribed within',
    'May the Eye of Horon watch over us',
    'Ankhmises, High Scribe',
  ];
  return splitTextByPhrases(text, splits);
}

function process39() {
  let lines = readAndClean('nithian/tarot-of-nithia.md');
  lines = lines.filter(l => l.trim() !== 'Tarot of Nithia');
  return joinStructured(lines, 150);
}

function process40() {
  const text = processNithianFile('venerated-records-of-nithian-valor.md');
  const splits = [
    'In the season when the Great River Hapi',
    'Hemew was of no noble birth',
    'It was during the time of the Great Quake',
    'Hemew, who had sought shelter',
    'With nary a moment to spare',
    'The earth reclaimed Hemew',
    'Pharaoh Amenhotep the Benevolent,',
    'Let this account of Hemew',
    'Inscribed by the Royal Scribe, Amunemhat,',
  ];
  return splitTextByPhrases(text, splits);
}

// ==================== BUILD OUTPUT ====================

const entries = [
  { key: 14, title: 'A Mysterious Note', category: 'CAMPAIGN', image: 'a-mysterious-note.png', process: process14 },
  { key: 15, title: 'Diary of Jacques de Voulon', category: 'MISC', image: '', process: process15 },
  { key: 16, title: 'Elven Language', category: 'MISC', image: '', process: process16 },
  { key: 17, title: 'Journal of Einar Valen, Reedle', category: 'MISC', image: 'journal-of-einar-valen.jpeg', process: process17 },
  { key: 18, title: 'Journal of Gaius Marcellus', category: 'MISC', image: '', process: process18 },
  { key: 19, title: 'Mystaran Astrology', category: 'MISC', image: '', process: process19 },
  { key: 20, title: 'Mystaran Calendar', category: 'MISC', image: '', process: process20 },
  { key: 21, title: 'The Eight-Fold Way', category: 'MISC', image: '', process: process21 },
  { key: 22, title: 'The Key of Ixion', category: 'CAMPAIGN', image: 'the-key-of-ixion.jpeg', process: process22 },
  { key: 23, title: 'The Sacra Vindictae', category: 'CAMPAIGN', image: '', process: process23 },
  { key: 24, title: 'Town History of Nemiston', category: 'MISC', image: '', process: process24 },
  { key: 25, title: 'Vas Maleficarum', category: 'CAMPAIGN', image: 'vas-maleficarum.jpeg', process: process25 },
  { key: 26, title: "Marshal Eldmire's Journal - Fragment XIII", category: 'ELDMIRE', image: '', process: process26 },
  { key: 27, title: "Marshal Eldmire's Journal - Fragment XIV", category: 'ELDMIRE', image: '', process: process27 },
  { key: 28, title: "Marshal Eldmire's Journal - Fragment XV", category: 'ELDMIRE', image: '', process: process28 },
  { key: 29, title: 'The Chronicles of Nithian Triumphs', category: 'NITHIAN', image: '', process: process29 },
  { key: 30, title: 'Chronicles of the Sacred Scribes', category: 'NITHIAN', image: '', process: process30 },
  { key: 31, title: 'Eternal Scrolls of Nithian Law', category: 'NITHIAN', image: '', process: process31 },
  { key: 32, title: 'Great Chronicles of Nithia', category: 'NITHIAN', image: '', process: process32 },
  { key: 33, title: 'Papyrus of Timeless Solitudes', category: 'NITHIAN', image: '', process: process33 },
  { key: 34, title: 'Royal Annals of the Court of Pharaoh Menkare', category: 'NITHIAN', image: '', process: process34 },
  { key: 35, title: 'Royal Records of the Kingdom of Nithia', category: 'NITHIAN', image: '', process: process35 },
  { key: 36, title: 'Sacred Chronicles of the Lunar Oracle', category: 'NITHIAN', image: '', process: process36 },
  { key: 37, title: 'Sacred Codex of Nithian Theocracy', category: 'NITHIAN', image: '', process: process37 },
  { key: 38, title: 'Sacred Scrolls of Eternal Nithia', category: 'NITHIAN', image: '', process: process38 },
  { key: 39, title: 'Tarot of Nithia', category: 'NITHIAN', image: '', process: process39 },
  { key: 40, title: 'Venerated Records of Nithian Valor', category: 'NITHIAN', image: '', process: process40 },
];

let output = `const MISC = 'misc'
const CAMPAIGN = 'campaign'
const ELDMIRE = 'eldmire'
const NITHIAN = 'nithian'

export const NEW_LORE = [\n`;

for (const e of entries) {
  const content = e.process();

  const escaped = content
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n');

  const titleEscaped = e.title.replace(/'/g, "\\'");

  output += `  {\n`;
  output += `    key: ${e.key},\n`;
  output += `    title: '${titleEscaped}',\n`;
  output += `    dateFound: '',\n`;
  output += `    category: ${e.category},\n`;
  output += `    image: '${e.image}',\n`;
  output += `    content: '${escaped}',\n`;
  output += `  },\n`;
}

output += `]\n`;

fs.writeFileSync('D:/projects/northflank/theatreOftheMindNorth/src/pages/newLoreData.js', output, 'utf8');
console.log('Done! Written newLoreData.js');

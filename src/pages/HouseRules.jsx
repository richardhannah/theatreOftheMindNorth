import { useState } from 'react'
import './HouseRules.css'

const RULES = [
  {
    key: 'natural-healing',
    title: 'Natural Healing',
    content: (
      <>
        <p>
          The Rules Cyclopedia has no provision for natural healing, and rules in publications are scattered and somewhat inconsistent.
          Therefore these rules are what we will be using. You can heal naturally in two ways. By getting a good night's rest, or
          complete bed rest.
        </p>

        <h3>1. A good nights Rest</h3>
        <p>
          A good nights rest will restore 1 hit point. To get a good nights rest the character must sleep through the night
          with no interruption. Taking a watch or being woken by an attack will invalidate the good nights rest
        </p>

        <h3>2. Complete bed rest</h3>
        <p>
          To get the benefits of complete bed rest a character cannot take any action for a full day and night. The character
          must be in a safe place - such as the expedition camp, and cannot undertake any kind activity, including travelling.
        </p>
        <p>
          Complete bed rest will restore 1 hit point (for the good night's rest) plus the character's constitution bonus if
          they have one. In addition - a successful healing roll performed by a character with the healing skill will restore
          1d3 hit points
        </p>
        <p>After a week of complete bed rest - a character's hit points are fully restored.</p>
      </>
    ),
  },
  {
    key: 'initiative',
    title: 'Initiative',
    content: (
      <>
        <h3>Individual Combat</h3>
        <p>
          For individual combat, initiative is unchanged from the Rules Cyclopedia. Each combatant rolls 1d6 and adds any
          applicable bonuses from Dexterity, skills (such as Quick Draw), and special abilities (such as the Halfling
          initiative bonus). Highest total acts first.
        </p>

        <h3>Group Combat</h3>
        <p>
          Group combat uses a three-phase system to account for individual speed differences while keeping
          things moving quickly. Each round proceeds through three phases in order: Fast, Normal, and Slow.
        </p>
        <p>
          At the start of each round, group initiative is rolled as normal (1d6 per side) to determine which
          side acts first within each phase.
        </p>

        <h4>Fast Phase</h4>
        <p>
          Combatants with initiative bonuses (not including Dexterity) act in this phase. This includes
          characters who pass a Quick Draw check, Halflings using their racial initiative bonus, or anyone
          with a similar special ability that grants an initiative advantage.
        </p>

        <h4>Normal Phase</h4>
        <p>
          Combatants with no initiative adjustments act in this phase. This is where most characters and
          monsters will take their actions.
        </p>

        <h4>Slow Phase</h4>
        <p>
          Combatants with initiative penalties act in this phase. This includes characters wielding two-handed
          weapons, slow-moving monsters such as zombies, or anyone suffering from effects like delay.
        </p>

        <h3>Example</h3>
        <p>The party is fighting a group of orcs.</p>
        <p>
          Stevarn (an archer with Quick Draw) fires his bow, Dal Gilad casts a spell, and Auchter Ochle
          charges in with his two-handed axe. On the orc side, two orc archers fire shortbows, an orc shaman
          casts a spell, and the orc chieftain charges with a greataxe.
        </p>
        <p>Group initiative is rolled — the party wins.</p>

        <h4>Fast Phase</h4>
        <p>
          Stevarn passes his Quick Draw check, so he acts in the fast phase. He fires at the orc shaman and
          hits — crucially interrupting the shaman's spell before it can be cast.
        </p>
        <p>
          No orcs have initiative bonuses, so the opposing side has no actions in this phase.
        </p>

        <h4>Normal Phase</h4>
        <p>
          Dal Gilad's magic missile is unleashed at an orc archer, slaying it. The remaining orc archer returns
          fire at Auchter, landing a minor wound.
        </p>

        <h4>Slow Phase</h4>
        <p>
          Auchter Ochle (two-handed axe) strikes the orc chieftain (greataxe). Both are in the slow phase, but
          the party won initiative so Auchter acts first.
        </p>

        <h3>Deferring Actions</h3>
        <p>
          A character may defer their action to the next phase if they wish, perhaps to allow for better
          positioning or to see the results of allied combat actions before they act themselves. A deferred
          action moves to the next phase — fast to normal, or normal to slow. Actions cannot be deferred
          beyond the slow phase.
        </p>

        <h4>Example</h4>
        <p>
          The party has won initiative. Disenta Coltello would normally act in the normal phase, but decides
          to defer his action. The normal phase completes and all combat is resolved — resulting in one of
          the enemies being heavily wounded. In the slow phase, Coltello acts and strikes from the shadows
          with a successful backstab, slaying the weakened enemy. Deferring his action has allowed him to
          strike with maximum effect.
        </p>
      </>
    ),
  },
  {
    key: 'experience',
    title: 'Gaining Experience',
    content: (
      <>
        <p>
          In BECMI D&D, experience is earned by obtaining gold. In order to convert gold to experience points,
          the treasure must be brought to a <b>safe place</b>.
        </p>

        <h3>What is a Safe Place?</h3>
        <p>
          A safe place is defined as an area where the party can rest and recuperate without the expectation of
          being set upon by monsters or other villains at any given moment. Examples include:
        </p>
        <ul>
          <li>A town or village</li>
          <li>A remote fort or outpost</li>
          <li>The expedition campsite, provided it has a sufficient mercenary guard complement and is run
            by an Expedition Foreman</li>
        </ul>

        <h3>DM Discretion</h3>
        <p>
          Other locations may be designated as safe places at the DM's discretion. For instance, if while
          exploring a dungeon the party establishes friendly relations with cave-dwelling neanderthals, then
          their hearth could be designated as a safe place.
        </p>
      </>
    ),
  },
  {
    key: 'expedition-foreman',
    title: 'The Expedition Foreman',
    content: (
      <>
        <p>
          The Expedition Foreman is responsible for managing the day-to-day activities of the camp. He organises
          loading the wagons, managing the camp followers — teamsters, cooks, mercenaries and the like — and
          various other sundry activities so that the party can deal with more important things.
        </p>
        <p>
          The current Foreman of the expedition is <b>Grimnir StoneHelm</b>.
        </p>

        <h3>The Experience Bank</h3>
        <p>
          One crucial function the Expedition Foreman serves is what is known as the Experience Bank. With a
          foreman in place, the party can exchange their gold to bank it as experience. This banked experience
          can then be used to level up new characters joining the party, or keep occasional players up to a
          level where they are not outmatched.
        </p>
        <p>
          This is over and above experience gained from bringing treasure to a safe place, and actually involves
          the sacrifice of that treasure. This represents, in an abstract manner, the foreman developing contacts
          with local adventurers, or sponsoring the training of promising young candidates for the adventuring life.
        </p>
      </>
    ),
  },
  {
    key: 'free-skills',
    title: 'Free Skills by Class',
    content: (
      <>
        <p>
          In the Fortune &amp; Glory campaign, every character receives a free Knowledge skill depending on their
          class. These skills support the campaign's themes and give each class a unique area of scholarly expertise.
        </p>

        <h3>Cleric — Knowledge (Theology)</h3>
        <p>
          Reflects a character's scholarly understanding of divine entities, religious lore, and sacred rituals.
          Clerics use this skill to interpret holy scriptures, recognise religious symbols, and conduct appropriate
          ceremonial practices. It is essential for discerning the deeper meanings of their faith and gaining
          insight into other religions they may encounter. In gameplay, this skill can be crucial for identifying
          holy artifacts, understanding the history of religious sites, and engaging effectively with followers
          of other deities.
        </p>

        <h3>Fighter — Knowledge (Military History)</h3>
        <p>
          Signifies a fighter's study of historic conflicts, famous war tactics, and legendary military figures.
          A fighter can use this skill to analyse combat strategies and draw inspiration from past battles,
          allowing them to potentially anticipate an enemy's manoeuvres or exploit their weaknesses during combat.
          A successful roll in a battle situation grants a +1 bonus to any subsequent use of the Military Tactics skill.
        </p>

        <h3>Magic-User — Knowledge (Arcane Lore)</h3>
        <p>
          Represents a wizard's extensive understanding of magical theories, spells, magical creatures, and
          mystical artifacts. This expertise is crucial for spellcasting from scrolls and deciphering magical
          texts. A successful skill use allows a spellcaster to read a magical scroll as per the spell <i>Read
          Magic</i>, however a failure causes the scroll to be consumed as though it were cast. Most mages will
          prefer to use a <i>Read Magic</i> spell to avoid the risk.
        </p>
        <p>
          <b>Special note:</b> A thief who learns this skill can avoid the effects of a backfire when casting
          from a scroll. The casting is still lost, but any unexpected results are negated.
        </p>

        <h3>Thief — Knowledge (Black Markets)</h3>
        <p>
          Embodies a thief's familiarity with the underworld's clandestine trade networks. It enables them to
          navigate illegal markets, identify contraband, and connect with shadowy figures for illicit goods
          and information.
        </p>

        <h3>Elf — Knowledge (Fey Lore)</h3>
        <p>
          Denotes an elf's intrinsic understanding of fey creatures, their magical customs, the domains they
          inhabit, and the intricate social dynamics of their courts. It equips elves with insights to navigate
          interactions with these mystical beings and the enchanted realms they dwell in.
        </p>

        <h3>Dwarf — Knowledge (Deep Lore)</h3>
        <p>
          Signifies a dwarf's profound grasp of ancient histories, subterranean geology, and the long-forgotten
          secrets buried beneath the earth. This skill aids dwarves in uncovering and interpreting the mysteries
          and legacies hidden deep within mountains and underground realms.
        </p>

        <h3>Halfling — Knowledge (Folklore)</h3>
        <p>
          Reflects a halfling's rich understanding of local legends, cultural tales, and traditional wisdom. It
          enables them to glean insights about a community's customs, beliefs, and superstitions, often aiding
          in social interactions and understanding the deeper context of the places they visit.
        </p>

        <h3>Mystic — Knowledge (Draconic Lore)</h3>
        <p>
          Indicates a mystic's deep understanding of dragons, encompassing their ancient history, diverse species,
          mystical properties, and the arcane secrets they guard. This knowledge allows mystics to better
          comprehend and interact with these majestic and powerful creatures. There is much debate in magical
          circles regarding the source of a Mystic's power, with many suggesting it may be draconic in origin
          due to their deep knowledge of Draconic Lore.
        </p>
      </>
    ),
  },
]

function HouseRules() {
  const [selected, setSelected] = useState(RULES[0])

  return (
    <div className="houserules-page">
      <nav className="houserules-sidebar">
        {RULES.map((rule) => (
          <button
            key={rule.key}
            className={`houserules-nav-btn ${selected.key === rule.key ? 'active' : ''}`}
            onClick={() => setSelected(rule)}
          >
            {rule.title}
          </button>
        ))}
      </nav>
      <article className="houserules-content">
        <h1>{selected.title}</h1>
        {selected.content}
      </article>
    </div>
  )
}

export default HouseRules

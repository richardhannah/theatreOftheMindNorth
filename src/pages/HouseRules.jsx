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

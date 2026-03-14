import './HouseRules.css'

function HouseRules() {
  return (
    <div className="house-rules">
      <h2>Natural Healing</h2>

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
        1d3 hit pints
      </p>
      <p>After a week of complete bed rest - a character's hit points are fully restored.</p>

      <h2>Initiative</h2>

      <p>
        Initiative is a perrenial problem in D&D. Individual initiative becomes cumbersome in large combats, whereas group
        initiative, while fast, is not fine grained enough imo.
      </p>

      <p>
        To resolve this I propose that initiative is applied on each phase in the order of combat (pg 102 of RC). This should
        allow for individual bonuses to take effect, spellcasting interruptions, and sensibly resolve initiative penalties
        imposed by two handed weapons and delay effects.
      </p>

      <p>
        For this to work there must be a declaration of intent at the start of the round as to which phase of the order of
        combat each combatant intends to act on. (Missile, Magic or Hand to Hand)
      </p>

      <p>
        Group initiative is rolled, and each phase is resolved with the winning side acting first.
      </p>

      <p>Eg.</p>

      <p>The party is fighting a group of orcs. Assuming morale checks have passed and each side is ready to fight</p>
      <p>
        Stevarn opts to use his bow, while Dal Gilad intends to cast magic missile, Auchter Ochle wishes to charge forward to
        engage his hated opponents in melee combat.
      </p>
      <p>The orcs separate into 3 groups</p>

      <ul>
        <li>2 of them use shortbows to attack the party</li>
        <li>An orc shaman prepares his foul magic</li>
        <li>The orc cheiftan and the remaining 2 orcs howl and charge forward brandishing their weapons</li>
      </ul>

      <p>At this point Initiative is rolled. In this case - the party wins the initiative and moves first in each phase.</p>

      <h4>Movement phase</h4>

      <h5>Winning side:</h5>
      <ul>
        <li>Stevarn moves to the side to take advantage of some cover and get a better line of sight on the enemy</li>
        <li>Dal Gilad is preparing to cast - and may not move or his spell is ruined.</li>
        <li>Auchter ochle runs forward to meet the enemy.</li>
      </ul>

      <h5>Losing side:</h5>
      <ul>
        <li>The 2 orcs with bows stay where they are and take aim</li>
        <li>The shaman is casting and may not move</li>
        <li>The chief and remaining orcs move to engage Auchter Ochle.</li>
      </ul>

      <h4>Missile Combat:</h4>

      <h5>Winning side:</h5>
      <p>
        Stevarn fires his bow at the orc shaman. With a roll of 19 he hits! Crucially this interrupts the shaman's spell and
        it is lost.
      </p>

      <h5>Losing side:</h5>
      <p>
        The 2 orcs then fire. One of them fires at Auchter while the other fires at Dal Gilad. Auchter is hit and suffers a
        minor wound, But Dal Gilads armour protects him while he casts his spell.
      </p>

      <h4>Magic:</h4>

      <h5>Winning side:</h5>
      <p>
        Dal Gilads magic missile is unleashed - he directs it at the orc archer who shot at him - slaying the vile beast
      </p>

      <h5>Losing side:</h5>
      <p>The Orc shaman's spell has been interrupted however and he loses his turn</p>

      <h4>Melee:</h4>

      <h5>Winning side:</h5>
      <p>
        Auchter Ochle in a rare display of skill strikes at an orc with his axe - slaying it instantly. Quickly he turns his
        sword shield on the other orc who charged forward - and drives a blade into its belly also killing it.
      </p>

      <h5>Losing side:</h5>
      <p>
        This leaves only the Orc chieftan remaining who can now strike at Auchter Ochle with his wicked Scimitar.
      </p>

      <h4>Notes:</h4>
      <p>
        This system will also help to support situations where combatants have individual initiative bonuses or penalties.
      </p>

      <p>
        Eg. Characters with the Quick draw skill have a +2 initiative bonus in individual combat. In this system if he
        passes his quick draw check - he can nock and fire an arrow first even if he was on the losing side. This is for one
        attack only. If he is able to fire multiple times (eg. If under the effects of a haste spell) then any remaining
        attacks occur in the normal initiative order.
      </p>
      <p>
        On the melee side of things - Rules as written typically state that combatants using 2 handed weapons always
        initiative so we can break the hand to hand combat phase into 2 sections. All participants wielding one handed weapons
        act first. Then all 2 handed weapon users.
      </p>
      <p>
        If a combatant is suffering special effect such as delay then they act dead last - after all other melee fighters
        have acted.
      </p>

      <p>To support this new system 3 new general skills will be added.</p>

      <p>
        <b>Quick Strike (Dexterity):</b> Same as the quick draw skill, but for melee weapons. Again one attack only may be used to
        strike first.
      </p>
      <p>
        <b>Quick Cast (Dexterity):</b> Same as quick draw but for magic. Favoured by magical duellists to cast first and interrupt
        their opponents spells.
      </p>
      <p>
        <b>Concentration (Intelligence):</b> Allows a magic user to avoid the effects of an interruption and allow him to continue
        casting.
      </p>
    </div>
  )
}

export default HouseRules


import { Profession, Stat, ICombatWeightedSkillChoice } from '../../interfaces';
import { Attack, RegenerateHP, RegenerateSpecial } from './all';
import { Targets, EffectsPerTarget, Description, Accuracy, StatMod, Targetting, Delay, Duration, NumberOfTargets, CombatEffect } from '../skillcomponents';
import { RandomNumber } from '../skillcomponents/RandomNumber';

/**
 * These skills always happen. All of them. Each round. Used for regen effects and the like.
 */
export const ProfessionPreRoundSkillMap: { [key in Profession]: ICombatWeightedSkillChoice[] } = {
  [Profession.Archer]: [
  ],

  [Profession.Barbarian]: [
    { skills: [RegenerateHP(caster => caster.maxStats[Stat.HP] / 20)] }
  ],

  [Profession.Bard]: [
    { skills: [RegenerateSpecial(1)],
      canUse: (caster, combat) => combat.currentRound % 3 === 1
                               && caster.stats[Stat.SPECIAL] < caster.maxStats[Stat.SPECIAL] }
  ],

  [Profession.Bitomancer]: [
  ],

  [Profession.Cleric]: [
    { skills: [RegenerateSpecial((caster) => caster.stats[Stat.INT] / 20)],
      canUse: (caster, combat) => caster.stats[Stat.SPECIAL] < caster.maxStats[Stat.SPECIAL] }
  ],

  [Profession.Fighter]: [
    { skills: [RegenerateHP(caster => (caster.maxStats[Stat.HP] - caster.stats[Stat.HP]) / 20)] }
  ],

  [Profession.Generalist]: [
    { skills: [RegenerateHP(caster => (caster.maxStats[Stat.HP] - caster.stats[Stat.HP]) / 100)] }
  ],

  [Profession.Jester]: [
  ],

  [Profession.Mage]: [
    { skills: [RegenerateSpecial((caster) => caster.maxStats[Stat.SPECIAL] / 20)],
      canUse: (caster, combat) => caster.stats[Stat.SPECIAL] < caster.maxStats[Stat.SPECIAL] }
  ],

  [Profession.MagicalMonster]: [
  ],

  [Profession.Monster]: [
    { skills: [RegenerateHP(caster => caster.maxStats[Stat.HP] / 100)] }
  ],

  [Profession.Necromancer]: [
  ],

  [Profession.Pirate]: [
    { skills: [RegenerateHP(caster => (caster.maxStats[Stat.HP] - caster.stats[Stat.HP]) / 10)] }
  ],

  [Profession.Rogue]: [
    { skills: [RegenerateSpecial(5)], canUse: (caster, combat) => caster.stats[Stat.SPECIAL] < caster.maxStats[Stat.SPECIAL] }
  ],

  [Profession.SandwichArtist]: [
  ]
};

/**
 * These abilities are locked to player professions.
 */
export const ProfessionSkillMap: { [key in Profession]: ICombatWeightedSkillChoice[] } = {
  [Profession.Archer]: [
    { weight: 1, skills: [Attack(
      (attacker) => attacker.stats[Stat.DEX],
      (attacker) => attacker.stats[Stat.DEX] * 0.75
    )] },

    // strong shot
    { weight: 4, canUse: (caster) => caster.stats[Stat.SPECIAL] >= 2, skills: [
      [
        Targets(Targetting.Self), EffectsPerTarget(1),
        StatMod(Stat.SPECIAL, -2)
      ],
      [
        Targets(Targetting.SingleEnemy), EffectsPerTarget(1), Accuracy(90),
        Description('%source shot a strong arrow at %target and dealt %value damage!'),
        StatMod(Stat.HP, RandomNumber(
          (caster) => (caster.stats[Stat.DEX] + caster.stats[Stat.STR]) * 0.25,
          (caster) => (caster.stats[Stat.DEX] + caster.stats[Stat.STR])
        ))
      ]
    ] },

    // spreadshot
    { weight: 2,
      canUse: (caster, combat) => {
        const numTargets = NumberOfTargets(Targetting.AllEnemies, caster, combat);
        return numTargets > 1 && caster.stats[Stat.SPECIAL] >= numTargets;
      },
      skills: [
        [
          Targets(Targetting.Self), EffectsPerTarget(1),
          StatMod(Stat.SPECIAL, (caster, target, combat) => -NumberOfTargets(Targetting.AllEnemies, caster, combat))
        ],
        [
          Targets(Targetting.AllEnemies), EffectsPerTarget(1), Accuracy(90),
          Description('%source shot many arrows; one hit %target and dealt %value damage!'),
          StatMod(Stat.HP, RandomNumber(
            (caster) => (caster.stats[Stat.DEX] + caster.stats[Stat.STR]) * 0.5,
            (caster) => (caster.stats[Stat.DEX] + caster.stats[Stat.STR]) * 0.7
          ))
        ]
    ] },

    // relentless assault
    { weight: 2,
      canUse: (caster, combat) => caster.stats[Stat.SPECIAL] >= 20,
      skills: [
        [
          Targets(Targetting.Self), EffectsPerTarget(1),
          StatMod(Stat.SPECIAL, -20)
        ],
        ...Array(20).fill([
          Targets(Targetting.SingleEnemy), EffectsPerTarget(1), Accuracy(50),
          Description('%source unleased a relentless assault on %target and dealt %value damage!'),
          StatMod(Stat.HP, RandomNumber(
            (caster) => (caster.stats[Stat.DEX] + caster.stats[Stat.STR]) * 0.1,
            (caster) => (caster.stats[Stat.DEX] + caster.stats[Stat.STR]) * 0.15
          ))
        ])
    ] },
  ],

  [Profession.Barbarian]: [
    { weight: 1, skills: [
      Attack(
        (attacker) => attacker.stats[Stat.STR] * 0.25,
        (attacker) => attacker.stats[Stat.STR] * 1.5
      ),
      [
        Targets(Targetting.Self), EffectsPerTarget(1),
        StatMod(Stat.SPECIAL, 5)
      ]
    ] },

    // enrage
    { weight: 4, canUse: (caster) => caster.stats[Stat.SPECIAL] <= caster.maxStats[Stat.SPECIAL], skills: [
      [
        Targets(Targetting.Self), EffectsPerTarget(1),
        Description('%source flew into a wild rage!'),
        StatMod(Stat.SPECIAL, 10)
      ]
    ] },

    // rage strike
    { weight: 2, canUse: (caster) => caster.stats[Stat.SPECIAL] >= caster.maxStats[Stat.SPECIAL] / 5, skills: [
      [
        Targets(Targetting.Self), EffectsPerTarget(1),
        StatMod(Stat.SPECIAL, (caster) => -caster.stats[Stat.SPECIAL])
      ],
      [
        Targets(Targetting.SingleEnemy), EffectsPerTarget(1), Accuracy(80),
        Description('%source unleashed an enraged attack on %target and dealt %value damage!'),
        StatMod(Stat.HP, (caster, target) => -caster.stats[Stat.STR] * (1 + 1 / caster.stats[Stat.SPECIAL]))
      ]
    ] },

    // rage boost
    { weight: 2, canUse: (caster) => caster.stats[Stat.SPECIAL] >= caster.maxStats[Stat.SPECIAL] / 5, skills: [
      [
        Targets(Targetting.Self), EffectsPerTarget(1),
        StatMod(Stat.SPECIAL, (caster) => -caster.stats[Stat.SPECIAL])
      ],
      [
        Targets(Targetting.Self), EffectsPerTarget(1), Accuracy(100),
        Description('%source enraged their muscles!'),
        StatMod(Stat.STR, (caster, target) => caster.stats[Stat.STR] * (1 / caster.stats[Stat.SPECIAL]))
      ]
    ] },
  ],

  [Profession.Bard]: [
    { weight: 1, skills: [Attack()] },

    // litany of pain
    { weight: 3, canUse: (caster) => caster.stats[Stat.SPECIAL] > 0, skills: [
      [
        Targets(Targetting.Self), EffectsPerTarget(1),
        Description('%source sang a Litany of Pain!'),
        StatMod(Stat.SPECIAL, -1)
      ],
      [
        Targets(Targetting.AllEnemies), EffectsPerTarget(1), Delay(2), Duration(3), Accuracy(90),
        Description('%source sang a Litany of Pain for %target and dealt %value damage!'),
        StatMod(Stat.HP, (caster, target) => -target.maxStats[Stat.HP] / 20)
      ]
    ] },

    // light from the stars
    { weight: 3, canUse: (caster) => caster.stats[Stat.SPECIAL] > 0, skills: [
      [
        Targets(Targetting.Self), EffectsPerTarget(1),
        Description('%source sang under the Light of the Stars!'),
        StatMod(Stat.SPECIAL, -1)
      ],
      [
        Targets(Targetting.AllAllies), EffectsPerTarget(1), Delay(2), Duration(3), Accuracy(95),
        Description('%source sang under the Light of the Stars for %target and healed %value health!'),
        StatMod(Stat.HP, (caster, target) => target.maxStats[Stat.HP] / 3)
      ]
    ] },

    // our hearts ignite
    { weight: 3, canUse: (caster) => caster.stats[Stat.SPECIAL] > 0, skills: [
      [
        Targets(Targetting.Self), EffectsPerTarget(1),
        Description('%source sang a song to Ignite Their Hearts!'),
        StatMod(Stat.SPECIAL, -1)
      ],
      [
        Targets(Targetting.AllAllies), EffectsPerTarget(1), Delay(2),
        Description('%source sang a song to Ignite Their Hearts for %target and increased their CON, STR, and INT!'),
      ],
      [
        Targets(Targetting.AllAllies), EffectsPerTarget(1), Delay(2),
        StatMod(Stat.STR, (caster, target) => target.maxStats[Stat.STR] / 10)
      ],
      [
        Targets(Targetting.AllAllies), EffectsPerTarget(1), Delay(2),
        StatMod(Stat.CON, (caster, target) => target.maxStats[Stat.CON] / 10)
      ],
      [
        Targets(Targetting.AllAllies), EffectsPerTarget(1), Delay(2),
        StatMod(Stat.INT, (caster, target) => target.maxStats[Stat.INT] / 10)
      ]
    ] }
  ],

  [Profession.Bitomancer]: [
    { weight: 1, skills: [Attack()] },

    // hack time
    { weight: 1, canUse: (caster) => caster.stats[Stat.SPECIAL] >= 4, skills: [
      [
        Targets(Targetting.Self), EffectsPerTarget(1),
        StatMod(Stat.SPECIAL, -4)
      ],
      [
        Targets(Targetting.Self), EffectsPerTarget(1), Accuracy(100),
        Description('%source hacked time!'),
        CombatEffect((combat) => combat.currentRound += 5)
      ]
    ] },

    // bit (scales in damage from powers of 2, base of int), freeleech (target int -10%, my int + lost int)
  ],

  [Profession.Cleric]: [
    { weight: 1, skills: [Attack(
      1,
      (attacker) => attacker.stats[Stat.STR] * 0.5
    )] }

    // revive (dead ally, 10% cost 50%), heal (ally, int, cost 5%, only works if any allys unhurt), holybolt (target, int, cost 5%), regen int/20
  ],

  [Profession.Fighter]: [
    { weight: 1, skills: [Attack(
      (attacker) => attacker.stats[Stat.STR] * 0.1,
      (attacker) => attacker.stats[Stat.STR]
    )] }

    // double strike (same target 2x), self str + 10% of max, multistrike (aoe, X random hits, 60% damage per hit)
  ],

  [Profession.Generalist]: [
    { weight: 1, skills: [Attack(
      1,
      (attacker) => (attacker.stats[Stat.STR] + attacker.stats[Stat.DEX] + attacker.stats[Stat.INT]
                   + attacker.stats[Stat.CON] + attacker.stats[Stat.AGI] + attacker.stats[Stat.LUK]) / 6
    )] }

    // aoe all (all stats avg), buff all for one person (all stats, 5% of their max), heal all (5% of max)
  ],

  [Profession.Jester]: [
    { weight: 1, skills: [Attack(
      1,
      (attacker) => attacker.stats[Stat.LUK] * 0.5
    )] }

    // aoe luk boost 25% for allies, -25% for foes, randomly heal or damage people based on LUK, 25% chance to hit for luk*5, 75% chance to miss
  ],

  [Profession.Mage]: [
    { weight: 1, skills: [Attack(
      (attacker) => attacker.stats[Stat.INT] * 0.25,
      (attacker) => attacker.stats[Stat.INT] * 0.75
    )] }

    // fireball X times (int*0.5...int cost 10%), frostbite (single target, high damage, dex/agi debuff 5%, cost 15%), self int +10% of max,regen 5%
  ],

  [Profession.MagicalMonster]: [
    { weight: 1, skills: [Attack()] }

    // mini fireball, mini cure, mini drain, regen 1% (all free)
  ],

  [Profession.Monster]: [
    { weight: 1, skills: [Attack()] }

    // self hp boost (20% of max, heal half of it), deal damage based on hp and take 10% of damage back, self skill to heal 5% hp
  ],

  [Profession.Necromancer]: [
    { weight: 1, skills: [Attack()] }

    // (all stats -5%, one enemy, cost 5% hp), drain int hp, regen it, summon minion (cost 1 minion), regen 2%
  ],

  [Profession.Pirate]: [
    { weight: 1, skills: [Attack(
      (attacker) => attacker.stats[Stat.STR] * 0.25,
      (attacker) => attacker.stats[Stat.STR] * 1.5
    )] }

    // boost all ally str +10% of my max, throw bottles (random amount of bottles thrown, each deals 1% of target hp), vomit (recovers bottles, does aoe damage based on con req 25% bottles gone)
  ],

  [Profession.Rogue]: [
    { weight: 1, skills: [Attack(
      (attacker) => (attacker.stats[Stat.DEX] + attacker.stats[Stat.AGI] / 2) * 0.1,
      (attacker) => (attacker.stats[Stat.DEX] + attacker.stats[Stat.AGI] / 2)
    )] }

    // poison stab: dex damage + dex/str/agi debuff (cost: 10), smoke bomb (all enemies -20% dex/agi for 3 turns) (cost: 30), recover (+15 energy)
  ],

  [Profession.SandwichArtist]: [
    { weight: 1, skills: [Attack()] }

    // food fight (Attack everyone, +- random stats 5%), burnt sandwich (attack enemy with a sandwich for dex damage, lasts X turns), feed sandwich (heal/buff (con) ally)
  ]
};

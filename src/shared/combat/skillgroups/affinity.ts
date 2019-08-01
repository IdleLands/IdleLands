
import { PetAffinity, ICombatWeightedSkillChoice, Stat } from '../../interfaces';
import { Attack } from './all';
import { NumberOfTargets, EffectsPerTarget, Targets, Targetting, StatMod, Accuracy,
  Description, RandomNumber, SameTarget, Delay, Duration } from '../skillcomponents';

/**
 * These abilities are locked to pets of a certain attribute.
 */
export const AffinitySkillMap: { [key in PetAffinity]: ICombatWeightedSkillChoice[] } = {
  [PetAffinity.None]: [
    { weight: 1, skills: [Attack()] }
  ],

  [PetAffinity.Attacker]: [
    { weight: 7, skills: [Attack()] },

    // double attack
    { weight: 3, skills: [
      [
        Targets(Targetting.SingleEnemy), EffectsPerTarget(2), Accuracy(75),
        Description('%source attacked %target for %value damage!'),
        StatMod(Stat.HP, RandomNumber(
          (attacker) => attacker.stats[Stat.STR] * 0.1,
          (attacker) => attacker.stats[Stat.STR] * 0.9)
        )
      ]
    ] },

    // wild swing
    { weight: 1, skills: [
      [
        Targets(Targetting.SingleEnemy), EffectsPerTarget(1), Accuracy(25),
        StatMod(Stat.LUK, RandomNumber(
          (caster) => caster.stats[Stat.STR] * 3,
          (caster) => caster.stats[Stat.STR] * 5
        )),
        Description('%source threw a wild swing at %target which dealt %value damage!'),
      ]
    ] },
  ],

  [PetAffinity.Buffer]: [
    { weight: 10, skills: [Attack()] },

    // fortify dex/agi/con
    { weight: 1, skills: [
      [
        Targets(Targetting.SingleAlly), EffectsPerTarget(1),
        StatMod(Stat.AGI, (caster, target) => target.maxStats[Stat.AGI] / 20),
        Description('%source boosted %target\'s AGI by %value!'),
      ],
      [
        Targets(Targetting.SingleAlly), EffectsPerTarget(1),
        StatMod(Stat.DEX, (caster, target) => target.maxStats[Stat.DEX] / 20),
        Description('%source boosted %target\'s DEX by %value!'),
      ],
      [
        Targets(Targetting.SingleAlly), EffectsPerTarget(1),
        StatMod(Stat.CON, (caster, target) => target.maxStats[Stat.CON] / 20),
        Description('%source boosted %target\'s CON by %value!'),
      ]
    ] },

    // fortify int/str/luk
    { weight: 1, skills: [
      [
        Targets(Targetting.SingleAlly), EffectsPerTarget(1),
        StatMod(Stat.STR, (caster, target) => target.maxStats[Stat.STR] / 20),
        Description('%source boosted %target\'s STR by %value!'),
      ],
      [
        Targets(Targetting.SingleAlly), EffectsPerTarget(1),
        StatMod(Stat.INT, (caster, target) => target.maxStats[Stat.INT] / 20),
        Description('%source boosted %target\'s INT by %value!'),
      ],
      [
        Targets(Targetting.SingleAlly), EffectsPerTarget(1),
        StatMod(Stat.LUK, (caster, target) => target.maxStats[Stat.LUK] / 20),
        Description('%source boosted %target\'s LUK by %value!'),
      ]
    ] },
  ],

  [PetAffinity.Caster]: [
    { weight: 10, skills: [Attack()] },

    // firestorm
    { weight: 5,
      canUse: (caster) => caster.stats[Stat.SPECIAL] >= caster.maxStats[Stat.SPECIAL] / 10,
      skills: [
        [
          Targets(Targetting.Self), EffectsPerTarget(1),
          StatMod(Stat.SPECIAL, (caster) => -caster.maxStats[Stat.SPECIAL] / 10)
        ],
        ...Array(3).fill([
          Targets(Targetting.SingleEnemy), EffectsPerTarget(1), Accuracy(85),
          Description('%source flung a fire pebble at %target and dealt %value damage!'),
          StatMod(Stat.HP, RandomNumber(
            (caster) => caster.stats[Stat.INT] * 0.5,
            (caster) => caster.stats[Stat.INT] * 0.7
          ))
        ])
    ] },

    // drain
    { weight: 3,
      canUse: (caster) => caster.stats[Stat.HP] >= caster.maxStats[Stat.HP] / 20,
      skills: (combat, caster) => {

        const damage = combat.chance.integer({
          min: caster.stats[Stat.INT] * 0.1,
          max: caster.stats[Stat.INT] * 0.5
        });

        return [
          [
            Targets(Targetting.Self), EffectsPerTarget(1),
            StatMod(Stat.HP, damage)
          ],
          [
            Targets(Targetting.SingleEnemy), EffectsPerTarget(1), Accuracy(90),
            Description('%source drained %target of %value of their health!'),
            StatMod(Stat.HP, () => -damage)
          ]
        ];
    } },
  ],

  [PetAffinity.Defender]: [
    { weight: 10, skills: [Attack()] },

    // darkside
    { weight: 3,
      canUse: (caster) => caster.stats[Stat.HP] > 10,
      skills: [
        [
          Targets(Targetting.Self), EffectsPerTarget(1),
          StatMod(Stat.HP, (caster) => -caster.stats[Stat.HP] * 0.1)
        ],
        [
          Targets(Targetting.SingleEnemy), EffectsPerTarget(1), Accuracy(90),
          Description('%source unleashed their dark side on %target and dealt %value damage!'),
          StatMod(Stat.HP, (caster) => -caster.stats[Stat.HP] * 0.3)
        ]
    ] },

    // relentless assault
    { weight: 1,
      canUse: (caster) => caster.stats[Stat.HP] > 10,
      skills: [
        [
          Targets(Targetting.Self), EffectsPerTarget(1),
          StatMod(Stat.HP, (caster) => -caster.stats[Stat.HP] * 0.3)
        ],
        ...Array(10).fill([
          Targets(Targetting.SingleEnemy), EffectsPerTarget(1), Accuracy(50),
          Description('%source unleased a relentless assault on %target and dealt %value damage!'),
          StatMod(Stat.HP, RandomNumber(
            (caster) => (caster.stats[Stat.CON] + caster.stats[Stat.STR]) * 0.05,
            (caster) => (caster.stats[Stat.CON] + caster.stats[Stat.STR]) * 0.1
          ))
        ])
    ] },
  ],

  [PetAffinity.Healer]: [
    { weight: 10, skills: [Attack()] },

    // heal
    { weight: 5,
      canUse: (caster, combat) => caster.stats[Stat.SPECIAL] >= caster.maxStats[Stat.SPECIAL] / 10
                               && NumberOfTargets(Targetting.InjuredAlly, caster, combat) > 0,
      skills: [
        [
          Targets(Targetting.Self), EffectsPerTarget(1),
          StatMod(Stat.SPECIAL, (caster) => -caster.stats[Stat.SPECIAL] / 10)
        ],
        [
          Targets(Targetting.InjuredAlly), EffectsPerTarget(1), Accuracy(90),
          Description('%source surrounded %target with a holy aura and healed %value health!'),
          StatMod(Stat.HP, RandomNumber(
            (caster) => caster.stats[Stat.INT] * 2.0,
            (caster) => caster.stats[Stat.INT] * 3.0,
            true
          ))
        ]
    ] },

    // revive
    { weight: 1,
      canUse: (caster, combat) => caster.stats[Stat.SPECIAL] >= caster.maxStats[Stat.SPECIAL] / 20
                               && NumberOfTargets(Targetting.DeadAlly, caster, combat) > 0,
      skills: [
        [
          Targets(Targetting.Self), EffectsPerTarget(1),
          StatMod(Stat.SPECIAL, (caster) => -caster.stats[Stat.SPECIAL] / 20)
        ],
        [
          Targets(Targetting.DeadAlly), EffectsPerTarget(1), Accuracy(100),
          Description('%source revived %target from their untimely demise!'),
          StatMod(Stat.HP, (caster, target) => Math.max(1, target.maxStats[Stat.HP] / 20))
        ]
    ] },
  ],

  [PetAffinity.Hunter]: [
    { weight: 10, skills: [Attack()] },

    // fire burn
    { weight: 4,
      skills: [
        [
          Targets(Targetting.SingleEnemy),
          SameTarget(
            [
              EffectsPerTarget(1), Accuracy(90),
              Description('%source forced %target to eat a burnt lettuce head which dealt %value damage!'),
              StatMod(Stat.HP, RandomNumber(
                (caster) => caster.stats[Stat.STR] * 0.7,
                (caster) => caster.stats[Stat.STR] * 1.3
              ))
            ],
            [
              EffectsPerTarget(1), Accuracy(90), Delay(1), Duration(RandomNumber(1, 3)),
              Description('%target took %value heartburn damage from %source\'s burnt lettuce head!'),
              StatMod(Stat.HP, RandomNumber(
                (caster, target) => target.stats[Stat.CON] * 0.3,
                (caster, target) => target.stats[Stat.CON] * 0.4
              ))
            ]
          )
        ]
    ] },

    // poison bite
    { weight: 2,
      canUse: (caster, combat) => caster.stats[Stat.HP] >= caster.stats[Stat.HP] / 10,
      skills: [
        [
          Targets(Targetting.Self), EffectsPerTarget(1),
          StatMod(Stat.HP, (caster, combat) => -caster.stats[Stat.HP] / 10)
        ],
        [
          Targets(Targetting.SingleEnemy),
          SameTarget(
            [
              EffectsPerTarget(1), Accuracy(90),
              Description('%source bit %target with poison fangs and dealt %value damage!'),
              StatMod(Stat.HP, RandomNumber(
                (caster) => caster.stats[Stat.DEX] * 1.0,
                (caster) => caster.stats[Stat.DEX] * 2.0
              ))
            ],
            [
              EffectsPerTarget(1), Accuracy(90), Delay(1), Duration(5),
              Description('%target took %value damage from %source\'s poison bite!'),
              StatMod(Stat.HP, RandomNumber(
                (caster) => caster.stats[Stat.DEX] * 0.4,
                (caster) => caster.stats[Stat.DEX] * 0.6
              ))
            ]
          )
        ]
    ] },
  ]
};

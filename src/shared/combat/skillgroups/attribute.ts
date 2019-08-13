
import { PetAttribute, ICombatWeightedSkillChoice, Stat } from '../../interfaces';
import { NumberOfTargets, EffectsPerTarget, Targets, Targetting, StatMod, Accuracy,
  Description, RandomNumber, SameTarget, Delay, Duration } from '../skillcomponents';

/**
 * These abilities are locked to 5* pets per their attribute.
 */
export const AttributeSkillMap: { [key in PetAttribute]: ICombatWeightedSkillChoice[] } = {
  [PetAttribute.Alchemist]: [
    { weight: 1,
      canUse: (caster) => caster.stats[Stat.SPECIAL] > 30,
      skills: [
        [
          Targets(Targetting.Self), EffectsPerTarget(1),
          StatMod(Stat.SPECIAL, -30)
        ],
        [
          Targets(Targetting.AllEnemies), EffectsPerTarget(1),
          Description('%source threw a stat-confusion potion at %target!')
        ],
        [
          Targets(Targetting.AllEnemies), EffectsPerTarget(1),
          StatMod(Stat.STR, (caster, target) => -target.stats[Stat.STR] * 0.2)
        ],
        [
          Targets(Targetting.AllEnemies), EffectsPerTarget(1),
          StatMod(Stat.INT, (caster, target) => -target.stats[Stat.INT] * 0.2)
        ]
    ] }
  ],

  [PetAttribute.Blessed]: [
    // revive
    { weight: 1,
      canUse: (caster, combat) => NumberOfTargets(Targetting.DeadAlly, caster, combat) > 0,
      skills: [
        [
          Targets(Targetting.DeadAlly), EffectsPerTarget(1), Accuracy(100),
          Description('%source revived %target from their untimely demise!'),
          StatMod(Stat.HP, (caster, target) => Math.max(1, target.maxStats[Stat.HP] / 100))
        ]
    ] },
  ],

  [PetAttribute.Cursed]: [
    // life force bomb
    { weight: 1,
      canUse: (caster) => caster.stats[Stat.HP] > 10,
      skills: [
        [
          Targets(Targetting.Self), EffectsPerTarget(1),
          StatMod(Stat.HP, (caster) => -caster.stats[Stat.HP] * 0.3)
        ],
        [
          Targets(Targetting.SingleEnemy), EffectsPerTarget(1), Accuracy(80),
          Description('%source channeled a massive life force bomb at %target and dealt %value damage!'),
          StatMod(Stat.HP, (caster) => -caster.stats[Stat.HP] * 0.7)
        ]
    ] },
  ],

  [PetAttribute.Ferocious]: [
    { weight: 1,
      skills: [
        [
          Targets(Targetting.SingleEnemy),
          SameTarget(
            [
              EffectsPerTarget(1), Accuracy(90),
              Description('%source bit %target with poison fangs and dealt %value damage!'),
              StatMod(Stat.HP, RandomNumber(
                (caster) => caster.stats[Stat.DEX] * 2.0,
                (caster) => caster.stats[Stat.DEX] * 2.5
              ))
            ],
            [
              EffectsPerTarget(1), Accuracy(90), Delay(1), Duration(5),
              Description('%target took %value damage from %source\'s poison!'),
              StatMod(Stat.HP, RandomNumber(
                (caster) => caster.stats[Stat.DEX] * 0.5,
                (caster) => caster.stats[Stat.DEX] * 0.8
              ))
            ]
          )
        ]
    ] },
  ],

  [PetAttribute.Fateful]: [
    { weight: 1, skills: [
      [
        Targets(Targetting.Self), EffectsPerTarget(1),
        Description('%source cried out in terror!'),
        StatMod(Stat.SPECIAL, -1)
      ],
      [
        Targets(Targetting.AllEnemies), EffectsPerTarget(1), Delay(1), Duration(2), Accuracy(90),
        Description('%source cried out in terror at %target and dealt %value damage!'),
        StatMod(Stat.HP, (caster, target) => -target.maxStats[Stat.HP] / 10)
      ]
    ] },
  ],

  [PetAttribute.Golden]: [
    { weight: 4,
      skills: [
        [
          Targets(Targetting.SingleAlly),
          SameTarget(
            [
              EffectsPerTarget(1), Accuracy(100),
              Description('%source fed a golden leaf to %target which healed %value health!'),
              StatMod(Stat.HP, RandomNumber(
                (caster) => caster.stats[Stat.CON] * 4.0,
                (caster) => caster.stats[Stat.CON] * 5.5,
                true
              ))
            ],
            [
              EffectsPerTarget(1), Accuracy(100),
              StatMod(Stat.CON, RandomNumber(
                (caster) => caster.stats[Stat.CON] * 2.5,
                (caster) => caster.stats[Stat.CON] * 3.5
              ))
            ]
          )
        ]
    ] },
  ],

  [PetAttribute.Surging]: [
    // frostbite
    { weight: 1,
      skills: [
        [
          Targets(Targetting.SingleEnemy),
          SameTarget(
            [
              EffectsPerTarget(1),
              Description('%source shot a lance of energy through %target and dealt %value damage!'),
              StatMod(Stat.HP, RandomNumber(
                (caster) => caster.stats[Stat.INT] * 3.5,
                (caster) => caster.stats[Stat.INT] * 4.0
              ))
            ],
            [
              EffectsPerTarget(1),
              StatMod(Stat.DEX, (caster, target) => target.maxStats[Stat.DEX] / 10)
            ],
            [
              EffectsPerTarget(1),
              StatMod(Stat.AGI, (caster, target) => target.maxStats[Stat.AGI] / 10)
            ],
            [
              EffectsPerTarget(1),
              StatMod(Stat.INT, (caster, target) => target.maxStats[Stat.INT] / 10)
            ],
            [
              EffectsPerTarget(1),
              StatMod(Stat.STR, (caster, target) => target.maxStats[Stat.STR] / 10)
            ],
            [
              EffectsPerTarget(1),
              StatMod(Stat.LUK, (caster, target) => target.maxStats[Stat.LUK] / 10)
            ],
            [
              EffectsPerTarget(1),
              StatMod(Stat.CON, (caster, target) => target.maxStats[Stat.CON] / 10)
            ]
          )
        ]
    ] },
  ],

  [PetAttribute.Trueseer]: [
    { weight: 1, skills: [
      [
      Targets(Targetting.SingleAlly),
        SameTarget(
          [
            EffectsPerTarget(1),
            StatMod(Stat.STR, (caster, target) => target.maxStats[Stat.STR] / 10),
            Description('%source saw the future STR of %target and helped by boosting it by %value!'),
          ],
          [
            EffectsPerTarget(1),
            StatMod(Stat.INT, (caster, target) => target.maxStats[Stat.INT] / 10),
            Description('%source saw the future INT of %target and helped by boosting it by %value!'),
          ],
          [
            EffectsPerTarget(1),
            StatMod(Stat.AGI, (caster, target) => target.maxStats[Stat.AGI] / 10),
            Description('%source saw the future AGI of %target and helped by boosting it by %value!'),
          ],
          [
            EffectsPerTarget(1),
            StatMod(Stat.DEX, (caster, target) => target.maxStats[Stat.DEX] / 10),
            Description('%source saw the future DEX of %target and helped by boosting it by %value!'),
          ],
          [
            EffectsPerTarget(1),
            StatMod(Stat.CON, (caster, target) => target.maxStats[Stat.CON] / 10),
            Description('%source saw the future CON of %target and helped by boosting it by %value!'),
          ],
          [
            EffectsPerTarget(1),
            StatMod(Stat.LUK, (caster, target) => target.maxStats[Stat.LUK] / 10),
            Description('%source saw the future LUK of %target and helped by boosting it by %value!'),
          ]
        )
      ]
    ] },
  ]
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b, _c;
var interfaces_1 = require("../../interfaces");
var all_1 = require("./all");
var skillcomponents_1 = require("../skillcomponents");
var Immediate_1 = require("../skillcomponents/Immediate");
/**
 * These skills always happen. All of them. Each round. Used for regen effects and the like.
 */
exports.ProfessionPreRoundSkillMap = (_a = {},
    _a[interfaces_1.Profession.Archer] = [],
    _a[interfaces_1.Profession.Barbarian] = [
        { skills: [all_1.RegenerateHP(function (caster) { return caster.maxStats[interfaces_1.Stat.HP] / 20; })],
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.HP] < caster.maxStats[interfaces_1.Stat.HP]; } }
    ],
    _a[interfaces_1.Profession.Bard] = [
        { skills: [all_1.RegenerateSpecial(1)],
            canUse: function (caster, combat) { return combat.currentRound % 3 === 1
                && caster.stats[interfaces_1.Stat.SPECIAL] < caster.maxStats[interfaces_1.Stat.SPECIAL]; } }
    ],
    _a[interfaces_1.Profession.Bitomancer] = [],
    _a[interfaces_1.Profession.Cleric] = [
        { skills: [all_1.RegenerateSpecial(function (caster) { return caster.stats[interfaces_1.Stat.INT] / 20; })],
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.SPECIAL] < caster.maxStats[interfaces_1.Stat.SPECIAL]; } }
    ],
    _a[interfaces_1.Profession.Fighter] = [
        { skills: [all_1.RegenerateHP(function (caster) { return (caster.maxStats[interfaces_1.Stat.HP] - caster.stats[interfaces_1.Stat.HP]) / 20; })],
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.HP] < caster.maxStats[interfaces_1.Stat.HP]; } }
    ],
    _a[interfaces_1.Profession.Generalist] = [
        { skills: [all_1.RegenerateHP(function (caster) { return (caster.maxStats[interfaces_1.Stat.HP] - caster.stats[interfaces_1.Stat.HP]) / 100; })],
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.HP] < caster.maxStats[interfaces_1.Stat.HP]; } }
    ],
    _a[interfaces_1.Profession.Jester] = [],
    _a[interfaces_1.Profession.Mage] = [
        { skills: [all_1.RegenerateSpecial(function (caster) { return caster.maxStats[interfaces_1.Stat.SPECIAL] / 20; })],
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.SPECIAL] < caster.maxStats[interfaces_1.Stat.SPECIAL]; } }
    ],
    _a[interfaces_1.Profession.MagicalMonster] = [],
    _a[interfaces_1.Profession.Monster] = [
        { skills: [all_1.RegenerateHP(function (caster) { return caster.maxStats[interfaces_1.Stat.HP] / 100; })],
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.HP] < caster.maxStats[interfaces_1.Stat.HP]; } }
    ],
    _a[interfaces_1.Profession.Necromancer] = [
        { skills: [all_1.RegenerateHP(function (caster) { return (caster.maxStats[interfaces_1.Stat.HP] - caster.stats[interfaces_1.Stat.HP]) / 1; })],
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.HP] < caster.maxStats[interfaces_1.Stat.HP]; } }
    ],
    _a[interfaces_1.Profession.Pirate] = [
        { skills: [all_1.RegenerateHP(function (caster) { return (caster.maxStats[interfaces_1.Stat.HP] - caster.stats[interfaces_1.Stat.HP]) / 10; })],
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.HP] < caster.maxStats[interfaces_1.Stat.HP]; } }
    ],
    _a[interfaces_1.Profession.Rogue] = [
        { skills: [all_1.RegenerateSpecial(5)], canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.SPECIAL] < caster.maxStats[interfaces_1.Stat.SPECIAL]; } }
    ],
    _a[interfaces_1.Profession.SandwichArtist] = [],
    _a);
/**
 * These skills also always happen, just at the end of the round. Mostly to sync numbers.
 */
exports.ProfessionPostRoundSkillMap = (_b = {},
    _b[interfaces_1.Profession.Archer] = [],
    _b[interfaces_1.Profession.Barbarian] = [],
    _b[interfaces_1.Profession.Bard] = [],
    _b[interfaces_1.Profession.Bitomancer] = [],
    _b[interfaces_1.Profession.Cleric] = [],
    _b[interfaces_1.Profession.Fighter] = [],
    _b[interfaces_1.Profession.Generalist] = [],
    _b[interfaces_1.Profession.Jester] = [],
    _b[interfaces_1.Profession.Mage] = [],
    _b[interfaces_1.Profession.MagicalMonster] = [],
    _b[interfaces_1.Profession.Monster] = [],
    _b[interfaces_1.Profession.Necromancer] = [
        // set special to # minions
        { skills: [all_1.RegenerateSpecial(function (skill, caster, combat) {
                    var cur = caster.stats[interfaces_1.Stat.SPECIAL];
                    var setTo = Object.values(combat.characters).filter(function (x) { return x.summonerId === caster.combatId; }).length;
                    return setTo - cur;
                }, true)] }
    ],
    _b[interfaces_1.Profession.Pirate] = [],
    _b[interfaces_1.Profession.Rogue] = [],
    _b[interfaces_1.Profession.SandwichArtist] = [],
    _b);
/**
 * These abilities are locked to player professions.
 */
exports.ProfessionSkillMap = (_c = {},
    _c[interfaces_1.Profession.Archer] = [
        { weight: 3, skills: [all_1.Attack(function (attacker) { return attacker.stats[interfaces_1.Stat.DEX]; }, function (attacker) { return attacker.stats[interfaces_1.Stat.DEX] * 0.75; })] },
        // strong shot
        { weight: 4, canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] >= 2; }, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, -2)
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                    skillcomponents_1.Description('%source shot a strong arrow at %target and dealt %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return (caster.stats[interfaces_1.Stat.DEX] + caster.stats[interfaces_1.Stat.STR]) * 0.25; }, function (caster) { return (caster.stats[interfaces_1.Stat.DEX] + caster.stats[interfaces_1.Stat.STR]); }))
                ]
            ] },
        // spreadshot
        { weight: 2,
            canUse: function (caster, combat) {
                var numTargets = skillcomponents_1.NumberOfTargets(skillcomponents_1.Targetting.AllEnemies, caster, combat);
                return numTargets > 1 && caster.stats[interfaces_1.Stat.SPECIAL] >= numTargets;
            },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster, target, combat) { return -skillcomponents_1.NumberOfTargets(skillcomponents_1.Targetting.AllEnemies, caster, combat); })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                    skillcomponents_1.Description('%source shot many arrows; one hit %target and dealt %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return (caster.stats[interfaces_1.Stat.DEX] + caster.stats[interfaces_1.Stat.STR]) * 0.5; }, function (caster) { return (caster.stats[interfaces_1.Stat.DEX] + caster.stats[interfaces_1.Stat.STR]) * 0.7; }))
                ]
            ] },
        // relentless assault
        { weight: 2,
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.SPECIAL] >= 20; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, -20)
                ]
            ].concat(Array(20).fill([
                skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(50),
                skillcomponents_1.Description('%source unleashed a relentless assault on %target and dealt %value damage!'),
                skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return (caster.stats[interfaces_1.Stat.DEX] + caster.stats[interfaces_1.Stat.STR]) * 0.1; }, function (caster) { return (caster.stats[interfaces_1.Stat.DEX] + caster.stats[interfaces_1.Stat.STR]) * 0.15; }))
            ])) },
    ],
    _c[interfaces_1.Profession.Barbarian] = [
        { weight: 3, skills: [
                all_1.Attack(function (attacker) { return attacker.stats[interfaces_1.Stat.STR] * 0.25; }, function (attacker) { return attacker.stats[interfaces_1.Stat.STR] * 1.5; }),
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, 5)
                ]
            ] },
        // enrage
        { weight: 2, canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] <= caster.maxStats[interfaces_1.Stat.SPECIAL]; }, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source flew into a wild rage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, 10)
                ]
            ] },
        // rage strike
        { weight: 3, canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] >= caster.maxStats[interfaces_1.Stat.SPECIAL] / 5; }, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return -caster.stats[interfaces_1.Stat.SPECIAL]; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(80),
                    skillcomponents_1.Description('%source unleashed an enraged attack on %target and dealt %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster, target) { return -caster.stats[interfaces_1.Stat.STR] * (1 + 1 / caster.stats[interfaces_1.Stat.SPECIAL]); })
                ]
            ] },
        // rage boost
        { weight: 2, canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] >= caster.maxStats[interfaces_1.Stat.SPECIAL] / 5; }, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return -caster.stats[interfaces_1.Stat.SPECIAL]; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(100),
                    skillcomponents_1.Description('%source enraged their muscles!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.STR, function (caster, target) { return caster.stats[interfaces_1.Stat.STR] * (1 / caster.stats[interfaces_1.Stat.SPECIAL]); })
                ]
            ] },
    ],
    _c[interfaces_1.Profession.Bard] = [
        { weight: 2, skills: [all_1.Attack()] },
        // litany of pain
        { weight: 3, canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] > 0; }, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source sang a Litany of Pain!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, -1)
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Delay(2), skillcomponents_1.Duration(3), skillcomponents_1.Accuracy(90),
                    skillcomponents_1.Description('%source sang a Litany of Pain for %target and dealt %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster, target) { return -target.maxStats[interfaces_1.Stat.HP] / 20; })
                ]
            ] },
        // light from the stars
        { weight: 3, canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] > 0; }, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source sang under the Light of the Stars!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, -1)
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllAllies), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Delay(2), skillcomponents_1.Duration(3), skillcomponents_1.Accuracy(95),
                    skillcomponents_1.Description('%source sang under the Light of the Stars for %target and healed %value health!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster, target) { return target.maxStats[interfaces_1.Stat.HP] / 3; })
                ]
            ] },
        // our hearts ignite
        { weight: 3, canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] > 0; }, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source sang a song to Ignite Their Hearts!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, -1)
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllAllies), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Delay(2),
                    skillcomponents_1.Description('%source sang a song to Ignite Their Hearts for %target and increased their CON, STR, and INT!'),
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllAllies), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Delay(2),
                    skillcomponents_1.StatMod(interfaces_1.Stat.STR, function (caster, target) { return target.maxStats[interfaces_1.Stat.STR] / 10; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllAllies), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Delay(2),
                    skillcomponents_1.StatMod(interfaces_1.Stat.CON, function (caster, target) { return target.maxStats[interfaces_1.Stat.CON] / 10; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllAllies), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Delay(2),
                    skillcomponents_1.StatMod(interfaces_1.Stat.INT, function (caster, target) { return target.maxStats[interfaces_1.Stat.INT] / 10; })
                ]
            ] }
    ],
    _c[interfaces_1.Profession.Bitomancer] = [
        { weight: 3, skills: [all_1.Attack()] },
        // hack time
        { weight: 1, canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] >= 128; }, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, -128)
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source hacked time!'),
                    skillcomponents_1.CombatEffect(function (combat) { return combat.currentRound += 5; })
                ]
            ] },
        // take a byte
        { weight: 3, canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] > 0; }, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return -caster.stats[interfaces_1.Stat.SPECIAL]; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                    skillcomponents_1.Description('%source took a byte out of %target and dealt %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL]; })
                ]
            ] },
        // freeleech
        { weight: 2, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return caster.maxStats[interfaces_1.Stat.INT] / 10; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(80),
                    skillcomponents_1.Description('%source freeleeched %value INT from %target!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.INT, function (caster, target) { return -target.maxStats[interfaces_1.Stat.INT] / 10; })
                ]
            ] }
    ],
    _c[interfaces_1.Profession.Cleric] = [
        { weight: 2, skills: [all_1.Attack(1, function (attacker) { return attacker.stats[interfaces_1.Stat.STR] * 0.5; })] },
        // holy bolt
        { weight: 3,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] >= caster.maxStats[interfaces_1.Stat.SPECIAL] / 10; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return -caster.maxStats[interfaces_1.Stat.SPECIAL] / 10; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                    skillcomponents_1.Description('%source flung a holy bolt at %target and dealt %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.INT] * 1.5; }, function (caster) { return caster.stats[interfaces_1.Stat.INT] * 2.0; }))
                ]
            ] },
        // heal
        { weight: 2,
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.SPECIAL] >= caster.maxStats[interfaces_1.Stat.SPECIAL] / 20
                && skillcomponents_1.NumberOfTargets(skillcomponents_1.Targetting.InjuredAlly, caster, combat) > 0; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return -caster.maxStats[interfaces_1.Stat.SPECIAL] / 20; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.InjuredAlly), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                    skillcomponents_1.Description('%source surrounded %target with a holy aura and healed %value health!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.INT] * 2.0; }, function (caster) { return caster.stats[interfaces_1.Stat.INT] * 3.0; }, true))
                ]
            ] },
        // revive
        { weight: 2,
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.SPECIAL] >= caster.maxStats[interfaces_1.Stat.SPECIAL] / 3
                && skillcomponents_1.NumberOfTargets(skillcomponents_1.Targetting.DeadAlly, caster, combat) > 0; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return -caster.maxStats[interfaces_1.Stat.SPECIAL] / 3; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.DeadAlly), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(100),
                    skillcomponents_1.Description('%source revived %target from their untimely demise!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster, target) { return Math.max(1, target.maxStats[interfaces_1.Stat.HP] / 10); })
                ]
            ] },
    ],
    _c[interfaces_1.Profession.Fighter] = [
        { weight: 4, skills: [all_1.Attack(function (attacker) { return attacker.stats[interfaces_1.Stat.STR] * 0.1; }, function (attacker) { return attacker.stats[interfaces_1.Stat.STR]; })] },
        // double attack
        { weight: 2, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(2), skillcomponents_1.Accuracy(75),
                    skillcomponents_1.Description('%source attacked %target for %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (attacker) { return attacker.stats[interfaces_1.Stat.STR] * 0.1; }, function (attacker) { return attacker.stats[interfaces_1.Stat.STR] * 0.9; }))
                ]
            ] },
        // wild arms
        { weight: 2, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source bulked up and gained %value STR!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.STR, function (caster) { return caster.maxStats[interfaces_1.Stat.STR] / 10; })
                ]
            ] },
        // multistrike
        { weight: 2,
            skills: Array(5).fill([
                skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(50),
                skillcomponents_1.Description('%source began swinging wildly at %target and dealt %value damage!'),
                skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.STR] * 0.7; }, function (caster) { return caster.stats[interfaces_1.Stat.STR] * 0.9; }))
            ]).slice() }
    ],
    _c[interfaces_1.Profession.Generalist] = [
        { weight: 3, skills: [all_1.Attack(1, function (attacker) { return (attacker.stats[interfaces_1.Stat.STR] + attacker.stats[interfaces_1.Stat.DEX] + attacker.stats[interfaces_1.Stat.INT]
                    + attacker.stats[interfaces_1.Stat.CON] + attacker.stats[interfaces_1.Stat.AGI] + attacker.stats[interfaces_1.Stat.LUK]) / 6; })] },
        // sweeping generalization
        { weight: 2,
            canUse: function (caster, combat) { return skillcomponents_1.NumberOfTargets(skillcomponents_1.Targetting.AllEnemies, caster, combat) > 1; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                    skillcomponents_1.Description('%source hit %target with a sweeping generalization and dealt %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return (caster.stats[interfaces_1.Stat.STR] + caster.stats[interfaces_1.Stat.DEX] + caster.stats[interfaces_1.Stat.INT]
                        + caster.stats[interfaces_1.Stat.CON] + caster.stats[interfaces_1.Stat.AGI] + caster.stats[interfaces_1.Stat.LUK]) / 12; }, function (caster) { return (caster.stats[interfaces_1.Stat.STR] + caster.stats[interfaces_1.Stat.DEX] + caster.stats[interfaces_1.Stat.INT]
                        + caster.stats[interfaces_1.Stat.CON] + caster.stats[interfaces_1.Stat.AGI] + caster.stats[interfaces_1.Stat.LUK]) / 4; }))
                ]
            ] },
        // fortify
        { weight: 1, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.STR, function (caster, target) { return target.maxStats[interfaces_1.Stat.STR] / 20; }),
                    skillcomponents_1.Description('%source swept %target under the rug and boosted their STR by %value!'),
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.INT, function (caster, target) { return target.maxStats[interfaces_1.Stat.INT] / 20; }),
                    skillcomponents_1.Description('%source swept %target under the rug and boosted their INT by %value!'),
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.AGI, function (caster, target) { return target.maxStats[interfaces_1.Stat.AGI] / 20; }),
                    skillcomponents_1.Description('%source swept %target under the rug and boosted their AGI by %value!'),
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.DEX, function (caster, target) { return target.maxStats[interfaces_1.Stat.DEX] / 20; }),
                    skillcomponents_1.Description('%source swept %target under the rug and boosted their DEX by %value!'),
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.CON, function (caster, target) { return target.maxStats[interfaces_1.Stat.CON] / 20; }),
                    skillcomponents_1.Description('%source swept %target under the rug and boosted their CON by %value!'),
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.LUK, function (caster, target) { return target.maxStats[interfaces_1.Stat.LUK] / 20; }),
                    skillcomponents_1.Description('%source swept %target under the rug and boosted their LUK by %value!'),
                ]
            ] },
        // restore
        { weight: 2, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllAllies), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(95),
                    skillcomponents_1.Description('%source let out a sweeping sigh and healed %target for %value health!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster, target) { return target.maxStats[interfaces_1.Stat.HP] / 20; })
                ]
            ] },
    ],
    _c[interfaces_1.Profession.Jester] = [
        { weight: 3, skills: [all_1.Attack(1, function (attacker) { return attacker.stats[interfaces_1.Stat.LUK] * 0.5; })] },
        // luck surge
        { weight: 1, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllAllies), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.LUK, function (caster, target) { return target.maxStats[interfaces_1.Stat.LUK] / 20; }),
                    skillcomponents_1.Description('%source surged their immense luck into %target, boosting their LUK by %value!'),
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.LUK, function (caster, target) { return target.maxStats[interfaces_1.Stat.LUK] / 20; }),
                    skillcomponents_1.Description('%source surged their immense luck through %target, decreasing their LUK by %value!'),
                ]
            ] },
        // luck roulette
        { weight: 2, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.All), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return -caster.stats[interfaces_1.Stat.LUK]; }, function (caster) { return caster.stats[interfaces_1.Stat.LUK]; }, true)),
                    skillcomponents_1.Description('%source rolled the dice for %target, modifying their HP by %rvalue!'),
                ]
            ] },
        // lucky slap
        { weight: 2, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(25),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.LUK] * 3; }, function (caster) { return caster.stats[interfaces_1.Stat.LUK] * 5; })),
                    skillcomponents_1.Description('%source slapped %target which dealt %value damage!'),
                ]
            ] },
    ],
    _c[interfaces_1.Profession.Mage] = [
        { weight: 2, skills: [all_1.Attack(function (attacker) { return attacker.stats[interfaces_1.Stat.INT] * 0.25; }, function (attacker) { return attacker.stats[interfaces_1.Stat.INT] * 0.75; })] },
        // firestorm
        { weight: 2,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] >= caster.maxStats[interfaces_1.Stat.SPECIAL] / 10; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return -caster.maxStats[interfaces_1.Stat.SPECIAL] / 10; })
                ]
            ].concat(Array(5).fill([
                skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(75),
                skillcomponents_1.Description('%source flung a fireball at %target and dealt %value damage!'),
                skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.INT] * 0.5; }, function (caster) { return caster.stats[interfaces_1.Stat.INT]; }))
            ])) },
        // frostbite
        { weight: 2,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] >= caster.maxStats[interfaces_1.Stat.SPECIAL] / 15; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return -caster.maxStats[interfaces_1.Stat.SPECIAL] / 15; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy),
                    skillcomponents_1.SameTarget([
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.Description('%source gave %target frostbite and dealt %value damage!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.INT] * 1.5; }, function (caster) { return caster.stats[interfaces_1.Stat.INT] * 2.0; }))
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.DEX, function (caster, target) { return target.maxStats[interfaces_1.Stat.DEX] / 5; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.AGI, function (caster, target) { return target.maxStats[interfaces_1.Stat.AGI] / 5; })
                    ])
                ]
            ] },
        // wild brain
        { weight: 1, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source brained up and gained %value INT!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.INT, function (caster) { return caster.maxStats[interfaces_1.Stat.INT] / 10; })
                ]
            ] },
    ],
    _c[interfaces_1.Profession.MagicalMonster] = [
        { weight: 3, skills: [all_1.Attack()] },
        // drain stats
        { weight: 3,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.HP] >= caster.maxStats[interfaces_1.Stat.HP] / 100; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster) { return -caster.maxStats[interfaces_1.Stat.HP] / 100; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy),
                    skillcomponents_1.SameTarget([
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.Description('%source drained %target of their stats!')
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.STR, function (caster, target) { return target.maxStats[interfaces_1.Stat.STR] / 50; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.INT, function (caster, target) { return target.maxStats[interfaces_1.Stat.INT] / 50; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.AGI, function (caster, target) { return target.maxStats[interfaces_1.Stat.AGI] / 50; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.DEX, function (caster, target) { return target.maxStats[interfaces_1.Stat.DEX] / 50; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.CON, function (caster, target) { return target.maxStats[interfaces_1.Stat.CON] / 50; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.LUK, function (caster, target) { return target.maxStats[interfaces_1.Stat.LUK] / 50; })
                    ])
                ]
            ] },
        // heal
        { weight: 2,
            canUse: function (caster, combat) { return skillcomponents_1.NumberOfTargets(skillcomponents_1.Targetting.InjuredAlly, caster, combat) > 0; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return -caster.maxStats[interfaces_1.Stat.SPECIAL] / 20; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.InjuredAlly), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                    skillcomponents_1.Description('%source surrounded %target with a holy aura and healed %value health!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.INT] * 1.0; }, function (caster) { return caster.stats[interfaces_1.Stat.INT] * 1.5; }, true))
                ]
            ] },
        // firestorm
        { weight: 2,
            skills: Array(3).fill([
                skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(75),
                skillcomponents_1.Description('%source flung a fireball at %target and dealt %value damage!'),
                skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.INT] * 0.3; }, function (caster) { return caster.stats[interfaces_1.Stat.INT] * 0.8; }))
            ]).slice() }
    ],
    _c[interfaces_1.Profession.Monster] = [
        { weight: 3, skills: [all_1.Attack()] },
        // darkside
        { weight: 3,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.HP] > 10; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster) { return -caster.stats[interfaces_1.Stat.HP] * 0.1; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                    skillcomponents_1.Description('%source unleashed their dark side on %target and dealt %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster) { return -caster.stats[interfaces_1.Stat.HP] * 0.3; })
                ]
            ] },
        // self heal
        { weight: 2,
            canUse: function (caster, combat) { return skillcomponents_1.NumberOfTargets(skillcomponents_1.Targetting.InjuredSelf, caster, combat) > 0; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source went into stasis and recovered %value health!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster) { return caster.maxStats[interfaces_1.Stat.HP] / 20; })
                ]
            ] },
        // life force bomb
        { weight: 1,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.HP] > 10; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster) { return -caster.stats[interfaces_1.Stat.HP] * 0.5; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(80),
                    skillcomponents_1.Description('%source channeled a massive life force bomb at %target and dealt %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster) { return -caster.stats[interfaces_1.Stat.HP] * 0.5; })
                ]
            ] },
    ],
    _c[interfaces_1.Profession.Necromancer] = [
        { weight: 5, skills: [all_1.Attack()] },
        // drain stats
        { weight: 2,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.HP] >= caster.maxStats[interfaces_1.Stat.HP] / 20; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster) { return -caster.maxStats[interfaces_1.Stat.HP] / 20; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy),
                    skillcomponents_1.SameTarget([
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.Description('%source drained %target of their stats!')
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.STR, function (caster, target) { return target.maxStats[interfaces_1.Stat.STR] / 20; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.INT, function (caster, target) { return target.maxStats[interfaces_1.Stat.INT] / 20; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.AGI, function (caster, target) { return target.maxStats[interfaces_1.Stat.AGI] / 20; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.DEX, function (caster, target) { return target.maxStats[interfaces_1.Stat.DEX] / 20; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.CON, function (caster, target) { return target.maxStats[interfaces_1.Stat.CON] / 20; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.LUK, function (caster, target) { return target.maxStats[interfaces_1.Stat.LUK] / 20; })
                    ])
                ]
            ] },
        // drain hp
        { weight: 3,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.HP] >= caster.maxStats[interfaces_1.Stat.HP] / 20; },
            skills: function (combat, caster) {
                // 1+ because otherwise if it does (min, max) and they're both 0 it throws
                var min = caster.stats[interfaces_1.Stat.INT] * 0.1;
                var damage = combat.chance.integer({
                    min: min,
                    max: Math.max(min + 1, (caster.stats[interfaces_1.Stat.INT] * 0.5))
                });
                return [
                    [
                        skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, damage)
                    ],
                    [
                        skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                        skillcomponents_1.Description('%source drained %target of %value of their health!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, function () { return -damage; })
                    ]
                ];
            } },
        // summon
        { weight: 1,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] < caster.maxStats[interfaces_1.Stat.SPECIAL]; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source summmoned a minion!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, 1)
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.CombatEffect(all_1.SummonCreature(0.3))
                ]
            ] }
    ],
    _c[interfaces_1.Profession.Pirate] = [
        { weight: 3, skills: [all_1.Attack(function (attacker) { return attacker.stats[interfaces_1.Stat.STR] * 0.25; }, function (attacker) { return attacker.stats[interfaces_1.Stat.STR] * 1.5; })] },
        // wild arms 2: pirate boogaloo
        { weight: 2,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] >= caster.maxStats[interfaces_1.Stat.SPECIAL] / 10; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return -caster.maxStats[interfaces_1.Stat.SPECIAL] / 10; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%target got fed spinach beer by %source and gained %value STR!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.STR, function (caster) { return caster.maxStats[interfaces_1.Stat.STR] / 10; })
                ]
            ] },
        // vomit
        { weight: 3,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] <= caster.maxStats[interfaces_1.Stat.SPECIAL] * 0.35; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return caster.maxStats[interfaces_1.Stat.SPECIAL] * 0.2; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source vomited all over %target dealing %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.CON]; }, function (caster) { return caster.stats[interfaces_1.Stat.CON] * 2.0; }))
                ]
            ] },
        // throw bottles
        { weight: 3,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] > 50; },
            skills: function (combat) {
                var bottleCount = combat.chance.integer({ min: 10, max: 50 });
                return [
                    [
                        skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, -bottleCount)
                    ],
                    [
                        skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.Description("%source threw " + bottleCount + " empty bottles at %target dealing %value damage!"),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster, target) { return target.stats[interfaces_1.Stat.HP] * (bottleCount / 200); })
                    ]
                ];
            }
        },
    ],
    _c[interfaces_1.Profession.Rogue] = [
        { weight: 4, skills: [all_1.Attack(function (attacker) { return (attacker.stats[interfaces_1.Stat.DEX] + attacker.stats[interfaces_1.Stat.AGI] / 2) * 0.1; }, function (attacker) { return (attacker.stats[interfaces_1.Stat.DEX] + attacker.stats[interfaces_1.Stat.AGI] / 2); })] },
        // poison stab
        { weight: 2,
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.SPECIAL] >= 15; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, -15)
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy),
                    skillcomponents_1.SameTarget([
                        skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                        skillcomponents_1.Description('%source stabbed %target with a poison dagger and dealt %value damage!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.DEX] * 1.0; }, function (caster) { return caster.stats[interfaces_1.Stat.DEX] * 1.5; }))
                    ], [
                        skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90), skillcomponents_1.Delay(1), skillcomponents_1.Duration(10),
                        skillcomponents_1.Description('%target took %value damage from %source\'s poison!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.DEX] * 0.4; }, function (caster) { return caster.stats[interfaces_1.Stat.DEX] * 0.6; }))
                    ])
                ]
            ] },
        // self recover
        { weight: 3,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] < 20; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source took a quick nap and recovered %value energy!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, 15)
                ]
            ] },
        // smoke bomb
        { weight: 2,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] > 30; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, -30)
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source threw a smoke bomb at %target!')
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.DEX, function (caster, target) { return -target.stats[interfaces_1.Stat.DEX] * 0.2; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.AGI, function (caster, target) { return -target.stats[interfaces_1.Stat.AGI] * 0.2; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Delay(3),
                    skillcomponents_1.Description('The smoke around %target has cleared!')
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Delay(3),
                    skillcomponents_1.StatMod(interfaces_1.Stat.DEX, function (caster, target) { return target.stats[interfaces_1.Stat.DEX] * 0.2; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Delay(3),
                    skillcomponents_1.StatMod(interfaces_1.Stat.AGI, function (caster, target) { return target.stats[interfaces_1.Stat.AGI] * 0.2; })
                ]
            ] }
    ],
    _c[interfaces_1.Profession.SandwichArtist] = [
        { weight: 3, skills: [all_1.Attack()] },
        // food fight
        { weight: 2, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source started a food fight!'),
                    Immediate_1.Immediate()
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllButSelf), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(75),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.LUK]; }, function (caster) { return caster.stats[interfaces_1.Stat.LUK] * 2; })),
                    skillcomponents_1.Description('%source hit %target with a sandwich for %value damage!'),
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllButSelf), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(45),
                    skillcomponents_1.StatMod(interfaces_1.Stat.STR, skillcomponents_1.RandomNumber(function (caster, target) { return -target.maxStats[interfaces_1.Stat.STR] / 20; }, function (caster, target) { return target.maxStats[interfaces_1.Stat.STR] / 20; }))
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllButSelf), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(45),
                    skillcomponents_1.StatMod(interfaces_1.Stat.INT, skillcomponents_1.RandomNumber(function (caster, target) { return -target.maxStats[interfaces_1.Stat.INT] / 20; }, function (caster, target) { return target.maxStats[interfaces_1.Stat.INT] / 20; }))
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllButSelf), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(45),
                    skillcomponents_1.StatMod(interfaces_1.Stat.AGI, skillcomponents_1.RandomNumber(function (caster, target) { return -target.maxStats[interfaces_1.Stat.AGI] / 20; }, function (caster, target) { return target.maxStats[interfaces_1.Stat.AGI] / 20; }))
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllButSelf), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(45),
                    skillcomponents_1.StatMod(interfaces_1.Stat.DEX, skillcomponents_1.RandomNumber(function (caster, target) { return -target.maxStats[interfaces_1.Stat.DEX] / 20; }, function (caster, target) { return target.maxStats[interfaces_1.Stat.DEX] / 20; }))
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllButSelf), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(45),
                    skillcomponents_1.StatMod(interfaces_1.Stat.CON, skillcomponents_1.RandomNumber(function (caster, target) { return -target.maxStats[interfaces_1.Stat.CON] / 20; }, function (caster, target) { return target.maxStats[interfaces_1.Stat.CON] / 20; }))
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllButSelf), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(45),
                    skillcomponents_1.StatMod(interfaces_1.Stat.LUK, skillcomponents_1.RandomNumber(function (caster, target) { return -target.maxStats[interfaces_1.Stat.LUK] / 20; }, function (caster, target) { return target.maxStats[interfaces_1.Stat.LUK] / 20; }))
                ]
            ] },
        // burnt sandwich
        { weight: 4,
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy),
                    skillcomponents_1.SameTarget([
                        skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                        skillcomponents_1.Description('%source forced %target to eat a burnt sandwich which dealt %value damage!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.STR] * 1.0; }, function (caster) { return caster.stats[interfaces_1.Stat.STR] * 1.5; }))
                    ], [
                        skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90), skillcomponents_1.Delay(1), skillcomponents_1.Duration(skillcomponents_1.RandomNumber(2, 4)),
                        skillcomponents_1.Description('%target took %value heartburn damage from %source\'s burnt sandwich!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster, target) { return target.stats[interfaces_1.Stat.CON] * 0.4; }, function (caster, target) { return target.stats[interfaces_1.Stat.CON] * 0.6; }))
                    ])
                ]
            ] },
        // heavenly sandwich
        { weight: 2,
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly),
                    skillcomponents_1.SameTarget([
                        skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(100),
                        skillcomponents_1.Description('%source fed a heavenly sandwich to %target which healed %value health!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.CON] * 1.0; }, function (caster) { return caster.stats[interfaces_1.Stat.CON] * 1.5; }, true))
                    ], [
                        skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                        skillcomponents_1.StatMod(interfaces_1.Stat.CON, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.CON] * 0.5; }, function (caster) { return caster.stats[interfaces_1.Stat.CON] * 1.5; }))
                    ])
                ]
            ] },
    ],
    _c);
//# sourceMappingURL=profession.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Chance = require("chance");
var lodash_1 = require("lodash");
var rxjs_1 = require("rxjs");
var skillgroups_1 = require("./skillgroups");
var interfaces_1 = require("../interfaces");
var CombatAction;
(function (CombatAction) {
    // inbetween round print statistics
    CombatAction[CombatAction["PrintStatistics"] = 0] = "PrintStatistics";
    // normal message string
    CombatAction[CombatAction["Message"] = 1] = "Message";
    // summary message string
    CombatAction[CombatAction["SummaryMessage"] = 2] = "SummaryMessage";
    // all the data that signifies the end of combat
    CombatAction[CombatAction["Victory"] = 3] = "Victory";
    // increment a particular statistic for a player
    CombatAction[CombatAction["IncrementStatistic"] = 4] = "IncrementStatistic";
})(CombatAction = exports.CombatAction || (exports.CombatAction = {}));
var CombatSimulator = /** @class */ (function () {
    function CombatSimulator(combat) {
        this.combat = combat;
        this.events = new rxjs_1.Subject();
        this.combat = lodash_1.cloneDeep(this.combat);
        if (!this.combat.seed)
            this.combat.seed = Date.now();
        if (!this.combat.currentRound)
            this.combat.currentRound = 0;
        if (!this.combat.timestamp)
            this.combat.timestamp = Date.now();
        this.chance = new Chance(this.combat.seed);
        this.combat.chance = this.chance;
    }
    Object.defineProperty(CombatSimulator.prototype, "events$", {
        get: function () {
            return this.events;
        },
        enumerable: true,
        configurable: true
    });
    CombatSimulator.prototype.formSkillResult = function (caster, combinators) {
        var _this = this;
        var baseSkill = {};
        return combinators.reduce(function (prev, cur) {
            return cur(prev, caster, _this.combat);
        }, baseSkill);
    };
    CombatSimulator.prototype.formAllSkillResults = function (caster, allCombinators) {
        var _this = this;
        var allSkills = allCombinators;
        if (allSkills instanceof Function) {
            allSkills = allCombinators(this.combat, caster);
        }
        return allSkills.map(function (x) { return _this.formSkillResult(caster, x); });
    };
    CombatSimulator.prototype.emitAction = function (action) {
        this.events.next(action);
    };
    CombatSimulator.prototype.formatCombat = function (combat) {
        var res = lodash_1.cloneDeep(combat);
        delete res.chance;
        return res;
    };
    CombatSimulator.prototype.getPreRoundSkillsForCharacter = function (character) {
        var _this = this;
        return (skillgroups_1.ProfessionPreRoundSkillMap[character.profession] || [])
            .filter(function (x) { return x.canUse ? x.canUse(character, _this.combat) : true; });
    };
    CombatSimulator.prototype.getPostRoundSkillsForCharacter = function (character) {
        var _this = this;
        return (skillgroups_1.ProfessionPostRoundSkillMap[character.profession] || [])
            .filter(function (x) { return x.canUse ? x.canUse(character, _this.combat) : true; });
    };
    CombatSimulator.prototype.getSkillsForCharacter = function (character) {
        var _this = this;
        var arr = [];
        if (skillgroups_1.ProfessionSkillMap[character.profession])
            arr.push.apply(arr, skillgroups_1.ProfessionSkillMap[character.profession]);
        if (skillgroups_1.AffinitySkillMap[character.affinity])
            arr.push.apply(arr, skillgroups_1.AffinitySkillMap[character.affinity]);
        if (skillgroups_1.AttributeSkillMap[character.attribute] && character.rating >= 5)
            arr.push.apply(arr, skillgroups_1.AttributeSkillMap[character.attribute]);
        if (arr.length === 0) {
            arr.push({ weight: 1, skills: [skillgroups_1.Attack()] });
        }
        return arr
            .filter(function (x) { return x.canUse ? x.canUse(character, _this.combat) : true; });
    };
    // currently, if hp <= 0, the character is dead
    CombatSimulator.prototype.isDead = function (character) {
        return character.stats[interfaces_1.Stat.HP] <= 0;
    };
    CombatSimulator.prototype.addCombatEffect = function (character, effect) {
        var delay = effect.turnsUntilEffect || 0;
        var duration = effect.turnsEffectLasts || 0;
        character.effects = character.effects || [];
        var turn = delay;
        do {
            character.effects[turn] = character.effects[turn] || [];
            character.effects[turn].push(effect);
            turn++;
        } while (turn < delay + duration);
    };
    CombatSimulator.prototype.doSkill = function (caster, skill) {
        var _this = this;
        var effects = this.formAllSkillResults(caster, skill);
        effects.forEach(function (effect) {
            effect.targets.forEach(function (target) {
                if (isNaN(target))
                    return;
                effect.targetEffects[target].forEach(function (targetEffect) {
                    // if an effect happens to suggest it is immediate, we can do this.
                    // this would typically be a message that would look weird showing up later
                    if (targetEffect.immediate) {
                        _this.applySingleEffect(_this.combat.characters[target], targetEffect);
                        return;
                    }
                    _this.addCombatEffect(_this.combat.characters[target], targetEffect);
                });
            });
        });
    };
    CombatSimulator.prototype.doSkillImmediately = function (caster, skill) {
        var _this = this;
        var effects = this.formAllSkillResults(caster, skill);
        effects.forEach(function (effect) {
            effect.targets.forEach(function (target) {
                if (isNaN(target))
                    return;
                effect.targetEffects[target].forEach(function (targetEffect) {
                    _this.applySingleEffect(_this.combat.characters[target], targetEffect);
                });
            });
        });
    };
    CombatSimulator.prototype.formatMessage = function (skillEffect, forCharacter) {
        if (!skillEffect.desc)
            return '';
        var refChar = this.combat.characters[skillEffect.source];
        var absDamage = Math.abs(skillEffect.modifyStatValue);
        var damageString = absDamage === 0 ? "0 [miss]" : absDamage.toLocaleString();
        var replacements = [
            { replace: 'source', with: refChar ? refChar.name : 'a mysterious force' },
            { replace: 'value', with: damageString },
            { replace: 'rvalue', with: skillEffect.modifyStatValue.toLocaleString() },
            { replace: 'target', with: forCharacter.name },
            { replace: 'special', with: forCharacter.specialName || 'special' }
        ];
        return replacements.reduce(function (prev, cur) {
            return prev.split("%" + cur.replace).join(cur.with);
        }, skillEffect.desc);
    };
    CombatSimulator.prototype.applySingleEffect = function (character, effect) {
        if (effect.modifyStat) {
            // roll accuracy, if it fails, set the value to 0
            if (!this.chance.bool({ likelihood: Math.max(0, Math.min(100, effect.accuracy)) }) || isNaN(effect.modifyStatValue)) {
                effect.modifyStatValue = 0;
            }
            // round modifyStatValue always
            effect.modifyStatValue = Math.floor(effect.modifyStatValue);
            // special cap handling for HP and Special
            if (effect.modifyStat === interfaces_1.Stat.HP) {
                if (effect.modifyStatValue + character.stats[interfaces_1.Stat.HP] > character.maxStats[interfaces_1.Stat.HP]) {
                    effect.modifyStatValue = character.maxStats[interfaces_1.Stat.HP] - character.stats[interfaces_1.Stat.HP];
                }
            }
            if (effect.modifyStat === interfaces_1.Stat.SPECIAL) {
                if (effect.modifyStatValue + character.stats[interfaces_1.Stat.SPECIAL] > character.maxStats[interfaces_1.Stat.SPECIAL]) {
                    effect.modifyStatValue = character.maxStats[interfaces_1.Stat.SPECIAL] - character.stats[interfaces_1.Stat.SPECIAL];
                }
            }
            // apply the value to the stat
            character.stats[effect.modifyStat] += effect.modifyStatValue;
        }
        // share what happened with the world
        var message = this.formatMessage(effect, character);
        this.events$.next({ action: CombatAction.Message, data: {
                message: message,
                source: effect.source,
                combat: this.formatCombat(this.combat)
            }
        });
        // do statistic modifications
        if (effect.modifyStat === interfaces_1.Stat.HP) {
            var giver = this.combat.characters[effect.source];
            var type = effect.modifyStatValue === 0 ? 'Miss' : (effect.modifyStatValue < 0 ? 'Damage' : 'Healing');
            var incrementValue = effect.modifyStatValue === 0 ? 1 : Math.abs(effect.modifyStatValue);
            this.incrementStatistic(giver, "Combat/All/Give/Attack/Times", 1);
            this.incrementStatistic(giver, "Combat/All/Give/" + type, incrementValue);
            this.incrementStatistic(character, "Combat/All/Receive/Attack/Times", 1);
            this.incrementStatistic(character, "Combat/All/Receive/" + type, incrementValue);
            if (character.stats[interfaces_1.Stat.HP] <= 0) {
                character.stats[interfaces_1.Stat.HP] = 0;
                character.effects = [];
                this.incrementStatistic(giver, "Combat/All/Kill/" + (character.realName ? 'Player' : 'Monster'));
            }
        }
    };
    CombatSimulator.prototype.applyNextEffects = function (character) {
        var _this = this;
        if (!character.effects)
            return;
        var effects = character.effects.shift();
        if (!effects || !effects.length)
            return;
        effects.forEach(function (effect) {
            _this.applySingleEffect(character, effect);
        });
    };
    CombatSimulator.prototype.cleanUpDeadSummons = function () {
        var _this = this;
        Object.keys(this.combat.characters).forEach(function (combatId) {
            var check = _this.combat.characters[combatId];
            if (!check.summonerId)
                return;
            if (check.stats[interfaces_1.Stat.HP] > 0)
                return;
            delete _this.combat.characters[combatId];
        });
    };
    CombatSimulator.prototype.beginCombat = function () {
        // display stuff
        this.emitAction({
            action: CombatAction.PrintStatistics,
            data: this.formatCombat(this.combat)
        });
        this.beginRound();
    };
    CombatSimulator.prototype.beginRound = function () {
        var _this = this;
        // increment round for tracking purposes
        this.combat.currentRound++;
        // get valid combatants
        var validCombatants = Object.values(this.combat.characters);
        // order combatants by agi
        var combatantOrder = lodash_1.sortBy(validCombatants, function (char) { return char.stats[interfaces_1.Stat.AGI]; });
        // only living people get to do skills
        combatantOrder.filter(function (x) { return x.stats[interfaces_1.Stat.HP] > 0; }).forEach(function (comb) {
            // get pre-round skills if any and cast them
            var preroundSkills = _this.getPreRoundSkillsForCharacter(comb);
            if (preroundSkills.length > 0) {
                preroundSkills.forEach(function (_a) {
                    var skills = _a.skills;
                    _this.doSkillImmediately(comb, skills);
                });
            }
            // get skill from other skills and use it
            var validSkills = _this.getSkillsForCharacter(comb);
            var chosenSkill = _this.chance.weighted(validSkills.map(function (x) { return x.skills; }), validSkills.map(function (x) { return x.weight; }));
            _this.doSkill(comb, chosenSkill);
        });
        // buuuuttt... dead people may have effects cast on them that we have to consider
        combatantOrder.forEach(function (comb) {
            _this.applyNextEffects(comb);
        });
        this.cleanUpDeadSummons();
        // do post-round skills too
        combatantOrder.filter(function (x) { return x.stats[interfaces_1.Stat.HP] > 0; }).forEach(function (comb) {
            // get pre-round skills if any and cast them
            var postroundSkills = _this.getPostRoundSkillsForCharacter(comb);
            if (postroundSkills.length > 0) {
                postroundSkills.forEach(function (_a) {
                    var skills = _a.skills;
                    _this.doSkillImmediately(comb, skills);
                });
            }
        });
        this.endRound();
    };
    CombatSimulator.prototype.endRound = function () {
        var _this = this;
        // print round statistics
        this.emitAction({
            action: CombatAction.PrintStatistics,
            data: this.formatCombat(this.combat)
        });
        // check what teams are still alive
        var livingParties = {};
        Object.values(this.combat.characters).forEach(function (char) {
            if (_this.isDead(char))
                return;
            livingParties[char.combatPartyId] = true;
        });
        // check if everyone is dead
        if (lodash_1.size(livingParties) === 0)
            return this.endCombat({ wasTie: true });
        // check if only one team is alive
        if (lodash_1.size(livingParties) === 1)
            return this.endCombat({ winningParty: +Object.keys(livingParties)[0] });
        // arbitrary round timer just in case
        if (this.combat.currentRound >= 300)
            return this.endCombat({ wasTie: true });
        this.beginRound();
    };
    CombatSimulator.prototype.endCombat = function (args) {
        var _this = this;
        if (args === void 0) { args = {}; }
        Object.values(this.combat.characters).forEach(function (char) {
            var didWin = char.combatPartyId === args.winningParty;
            var combatType = args.wasTie ? 'Tie' : (didWin ? 'Win' : 'Lose');
            _this.incrementStatistic(char, "Combat/All/Times/Total");
            _this.incrementStatistic(char, "Combat/All/Times/" + combatType);
        });
        if (args.wasTie) {
            this.addSummaryMessage("It was a draw! No winners! No rewards!");
            this.events$.next({
                action: CombatAction.Victory,
                data: { wasTie: true, combat: this.formatCombat(this.combat) }
            });
            return;
        }
        var winningPlayers = Object
            .values(this.combat.characters)
            .filter(function (char) { return char.combatPartyId === args.winningParty; });
        var winningParty = this.combat.parties[args.winningParty];
        this.addSummaryMessage(winningParty.name + " (" + winningPlayers.map(function (char) { return char.name; }).join(', ') + ") have won the battle!");
        this.events$.next({
            action: CombatAction.Victory,
            data: { wasTie: args.wasTie, combat: this.formatCombat(this.combat), winningParty: args.winningParty }
        });
    };
    CombatSimulator.prototype.addSummaryMessage = function (message) {
        this.events$.next({
            action: CombatAction.SummaryMessage,
            data: message
        });
    };
    CombatSimulator.prototype.incrementStatistic = function (char, statistic, value) {
        if (value === void 0) { value = 1; }
        if (!char || !char.realName)
            return;
        this.events$.next({
            action: CombatAction.IncrementStatistic,
            data: { statistic: statistic, value: value, name: char.realName }
        });
        this.events$.next({
            action: CombatAction.IncrementStatistic,
            data: { statistic: statistic.split('All').join("Profession/" + char.profession), value: value, name: char.realName }
        });
    };
    return CombatSimulator;
}());
exports.CombatSimulator = CombatSimulator;
//# sourceMappingURL=combat-simulator.js.map
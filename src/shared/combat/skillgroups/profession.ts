
import { ICombatSkillCombinator, Profession, Stat } from '../../interfaces';
import { Attack, RegenerateHP } from './all';

/**
 * These skills always happen. All of them. Each round. Used for regen effects and the like.
 */
export const ProfessionPreRoundSkillMap: { [key in Profession]: Array<{ skills: ICombatSkillCombinator[][] }> } = {
  [Profession.Archer]: [
  ],

  [Profession.Barbarian]: [
  ],

  [Profession.Bard]: [
    { skills: [RegenerateHP(caster => (caster.maxStats[Stat.HP] - caster.stats[Stat.HP]) / 20)] }
  ],

  [Profession.Bitomancer]: [
  ],

  [Profession.Cleric]: [
  ],

  [Profession.Fighter]: [
  ],

  [Profession.Generalist]: [
  ],

  [Profession.Jester]: [
  ],

  [Profession.Mage]: [
  ],

  [Profession.MagicalMonster]: [
  ],

  [Profession.Monster]: [
  ],

  [Profession.Necromancer]: [
  ],

  [Profession.Pirate]: [
  ],

  [Profession.Rogue]: [
  ],

  [Profession.SandwichArtist]: [
  ]
};

/**
 * These abilities are locked to player professions.
 */
export const ProfessionSkillMap: { [key in Profession]: Array<{ weight: number, skills: ICombatSkillCombinator[][] }> } = {
  [Profession.Archer]: [
    { weight: 1, skills: [Attack()] }
  ],

  [Profession.Barbarian]: [
    { weight: 1, skills: [Attack()] }
  ],

  [Profession.Bard]: [
    { weight: 1, skills: [Attack()] }
  ],

  [Profession.Bitomancer]: [
    { weight: 1, skills: [Attack()] }
  ],

  [Profession.Cleric]: [
    { weight: 1, skills: [Attack()] }
  ],

  [Profession.Fighter]: [
    { weight: 1, skills: [Attack()] }
  ],

  [Profession.Generalist]: [
    { weight: 1, skills: [Attack()] }
  ],

  [Profession.Jester]: [
    { weight: 1, skills: [Attack()] }
  ],

  [Profession.Mage]: [
    { weight: 1, skills: [Attack()] }
  ],

  [Profession.MagicalMonster]: [
    { weight: 1, skills: [Attack()] }
  ],

  [Profession.Monster]: [
    { weight: 1, skills: [Attack()] }
  ],

  [Profession.Necromancer]: [
    { weight: 1, skills: [Attack()] }
  ],

  [Profession.Pirate]: [
    { weight: 1, skills: [Attack()] }
  ],

  [Profession.Rogue]: [
    { weight: 1, skills: [Attack()] }
  ],

  [Profession.SandwichArtist]: [
    { weight: 1, skills: [Attack()] }
  ]
};

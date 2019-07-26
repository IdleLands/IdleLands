
import { ICombatSkillCombinator, PetAffinity } from '../../interfaces';
import { Attack } from './all';

/**
 * These abilities are locked to pets of a certain attribute.
 */
export const AffinitySkillMap: { [key in PetAffinity]: Array<{ weight: number, skills: ICombatSkillCombinator[][] }> } = {
  [PetAffinity.None]: [
    { weight: 1, skills: [Attack] }
  ],

  [PetAffinity.Attacker]: [
    { weight: 1, skills: [Attack] }
  ],

  [PetAffinity.Buffer]: [
    { weight: 1, skills: [Attack] }
  ],

  [PetAffinity.Caster]: [
    { weight: 1, skills: [Attack] }
  ],

  [PetAffinity.Defender]: [
    { weight: 1, skills: [Attack] }
  ],

  [PetAffinity.Healer]: [
    { weight: 1, skills: [Attack] }
  ],

  [PetAffinity.Hunter]: [
    { weight: 1, skills: [Attack] }
  ]
};

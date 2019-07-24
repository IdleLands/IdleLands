import { CombatSimulator } from '../src/shared/combat/combat-simulator';
import { Attack } from '../src/shared/combat/skills/BasicAttacks';
import { ICombat, ICombatCharacter, ICombatParty } from '../src/shared/interfaces';


const characters: ICombatCharacter[] = [
  { combatId: 1, combatPartyId: 1, name: 'Test Left',
    profession: 'Fighter',
    level: 10, stats: { str: 100, dex: 100, con: 100, int: 100, agi: 50, luk: 100, hp: 10000, special: 0, gold: 10, xp: 10 }
  },
  { combatId: 1, combatPartyId: 2, name: 'Super Tester',
    attribute: 'Alchemist', affinity: 'Healer',
    level: 10, stats: { str: 100, dex: 100, con: 100, int: 100, agi: 50, luk: 100, hp: 5000, special: 0, gold: 10, xp: 10 }
  }
];

const parties: ICombatParty[] = [
  { id: 1, name: 'The Special Testers' },
  { id: 2, name: 'Spooky Transistors' },
];

const combat: ICombat = {
  seed: 1,
  currentRound: 0,
  chance: null,
  characters: characters.reduce((prev, cur) => {
    prev[cur.combatId] = cur;
    return prev;
  }, {}),
  parties
};

const simulator = new CombatSimulator(combat);

console.log(JSON.stringify(simulator.formSkillResult(characters[0], Attack)));

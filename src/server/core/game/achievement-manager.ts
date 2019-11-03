import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { compact, uniq } from 'lodash';

import * as Achievements from './achievements';
import { Player } from '../../../shared/models';
import { IAchievement, AchievementType, AchievementRewardType, IPetProto, Profession, Achievement } from '../../../shared/interfaces';
import { AssetManager } from './asset-manager';

// big thanks to Boaty for this and the class change titles.
// you da bes!
const StepperAchievementTitles: { [key in Profession]: string } = {
  [Profession.Archer]: 'Sagittarian',
  [Profession.Barbarian]: 'Barbaric',
  [Profession.Bard]: 'Diva',
  [Profession.Bitomancer]: 'Digistepper',
  [Profession.Cleric]: 'Divine',
  [Profession.Fighter]: 'Warlord',
  [Profession.Generalist]: 'Jack of All Trades',
  [Profession.Jester]: 'Clown',
  [Profession.Mage]: 'Magical',
  [Profession.MagicalMonster]: 'Minotaur',
  [Profession.Monster]: 'Monstrous',
  [Profession.Necromancer]: 'Hellraiser',
  [Profession.Pirate]: 'Piratical',
  [Profession.Rogue]: 'Roguish',
  [Profession.SandwichArtist]: 'Artistic'
};

const ClassChangeTitles: { [key in Profession]: string[] } = {
  [Profession.Archer]: ['Off-Target', 'Inaccurate', 'Good Shot', 'Precise', 'Exact', 'Sure-fire'],
  [Profession.Barbarian]: ['Uncouth', 'Rude', 'Lowbrow', 'Philistine', 'Uncivilized', 'Savage'],
  [Profession.Bard]: ['Tone Deaf', 'Melodic', 'Harmonic', 'Symphonic', 'Operatic', 'Exhilarating'],
  [Profession.Bitomancer]: ['Beta Tester', 'Code Monkey', 'Geek', 'Cyberpunk', 'l33t h4x0r', 'SuperNerd'],
  [Profession.Cleric]: ['Sanctimonious', 'Pious', 'Devout', 'Righteous', 'Saintly', 'Holy'],
  [Profession.Fighter]: ['Ornery', 'Combatative', 'Pugilistic', 'Militant', 'Bellicose', 'Bloodthirsty'],
  [Profession.Generalist]: ['Vague', 'Undifferentiated', 'Average', 'Versatile', 'Well-Rounded', 'Resourceful'],
  [Profession.Jester]: ['Unfunny', 'Laughable', 'Amusing', 'Hilarious', 'Hysterical', 'Ridiculous'],
  [Profession.Mage]: ['Charlatan', 'Conjurer', 'Wizard', 'Warlock', 'Shaman', 'Arcane Master'],
  [Profession.MagicalMonster]: ['Gnome', 'Goblin', 'Centaur', 'Griffin', 'Manticore', 'Dragon'],
  [Profession.Monster]: ['Yucky', 'Deformed', 'Freak of Nature', 'Grotesque', 'Inhuman', 'Horrifying'],
  [Profession.Necromancer]: ['Morbid', 'Gravedigger', 'Witch Doctor', 'Dark Artist', 'Thaumaturge', 'Dark Lord'],
  [Profession.Pirate]: ['Damp', 'Swabbie', 'Keelhauler', 'Scurvy', 'Old Salt', 'Freebooter'],
  [Profession.Rogue]: ['Naughty', 'Bad Egg', 'Rascal', 'Rapscallion', 'Blackguard', 'Crook'],
  [Profession.SandwichArtist]: ['Bologna Botticelli', 'Grilled Cheese Gaugin', 'Roast Beef Rembrandt',
                                'Pepperoni Picasso', 'Muffuletta Michaelangelo', 'Pastry Prodigy']
};

@Singleton
@AutoWired
export class AchievementManager {

  @Inject assets: AssetManager;

  private allAchievements: { [key: string]: any } = { };

  public statToAchievement: { [key: string]: any[] } = { };

  public init() {
    Object.keys(Achievements).forEach(achievementName => {
      const ach = Achievements[achievementName];
      this.allAchievements[achievementName] = ach;

      if(!ach.statWatches) return;

      ach.statWatches.forEach(stat => {
        if(stat.includes('.')) throw new Error(`${achievementName} is watching a stat with a . in it! Change it to /.`);
        this.statToAchievement[stat] = this.statToAchievement[stat] || [];
        this.statToAchievement[stat].push(ach);
      });
    });

    const allExtraAchievements: any[] = this.getAllPetAchievements().concat(this.getAllClassSpecificAchievements() as any[]);
    allExtraAchievements.forEach(petAch => {
      this.allAchievements[petAch.name] = petAch;

      petAch.statWatches.forEach(stat => {
        this.statToAchievement[stat] = this.statToAchievement[stat] || [];
        this.statToAchievement[stat].push(petAch);
      });
    });
  }

  private getAllPetAchievements() {
    const allPets = Object.values(this.assets.allPetAssets);

    return allPets.map((pet: IPetProto) => {
      return {
        name: `Tribal: ${pet.typeName}`,
        statWatches: uniq(Object.keys(pet.requirements.statistics || []).concat(['Item/Collectible/Find'])),
        type: AchievementType.Pet,
        descriptionForTier: () => `You earned a new pet: ${pet.typeName}.
          It offers the following permanent bonuses for ${pet.cost.toLocaleString()} gold:
          ${Object.keys(pet.permanentUpgrades).map(x => `${x} +${pet.permanentUpgrades[x]}`).join(', ')}`,
        calculateTier: (player: Player) => {
          const meetsStatistics = pet.requirements.statistics ? Object.keys(pet.requirements.statistics || []).every(stat => {
            const val = player.$statistics.get(stat);
            return val >= pet.requirements.statistics[stat];
          }) : true;

          const meetsAchievements = pet.requirements.achievements ? Object.keys(pet.requirements.achievements).every(ach => {
            const achTier = player.$achievements.getAchievementTier(ach);
            return achTier >= pet.requirements.achievements[ach];
          }) : true;

          const meetsCollectibles = pet.requirements.collectibles ? pet.requirements.collectibles.every(coll => {
            return player.$collectibles.has(coll);
          }) : true;

          return meetsStatistics && meetsCollectibles && meetsAchievements ? 1 : 0;
        },
        rewardsForTier: () => [{ type: AchievementRewardType.Pet, pet: pet.typeName }]
      };
    });
  }

  private getAllClassSpecificAchievements() {
    const allClasses = Object.values(Profession);

    const stepper: any[] = allClasses.map(x => {
      return {
        name: `Stepper: ${x}`,
        statWatches: [`Profession/${x}/Steps`],
        type: AchievementType.Progress,
        descriptionForTier: () => `You've taken ${(1000000).toLocaleString()} steps as a ${x}.
          Title: ${StepperAchievementTitles[x]}. Gender: Blue ${x}.`,
        calculateTier: (player: Player) => player.$statistics.get(`Profession/${x}/Steps`) > 1000000 ? 1 : 0,
        rewardsForTier: () => [
          { type: AchievementRewardType.Title, title: StepperAchievementTitles[x] },
          { type: AchievementRewardType.Gender, gender: `${x}-blue` }
        ]
      };
    });

    const becomeTierMap = [5, 15, 25, 50, 100, 1000];

    const becomer: any[] = allClasses.map(x => {
      return {
        name: `Professional: ${x}`,
        statWatches: [`Profession/${x}/Become`],
        type: AchievementType.Progress,
        descriptionForTier: (tier: number) => {
          let baseStr = `You've become a ${x} ${becomeTierMap[tier - 1]} times.
            Titles: ${ClassChangeTitles[x].slice(0, tier).join(', ')}.`;

          if(tier >= 3) {
            baseStr = `${baseStr} Gender: Red ${x}`;
          }

          if(tier >= 5) {
            baseStr = `${baseStr} Gender: Green ${x}`;
          }

          return baseStr;
        },
        calculateTier: (player: Player) => {
          const base = player.$statistics.get(`Profession/${x}/Become`);
          if(base >= 1000) return 6;
          if(base >= 100) return 5;
          if(base >= 50)  return 4;
          if(base >= 25)  return 3;
          if(base >= 15)  return 2;
          if(base >= 5)   return 1;
          return 0;
        },
        rewardsForTier: (tier: number) => {
          const rewards = [];
          for(let i = 0; i < tier; i++) {
            rewards.push({ type: AchievementRewardType.Title, title: ClassChangeTitles[x][i] });
          }

          if(tier >= 3) {
            rewards.push({ type: AchievementRewardType.Gender, gender: `${x}-red` });
          }

          if(tier >= 5) {
            rewards.push({ type: AchievementRewardType.Gender, gender: `${x}-green` });
          }

          return rewards;
        }
      };
    });

    return stepper.concat(becomer);
  }

  private getAchievementObject(player: Player, achName: string, alwaysGet = false): IAchievement {
    const ach = this.allAchievements[achName];

    const tier = ach.calculateTier(player);
    if(tier === 0 || isNaN(tier) || !isFinite(tier)) return;

    const existingTier = alwaysGet ? 0 : player.$achievements.getAchievementTier(ach.name);
    if(tier === existingTier || isNaN(existingTier) || !isFinite(existingTier)) return;

    const existingAchAt = alwaysGet ? player.$achievements.getAchievementAchieved(ach.name) : 0;

    const achObj: IAchievement = {
      name: ach.name,
      achievedAt: existingAchAt || Date.now(),
      tier,
      desc: ach.descriptionForTier(tier),
      type: ach.type,
      rewards: ach.rewardsForTier(tier)
    };

    return achObj;
  }

  public checkAchievementsFor(player: Player, stat?: string): IAchievement[] {
    if(stat && !this.statToAchievement[stat]) return [];

    const newAchievements = [];

    const checkArr = stat ? this.statToAchievement[stat] : Object.values(this.allAchievements);

    checkArr.forEach(ach => {
      const achObj = this.getAchievementObject(player, ach.name);
      if(!achObj) return;

      newAchievements.push(achObj);

      player.$achievements.add(achObj);
    });

    return newAchievements;
  }

  public syncAchievements(player: Player): void {
    const allEarnedAchievements = compact(
      Object.values(this.allAchievements).map(ach => this.getAchievementObject(player, ach.name, true))
    );
    player.$achievements.resetAchievementsTo(allEarnedAchievements);
  }

}

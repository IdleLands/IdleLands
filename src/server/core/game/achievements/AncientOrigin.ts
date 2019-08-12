import { AchievementType, AchievementRewardType, Achievement } from '../../../../shared/interfaces';
import { Player } from '../../../../shared/models';

export class AncientOrigin extends Achievement {

  static readonly statWatches = ['Game/IdleLands1/Played'];
  static readonly type = AchievementType.Special;

  static descriptionForTier(tier: number): string {
    const baseStr = `Gain a title for playing IdleLands 1. That's all you get. Nothing from that era was transferrable.`;

    return baseStr;
  }

  static calculateTier(player: Player): number {
    return player.$statistics.get('Game/IdleLands1/Played') ? 1 : 0;
  }

  static rewardsForTier(tier: number): any[] {
    const baseRewards: any[] = [
       { type: AchievementRewardType.Title, title: 'Origin of the Idling Gods 🌊' }
    ];

    return baseRewards;
  }
}

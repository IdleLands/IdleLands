import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType } from '../../../../shared/interfaces';
import { Choice } from '../../../../shared/models';

export class FindTrainer extends Event {
  public static readonly WEIGHT = 0;

  public doChoice(eventManager: any, player: Player, choice: Choice, valueChosen: string): boolean {
    if(valueChosen === 'No') return true;

    const { professionName } = choice.extraData;
    const profession = this.professionHelper.getProfession(professionName);
    if(!profession) return true;

    player.changeProfession(profession);
    player.increaseStatistic(`Profession.${profession}.Become`, 1);
    player.increaseStatistic(`Character.ProfessionChanges`, 1);

    return true;
  }

  public operateOn(player: Player, opts?: any) {
    const checkProf = this.professionHelper.hasProfession(opts.professionName);
    if(!checkProf || opts.professionName === player.profession) {
      this.emitMessage(
        [player],
        `You met with ${opts.trainerName}, but you were unable to learn anything new.`,
        AdventureLogEventType.Profession
      );
    }

    this.emitMessage([player], `You met with ${opts.trainerName}!`, AdventureLogEventType.Profession);

    const choice = this.getChoice({
      desc: `
        Would you like to be a ${opts.professionName}?
      `,
      choices: ['Yes', 'No'],
      defaultChoice: player.getDefaultChoice(['Yes', 'No']),
      extraData: {
        professionName: opts.professionName
      }
    });

    player.$choices.addChoice(player, choice);
  }
}

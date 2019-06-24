
export interface IParty {
  name: string;

  members: string[];
  temporaryMembers?: string[];

  // a party made only for combat. will either have monsters or one player/associated joiners
  isCombatParty?: boolean;
}

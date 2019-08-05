
export enum ModeratorTier {
  None = 0,
  ChatMod = 1,
  GameMod = 2,
  Admin = 5
}


export enum ModerationAction {
  SetMOTD,

  ToggleMute,

  StartFestival,

  ChangeModTier
}

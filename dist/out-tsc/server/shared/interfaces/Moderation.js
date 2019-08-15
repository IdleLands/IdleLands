"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ModeratorTier;
(function (ModeratorTier) {
    ModeratorTier[ModeratorTier["None"] = 0] = "None";
    ModeratorTier[ModeratorTier["ChatMod"] = 1] = "ChatMod";
    ModeratorTier[ModeratorTier["GameMod"] = 2] = "GameMod";
    ModeratorTier[ModeratorTier["Admin"] = 5] = "Admin";
})(ModeratorTier = exports.ModeratorTier || (exports.ModeratorTier = {}));
var ModerationAction;
(function (ModerationAction) {
    ModerationAction[ModerationAction["SetMOTD"] = 0] = "SetMOTD";
    ModerationAction[ModerationAction["ToggleMute"] = 1] = "ToggleMute";
    ModerationAction[ModerationAction["StartFestival"] = 2] = "StartFestival";
    ModerationAction[ModerationAction["ChangeModTier"] = 3] = "ChangeModTier";
})(ModerationAction = exports.ModerationAction || (exports.ModerationAction = {}));
//# sourceMappingURL=Moderation.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Channel;
(function (Channel) {
    // party create, remove, modify
    Channel["Party"] = "party";
    // receive/send an event from the server
    Channel["PlayerAdventureLog"] = "eventMessage";
    // used to send/receive player chat messages
    Channel["PlayerChat"] = "playerChat";
    // used to communicate updates to clients
    Channel["PlayerUpdates"] = "playerUpdates";
    // internal: used to sync player add/remove between servers
    Channel["Players"] = "internal:players";
    // internal: used to sync player buff grants (party buffers)
    Channel["PlayerBuff"] = "internal:playerBuffs";
    // internal: used to sync player events for parties (blessxp, blessgold)
    Channel["PlayerEvent"] = "internal:playerEvents";
    // internal: used to sync festivals between servers
    Channel["Festivals"] = "internal:festivals";
    // internal: used to sync game settings between servers
    Channel["GameSettings"] = "internal:gamesettings";
})(Channel = exports.Channel || (exports.Channel = {}));
var EventMessageType;
(function (EventMessageType) {
    EventMessageType["Battle"] = "battle";
    EventMessageType["BlessGold"] = "blessGold";
    EventMessageType["BlessGoldParty"] = "blessGoldParty";
    EventMessageType["BlessItem"] = "blessItem";
    EventMessageType["BlessXP"] = "blessXp";
    EventMessageType["BlessXPParty"] = "blessXpParty";
    EventMessageType["Enchant"] = "enchant";
    EventMessageType["FindItem"] = "findItem";
    EventMessageType["Switcheroo"] = "flipStat";
    EventMessageType["ForsakeGold"] = "forsakeGold";
    EventMessageType["ForsakeItem"] = "forsakeItem";
    EventMessageType["ForsakeXP"] = "forsakeXp";
    EventMessageType["LevelDown"] = "levelDown";
    EventMessageType["Merchant"] = "merchant";
    EventMessageType["Party"] = "party";
    EventMessageType["Providence"] = "providence";
    EventMessageType["Tinker"] = "tinker";
    EventMessageType["Witch"] = "witch";
})(EventMessageType = exports.EventMessageType || (exports.EventMessageType = {}));
var EventName;
(function (EventName) {
    EventName["Battle"] = "Battle";
    EventName["BattlePvP"] = "BattlePvP";
    EventName["BattleBoss"] = "BattleBoss";
    EventName["BlessGold"] = "BlessGold";
    EventName["BlessGoldParty"] = "BlessGoldParty";
    EventName["BlessItem"] = "BlessItem";
    EventName["BlessXP"] = "BlessXP";
    EventName["BlessXPParty"] = "BlessXPParty";
    EventName["Enchant"] = "Enchant";
    EventName["FindItem"] = "FindItem";
    EventName["FindTrainer"] = "FindTrainer";
    EventName["FindTreasure"] = "FindTreasure";
    EventName["ForsakeGold"] = "ForsakeGold";
    EventName["ForsakeItem"] = "ForsakeItem";
    EventName["ForsakeXP"] = "ForsakeXP";
    EventName["Gamble"] = "Gamble";
    EventName["Merchant"] = "Merchant";
    EventName["Party"] = "Party";
    EventName["PartyLeave"] = "PartyLeave";
    EventName["Providence"] = "Providence";
    EventName["Switcheroo"] = "Switcheroo";
    EventName["TownCrier"] = "TownCrier";
    EventName["Witch"] = "Witch";
})(EventName = exports.EventName || (exports.EventName = {}));
//# sourceMappingURL=GameEvent.js.map
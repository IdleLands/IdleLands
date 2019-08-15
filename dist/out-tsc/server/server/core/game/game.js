"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var database_manager_1 = require("./database-manager");
var player_manager_1 = require("./player-manager");
var interfaces_1 = require("../../../shared/interfaces");
var logger_1 = require("../logger");
var item_generator_1 = require("./item-generator");
var asset_manager_1 = require("./asset-manager");
var discord_manager_1 = require("./discord-manager");
var subscription_manager_1 = require("./subscription-manager");
var event_manager_1 = require("./event-manager");
var achievement_manager_1 = require("./achievement-manager");
var personality_manager_1 = require("./personality-manager");
var world_1 = require("./world");
var movement_helper_1 = require("./movement-helper");
var holiday_helper_1 = require("./holiday-helper");
var profession_helper_1 = require("./profession-helper");
var chat_helper_1 = require("./chat-helper");
var party_helper_1 = require("./party-helper");
var party_manager_1 = require("./party-manager");
var buff_manager_1 = require("./buff-manager");
var pet_helper_1 = require("./pet-helper");
var rng_service_1 = require("./rng-service");
var combat_helper_1 = require("./combat-helper");
var calculator_helper_1 = require("./calculator-helper");
var festival_manager_1 = require("./festival-manager");
var gm_helper_1 = require("./gm-helper");
var il3_linker_1 = require("./il3-linker");
var GAME_DELAY = process.env.GAME_DELAY ? +process.env.GAME_DELAY : 5000;
var SAVE_TICKS = process.env.SAVE_DELAY ? +process.env.SAVE_DELAY : (process.env.NODE_ENV === 'production' ? 15 : 10);
var Game = /** @class */ (function () {
    function Game() {
        this.ticks = 0;
    }
    Game.prototype.init = function (scServer, id) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_1, _a, _b, e_2;
            var _this = this;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.logger.init()];
                    case 1:
                        _c.sent();
                        this.logger.log('Game', 'Database manager initializing...');
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.databaseManager.init()];
                    case 3:
                        _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _c.sent();
                        this.logger.error('Game', e_1);
                        return [3 /*break*/, 5];
                    case 5:
                        this.logger.log('Game', 'Asset manager initializing...');
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 9, , 10]);
                        _b = (_a = this.assetManager).init;
                        return [4 /*yield*/, this.databaseManager.loadAssets()];
                    case 7: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                    case 8:
                        _c.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        e_2 = _c.sent();
                        this.logger.error('Game', e_2);
                        this.logger.error(new Error('Failed to load asset manager; did you run `npm run seed`?'));
                        return [3 /*break*/, 10];
                    case 10:
                        this.logger.log('Game', 'Subscription manager initializing...');
                        return [4 /*yield*/, this.subscriptionManager.init(scServer)];
                    case 11:
                        _c.sent();
                        this.logger.log('Game', 'Player manager initializing...');
                        return [4 /*yield*/, this.playerManager.init()];
                    case 12:
                        _c.sent();
                        this.logger.log('Game', 'Buff manager initializing...');
                        return [4 /*yield*/, this.buffManager.init()];
                    case 13:
                        _c.sent();
                        this.logger.log('Game', 'Event manager initializing...');
                        return [4 /*yield*/, this.eventManager.init()];
                    case 14:
                        _c.sent();
                        this.logger.log('Game', 'Party manager initializing...');
                        return [4 /*yield*/, this.partyManager.init()];
                    case 15:
                        _c.sent();
                        this.logger.log('Game', 'Item generator initializing...');
                        return [4 /*yield*/, this.itemGenerator.init()];
                    case 16:
                        _c.sent();
                        this.logger.log('Game', 'Achievement manager initializing...');
                        return [4 /*yield*/, this.achievementManager.init()];
                    case 17:
                        _c.sent();
                        this.logger.log('Game', 'Festival manager initializing...');
                        return [4 /*yield*/, this.festivalManager.init()];
                    case 18:
                        _c.sent();
                        this.logger.log('Game', 'GM helper initializing...');
                        return [4 /*yield*/, this.gmHelper.init()];
                    case 19:
                        _c.sent();
                        this.logger.log('Game', 'Chat helper initializing...');
                        return [4 /*yield*/, this.chatHelper.init(function (msg) {
                                _this.discordManager.sendMessage(msg);
                            })];
                    case 20:
                        _c.sent();
                        this.logger.log('Game', 'Discord manager initializing...');
                        return [4 /*yield*/, this.discordManager.init(function (msg) {
                                _this.chatHelper.sendMessageToGame(msg);
                            }, id === 0)];
                    case 21:
                        _c.sent();
                        this.logger.log('Game', 'World initializing...');
                        return [4 /*yield*/, this.world.init(this.assetManager.allMapAssets)];
                    case 22:
                        _c.sent();
                        this.loop();
                        return [2 /*return*/];
                }
            });
        });
    };
    Game.prototype.loop = function () {
        var _this = this;
        this.ticks++;
        // intentionally, we don't wait for each player to save (we could do for..of)
        // we just want to make sure their player event is done before we send an update
        this.playerManager.allPlayers.forEach(function (player) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, player.loop()];
                    case 1:
                        _a.sent();
                        this.updatePlayer(player);
                        if ((this.ticks % SAVE_TICKS) === 0) {
                            // this.logger.log(`Game`, `Saving player ${player.name}...`);
                            this.databaseManager.savePlayer(player);
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        if (this.ticks > 600) {
            this.ticks = 0;
            // this doesn't need to tick every tick
            this.festivalManager.tick();
        }
        setTimeout(function () {
            _this.loop();
        }, GAME_DELAY);
    };
    Game.prototype.updatePlayer = function (player) {
        player.copyLinkedDataToSelf();
        var patch = this.playerManager.getPlayerPatch(player.name);
        this.playerManager.emitToPlayer(player.name, interfaces_1.ServerEventName.CharacterPatch, patch);
    };
    Game.prototype.sendClientUpdateForPlayer = function (player) {
        this.playerManager.updatePlayer(player, interfaces_1.PlayerChannelOperation.SpecificUpdate);
    };
    Game.prototype.doStartingPlayerStuff = function (player) {
        var messageData = {
            when: Date.now(),
            type: interfaces_1.AdventureLogEventType.Meta,
            message: "Welcome to IdleLands! Please check out your choices tab to get a sampling of what sort of things you'll encounter.\n      Hit the link attached to this message to view the FAQ / New Player Guide to answer some of your questions!",
            link: 'https://help.idle.land'
        };
        this.subscriptionManager.emitToChannel(interfaces_1.Channel.PlayerAdventureLog, { playerNames: [player.name], data: messageData });
        this.eventManager.doEventFor(player, interfaces_1.EventName.FindItem);
        player.emit(interfaces_1.ServerEventName.CharacterFirstTime, {});
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", logger_1.Logger)
    ], Game.prototype, "logger", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", il3_linker_1.IL3Linker)
    ], Game.prototype, "il3Linker", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", database_manager_1.DatabaseManager)
    ], Game.prototype, "databaseManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", asset_manager_1.AssetManager)
    ], Game.prototype, "assetManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", personality_manager_1.PersonalityManager)
    ], Game.prototype, "personalityManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", achievement_manager_1.AchievementManager)
    ], Game.prototype, "achievementManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", player_manager_1.PlayerManager)
    ], Game.prototype, "playerManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", item_generator_1.ItemGenerator)
    ], Game.prototype, "itemGenerator", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", discord_manager_1.DiscordManager)
    ], Game.prototype, "discordManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", subscription_manager_1.SubscriptionManager)
    ], Game.prototype, "subscriptionManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", event_manager_1.EventManager)
    ], Game.prototype, "eventManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", buff_manager_1.BuffManager)
    ], Game.prototype, "buffManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", movement_helper_1.MovementHelper)
    ], Game.prototype, "movementHelper", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", holiday_helper_1.HolidayHelper)
    ], Game.prototype, "holidayHelper", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", profession_helper_1.ProfessionHelper)
    ], Game.prototype, "professionHelper", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", chat_helper_1.ChatHelper)
    ], Game.prototype, "chatHelper", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", party_manager_1.PartyManager)
    ], Game.prototype, "partyManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", party_helper_1.PartyHelper)
    ], Game.prototype, "partyHelper", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", pet_helper_1.PetHelper)
    ], Game.prototype, "petHelper", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", rng_service_1.RNGService)
    ], Game.prototype, "rngService", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", combat_helper_1.CombatHelper)
    ], Game.prototype, "combatHelper", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", calculator_helper_1.CalculatorHelper)
    ], Game.prototype, "calculatorHelper", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", festival_manager_1.FestivalManager)
    ], Game.prototype, "festivalManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", gm_helper_1.GMHelper)
    ], Game.prototype, "gmHelper", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", world_1.World)
    ], Game.prototype, "world", void 0);
    Game = tslib_1.__decorate([
        typescript_ioc_1.Singleton
    ], Game);
    return Game;
}());
exports.Game = Game;
//# sourceMappingURL=game.js.map
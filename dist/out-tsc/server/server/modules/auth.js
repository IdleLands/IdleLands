"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var uuid = require("uuid/v4");
var lodash_1 = require("lodash");
var profanity_filter_1 = require("../core/static/profanity-filter");
var interfaces_1 = require("../../shared/interfaces");
var models_1 = require("../../shared/models");
var SignInEvent = /** @class */ (function (_super) {
    tslib_1.__extends(SignInEvent, _super);
    function SignInEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.AuthSignIn;
        _this.description = 'Sign in to IdleLands anonymously.';
        _this.args = 'userId';
        return _this;
    }
    SignInEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { userId: '', authToken: '' } : _a, userId = _b.userId, authToken = _b.authToken;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var searchOpts, decodedToken, e_1, character, loggedInPlayer;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // if(this.playerName) return this.gameError('You are already connected!');
                        if (!userId && !authToken)
                            return [2 /*return*/, this.gameError(this.event + " requires a userId or an authToken.")];
                        searchOpts = { currentUserId: userId };
                        if (!authToken) return [3 /*break*/, 4];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.game.databaseManager.verifyToken(authToken)];
                    case 2:
                        decodedToken = _c.sent();
                        searchOpts = { authId: decodedToken.uid };
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _c.sent();
                        this.gameError('Auth token could not be decoded correctly.');
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, this.game.databaseManager.checkIfPlayerExists(searchOpts)];
                    case 5:
                        character = _c.sent();
                        if (!character) {
                            this.emit(interfaces_1.ServerEventName.AuthNeedsName, {});
                            return [2 /*return*/];
                        }
                        loggedInPlayer = this.game.playerManager.getPlayer(character.name);
                        if (loggedInPlayer) {
                            character.sessionId = loggedInPlayer.sessionId;
                        }
                        this.emit(interfaces_1.ServerEventName.CharacterSync, loggedInPlayer || character);
                        return [2 /*return*/];
                }
            });
        });
    };
    return SignInEvent;
}(models_1.ServerSocketEvent));
exports.SignInEvent = SignInEvent;
var SignOutEvent = /** @class */ (function (_super) {
    tslib_1.__extends(SignOutEvent, _super);
    function SignOutEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.AuthSignOut;
        _this.description = 'Sign out of IdleLands.';
        _this.args = '';
        return _this;
    }
    SignOutEvent.prototype.callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player;
            return tslib_1.__generator(this, function (_a) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                player.loggedIn = false;
                this.game.databaseManager.savePlayer(player);
                this.game.playerManager.removePlayer(player);
                this.setPlayer(null);
                this.gameMessage('Come back and idle any time!');
                return [2 /*return*/];
            });
        });
    };
    return SignOutEvent;
}(models_1.ServerSocketEvent));
exports.SignOutEvent = SignOutEvent;
var DeleteEvent = /** @class */ (function (_super) {
    tslib_1.__extends(DeleteEvent, _super);
    function DeleteEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.AuthDelete;
        _this.description = 'Delete your IdleLands character.';
        _this.args = '';
        return _this;
    }
    DeleteEvent.prototype.callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player;
            return tslib_1.__generator(this, function (_a) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                if (player.authId)
                    return [2 /*return*/, this.gameError('Please unsync before you delete your character!')];
                this.game.databaseManager.deletePlayer(player);
                this.game.playerManager.removePlayer(player);
                this.gameMessage('Goodbye forever :(');
                return [2 /*return*/];
            });
        });
    };
    return DeleteEvent;
}(models_1.ServerSocketEvent));
exports.DeleteEvent = DeleteEvent;
var RegisterEvent = /** @class */ (function (_super) {
    tslib_1.__extends(RegisterEvent, _super);
    function RegisterEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.AuthRegister;
        _this.description = 'Sign in to IdleLands with a name and a userid.';
        _this.args = 'userId, name';
        return _this;
    }
    RegisterEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { userId: '', name: '' } : _a, userId = _b.userId, name = _b.name;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var character, checkCharacter, checkCharacterId;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.playerName)
                            return [2 /*return*/, this.gameError('You are already connected!')];
                        if (!userId || !name)
                            return [2 /*return*/, this.gameError(this.event + " requires a userId and a name.")];
                        if (name.length < 2 || name.length > 20)
                            return [2 /*return*/, this.gameError("Character name must be between 2 and 20 characters.")];
                        if (profanity_filter_1.censorSensor.isProfaneIsh(name))
                            return [2 /*return*/, this.gameError("Character name is a bit too crude.")];
                        return [4 /*yield*/, this.game.databaseManager.checkIfPlayerExists({ currentUserId: userId, name: name })];
                    case 1:
                        character = _c.sent();
                        if (!!character) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.game.databaseManager.checkIfPlayerExists({ name: name })];
                    case 2:
                        checkCharacter = _c.sent();
                        if (checkCharacter)
                            return [2 /*return*/, this.gameError('Someone has already registered a character with that name.')];
                        return [4 /*yield*/, this.game.databaseManager.checkIfPlayerExists({ userId: userId })];
                    case 3:
                        checkCharacterId = _c.sent();
                        if (checkCharacterId) {
                            return [2 /*return*/, this.gameError("Seems like you already have a character registered to that id.\n        To re-use your current id you need to delete your current character.\n        If you want to have multiple simultaneous characters you need to use different devices.")];
                        }
                        return [4 /*yield*/, this.game.databaseManager.createPlayer(this.game, name, userId)];
                    case 4:
                        // if there is no one by that name, create a player
                        character = _c.sent();
                        _c.label = 5;
                    case 5:
                        this.emit(interfaces_1.ServerEventName.CharacterSync, character);
                        return [2 /*return*/];
                }
            });
        });
    };
    return RegisterEvent;
}(models_1.ServerSocketEvent));
exports.RegisterEvent = RegisterEvent;
var SyncAccountEvent = /** @class */ (function (_super) {
    tslib_1.__extends(SyncAccountEvent, _super);
    function SyncAccountEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.AuthSyncAccount;
        _this.description = 'Lock your account down using a non-anonymous method.';
        _this.args = '';
        return _this;
    }
    SyncAccountEvent.prototype.callback = function (_a) {
        var token = (_a === void 0 ? { token: '' } : _a).token;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loggedInPlayer, setKey, e_2;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!token)
                            return [2 /*return*/, this.gameError('You need to specify a token.')];
                        loggedInPlayer = this.player;
                        if (!loggedInPlayer)
                            return [2 /*return*/, this.gameError('Not currently logged in anywhere.')];
                        setKey = false;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.game.databaseManager.setAuthKey(loggedInPlayer, token)];
                    case 2:
                        setKey = _b.sent();
                        if (lodash_1.isString(setKey))
                            return [2 /*return*/, this.gameError(setKey)];
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _b.sent();
                        this.gameError(e_2.message);
                        return [3 /*break*/, 4];
                    case 4:
                        if (setKey === true) {
                            this.game.updatePlayer(loggedInPlayer);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return SyncAccountEvent;
}(models_1.ServerSocketEvent));
exports.SyncAccountEvent = SyncAccountEvent;
var UnsyncAccountEvent = /** @class */ (function (_super) {
    tslib_1.__extends(UnsyncAccountEvent, _super);
    function UnsyncAccountEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.AuthUnsyncAccount;
        _this.description = 'Remove your synced account information.';
        _this.args = '';
        return _this;
    }
    UnsyncAccountEvent.prototype.callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var loggedInPlayer, setKey, e_3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        loggedInPlayer = this.player;
                        if (!loggedInPlayer)
                            return [2 /*return*/, this.gameError('Not currently logged in anywhere.')];
                        setKey = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.game.databaseManager.setAuthKey(loggedInPlayer, '', true)];
                    case 2:
                        setKey = _a.sent();
                        if (lodash_1.isString(setKey))
                            return [2 /*return*/, this.gameError(setKey)];
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        this.gameError(e_3.message);
                        return [3 /*break*/, 4];
                    case 4:
                        if (setKey) {
                            this.game.updatePlayer(loggedInPlayer);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return UnsyncAccountEvent;
}(models_1.ServerSocketEvent));
exports.UnsyncAccountEvent = UnsyncAccountEvent;
var PlayGameEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PlayGameEvent, _super);
    function PlayGameEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PlayGame;
        _this.description = 'Join the game!';
        _this.args = 'userId, sessionId, authToken, relogin';
        return _this;
    }
    PlayGameEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { userId: '', sessionId: '', authToken: '', relogin: false } : _a, userId = _b.userId, sessionId = _b.sessionId, authToken = _b.authToken, relogin = _b.relogin;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var characterPreObj, searchOpts, decodedToken, e_4, characterCheck, loggedInPlayer, loggedInFromAnotherServerPlayer, character, setCharacter;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.playerName) {
                            characterPreObj = this.game.playerManager.getPlayer(this.playerName);
                            this.emit(interfaces_1.ServerEventName.CharacterSync, characterPreObj);
                            this.emit(interfaces_1.ServerEventName.PlayGame);
                            return [2 /*return*/, this.gameError('You are already connected!')];
                        }
                        if (!userId && !authToken)
                            return [2 /*return*/, this.gameError(this.event + " requires a userId or an authToken.")];
                        searchOpts = { currentUserId: userId };
                        if (!authToken) return [3 /*break*/, 4];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.game.databaseManager.verifyToken(authToken)];
                    case 2:
                        decodedToken = _c.sent();
                        searchOpts = { authId: decodedToken.uid };
                        return [3 /*break*/, 4];
                    case 3:
                        e_4 = _c.sent();
                        this.gameError('Auth token could not be decoded correctly.');
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, this.game.databaseManager.checkIfPlayerExists(searchOpts)];
                    case 5:
                        characterCheck = _c.sent();
                        if (!characterCheck) {
                            if (userId && relogin && !sessionId)
                                return [2 /*return*/];
                            return [2 /*return*/, this.gameError('Your character does not exist.')];
                        }
                        loggedInPlayer = this.game.playerManager.getPlayer(characterCheck.name);
                        loggedInFromAnotherServerPlayer = this.game.playerManager.getSimplePlayer(characterCheck.name);
                        // check first the logged in player to see if it exists, and if we match
                        if (loggedInPlayer && loggedInPlayer.loggedIn && sessionId !== loggedInPlayer.sessionId) {
                            return [2 /*return*/, this.gameError('Unable to log in, please wait 30 seconds and try again.')];
                        }
                        // thirdly, check the character to see if it is logged in (fallback)
                        if (!loggedInPlayer && loggedInFromAnotherServerPlayer && characterCheck.loggedIn) {
                            return [2 /*return*/, this.gameError('You are already logged in elsewhere.')];
                        }
                        return [4 /*yield*/, this.game.databaseManager.loadPlayer(this.game, searchOpts)];
                    case 6:
                        character = _c.sent();
                        if (!character)
                            return [2 /*return*/, this.gameError('Your player could not be loaded for some reason.')];
                        if (!relogin)
                            this.gameSuccess("Welcome back, " + character.name + "!");
                        character.sessionId = uuid();
                        // if we have an auth token, or we have a current user id, we can change to a new user id
                        if (authToken && userId) {
                            character.currentUserId = userId;
                        }
                        setCharacter = loggedInPlayer || character;
                        this.game.playerManager.addPlayer(setCharacter, this);
                        this.setPlayer(setCharacter);
                        this.game.databaseManager.savePlayer(setCharacter);
                        this.emit(interfaces_1.ServerEventName.CharacterSync, setCharacter);
                        this.emit(interfaces_1.ServerEventName.PlayGame);
                        setTimeout(function () {
                            setCharacter.tryToDoNewCharacter();
                        }, 500);
                        return [2 /*return*/];
                }
            });
        });
    };
    return PlayGameEvent;
}(models_1.ServerSocketEvent));
exports.PlayGameEvent = PlayGameEvent;
//# sourceMappingURL=auth.js.map
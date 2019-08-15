"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var typeorm_1 = require("typeorm");
var lodash_1 = require("lodash");
var lzutf8_1 = require("lzutf8");
var firebaseAdmin = require("firebase-admin");
var models_1 = require("../../../shared/models");
var logger_1 = require("../logger");
var shared_fields_1 = require("./shared-fields");
var Festivals_entity_1 = require("../../../shared/models/entity/Festivals.entity");
var firebaseKey = process.env.FIREBASE_ADMIN_JSON;
var firebaseProj = process.env.FIREBASE_ADMIN_DATABASE;
var DatabaseManager = /** @class */ (function () {
    function DatabaseManager() {
    }
    DatabaseManager.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var opts, _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (firebaseKey && firebaseProj) {
                            this.firebase = firebaseAdmin.initializeApp({
                                credential: firebaseAdmin.credential.cert(JSON.parse(lzutf8_1.decompress(firebaseKey, { inputEncoding: 'Base64' }))),
                                databaseURL: firebaseProj
                            });
                        }
                        return [4 /*yield*/, typeorm_1.getConnectionOptions()];
                    case 1:
                        opts = _b.sent();
                        opts.useNewUrlParser = true;
                        _a = this;
                        return [4 /*yield*/, typeorm_1.createConnection(opts)];
                    case 2:
                        _a.connection = _b.sent();
                        this.manager = typeorm_1.getMongoManager();
                        this.updateOldData();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.updateOldData = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.manager.updateMany(models_1.Player, {}, { $set: { loggedIn: false } })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // internal API calls
    DatabaseManager.prototype.checkIfPlayerExists = function (query) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connection)
                            return [2 /*return*/, null];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.manager.findOne(models_1.Player, query)];
                    case 2:
                        player = _a.sent();
                        return [2 /*return*/, player];
                    case 3:
                        e_1 = _a.sent();
                        this.logger.error("DatabaseManager#checkIfPlayerExists", e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // PLAYER FUNCTIONS
    DatabaseManager.prototype.createPlayer = function (game, name, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, e_2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connection)
                            return [2 /*return*/, null];
                        player = new models_1.Player();
                        lodash_1.extend(player, { name: name, userId: userId, currentUserId: userId, $game: game });
                        player.init();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.savePlayer(player)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, player];
                    case 3:
                        e_2 = _a.sent();
                        this.logger.error("DatabaseManager#createPlayer");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.loadPlayer = function (game, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player_1, allUpdatedFields, e_3;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connection)
                            return [2 /*return*/, null];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.connection.manager.findOne(models_1.Player, query)];
                    case 2:
                        player_1 = _a.sent();
                        return [4 /*yield*/, Promise.all(shared_fields_1.SHARED_FIELDS.map(function (x) { return _this.connection.manager.findOne(x.proto, { owner: player_1.name }); }))];
                    case 3:
                        allUpdatedFields = _a.sent();
                        allUpdatedFields.forEach(function (data, i) {
                            var matchingKey = shared_fields_1.SHARED_FIELDS[i].name;
                            player_1["$" + matchingKey] = data;
                        });
                        player_1.$game = game;
                        player_1.init();
                        return [2 /*return*/, player_1];
                    case 4:
                        e_3 = _a.sent();
                        this.logger.error("DatabaseManager#loadPlayer", e_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.findPlayerWithDiscordTag = function (discordTag) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (!this.connection)
                    return [2 /*return*/, null];
                return [2 /*return*/, this.connection.manager.findOne(models_1.Player, { discordTag: discordTag })];
            });
        });
    };
    DatabaseManager.prototype.findPlayerWithIL3Name = function (il3CharName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (!this.connection)
                    return [2 /*return*/, null];
                return [2 /*return*/, this.connection.manager.findOne(models_1.Player, { il3CharName: il3CharName })];
            });
        });
    };
    DatabaseManager.prototype.savePlayer = function (player) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var saveObj, e_4;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connection)
                            return [2 /*return*/, null];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, Promise.all(shared_fields_1.SHARED_FIELDS.map(function (x) { return _this.connection.manager.save(x.proto, player["$" + x.name].toSaveObject()); }))];
                    case 2:
                        _a.sent();
                        saveObj = player.toSaveObject();
                        saveObj._id = player._id;
                        return [4 /*yield*/, this.connection.manager.save(models_1.Player, saveObj)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_4 = _a.sent();
                        this.logger.error("DatabaseManager#savePlayer", e_4);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.deletePlayer = function (player) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var saveObj, e_5;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connection)
                            return [2 /*return*/, null];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, Promise.all([
                                shared_fields_1.SHARED_FIELDS.map(function (x) { return _this.connection.manager.remove(x.proto, player["$" + x.name]); })
                            ])];
                    case 2:
                        _a.sent();
                        saveObj = player.toSaveObject();
                        saveObj._id = player._id;
                        return [4 /*yield*/, this.connection.manager.remove(models_1.Player, saveObj)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_5 = _a.sent();
                        this.logger.error("DatabaseManager#removePlayer", e_5);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DatabaseManager.prototype.renamePlayer = function (playerName, newName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.manager.updateOne(models_1.Player, { name: playerName }, { $set: { name: newName } })];
            });
        });
    };
    DatabaseManager.prototype.movePlayerToNewId = function (playerName, newPlayerName) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var curId1, curId2;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.manager.findOne(models_1.Player, { name: playerName })];
                    case 1:
                        curId1 = _a.sent();
                        return [4 /*yield*/, this.manager.findOne(models_1.Player, { name: newPlayerName })];
                    case 2:
                        curId2 = _a.sent();
                        if (!curId1 || !curId2)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.manager.updateOne(models_1.Player, { name: playerName }, { $set: { currentUserId: curId2.currentUserId } })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.manager.updateOne(models_1.Player, { name: newPlayerName }, { $set: { currentUserId: curId1.currentUserId } })];
                    case 4:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    DatabaseManager.prototype.verifyToken = function (token) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, this.firebase.auth().verifyIdToken(token)];
            });
        });
    };
    DatabaseManager.prototype.setAuthKey = function (player, token, removeToken) {
        if (removeToken === void 0) { removeToken = false; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var decoded, provider, uid, existingAuthPlayer;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connection)
                            return [2 /*return*/, null];
                        if (!this.firebase)
                            throw new Error('No firebase admin connection!');
                        if (removeToken) {
                            this.firebase.auth().deleteUser(player.authId);
                            player.authType = null;
                            player.authId = null;
                            player.authSyncedTo = null;
                            this.savePlayer(player);
                            return [2 /*return*/, true];
                        }
                        return [4 /*yield*/, this.verifyToken(token)];
                    case 1:
                        decoded = _a.sent();
                        provider = decoded.firebase.sign_in_provider;
                        uid = decoded.uid;
                        if (player.authId === uid)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, this.connection.manager.findOne(models_1.Player, { authId: uid })];
                    case 2:
                        existingAuthPlayer = _a.sent();
                        if (existingAuthPlayer && existingAuthPlayer.name !== player.name)
                            return [2 /*return*/, 'Account already synced to another player.'];
                        player.authType = provider;
                        player.authId = uid;
                        player.authSyncedTo = decoded.name || decoded.email || 'unknown';
                        this.savePlayer(player);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    // ASSET FUNCTIONS
    DatabaseManager.prototype.loadAssets = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (!this.connection)
                    return [2 /*return*/, null];
                try {
                    return [2 /*return*/, this.connection.manager.findOne(models_1.Assets)];
                }
                catch (e) {
                    this.logger.error("DatabaseManager#loadAssets", e);
                }
                return [2 /*return*/];
            });
        });
    };
    // FESTIVAL FUNCTIONS
    DatabaseManager.prototype.loadFestivals = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (!this.connection)
                    return [2 /*return*/, null];
                try {
                    return [2 /*return*/, this.connection.manager.findOne(Festivals_entity_1.Festivals)];
                }
                catch (e) {
                    this.logger.error("DatabaseManager#loadFestivals", e);
                }
                return [2 /*return*/];
            });
        });
    };
    DatabaseManager.prototype.saveFestivals = function (festivals) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_6;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connection)
                            return [2 /*return*/, null];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.manager.save(Festivals_entity_1.Festivals, festivals)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_6 = _a.sent();
                        this.logger.error("DatabaseManager#saveFestivals", e_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // SETTINGS FUNCTIONS
    DatabaseManager.prototype.loadSettings = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                if (!this.connection)
                    return [2 /*return*/, null];
                try {
                    return [2 /*return*/, this.connection.manager.findOne(models_1.GameSettings)];
                }
                catch (e) {
                    this.logger.error("DatabaseManager#loadSettings", e);
                }
                return [2 /*return*/];
            });
        });
    };
    DatabaseManager.prototype.saveSettings = function (settings) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_7;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connection)
                            return [2 /*return*/, null];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.connection.manager.save(models_1.GameSettings, settings)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_7 = _a.sent();
                        this.logger.error("DatabaseManager#saveSettings", e_7);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", logger_1.Logger)
    ], DatabaseManager.prototype, "logger", void 0);
    DatabaseManager = tslib_1.__decorate([
        typescript_ioc_1.Singleton
    ], DatabaseManager);
    return DatabaseManager;
}());
exports.DatabaseManager = DatabaseManager;
//# sourceMappingURL=database-manager.js.map
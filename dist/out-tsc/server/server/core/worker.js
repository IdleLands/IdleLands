"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var game_1 = require("./game/game");
var SCWorker = require('socketcluster/scworker');
var express = require('express');
var compression = require('compression');
var morgan = require('morgan');
var rateLimit = require('express-rate-limit');
var cors = require('cors');
var healthChecker = require('sc-framework-health-check');
var scCodecMinBin = require('sc-codec-min-bin');
var allEvents = require('../modules');
var allAPI = require('../http');
var GRACE_PERIOD_DISCONNECT = process.env.GRACE_PERIOD_DISCONNECT ? +process.env.GRACE_PERIOD_DISCONNECT : 30000;
var GameWorker = /** @class */ (function (_super) {
    tslib_1.__extends(GameWorker, _super);
    function GameWorker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameWorker.prototype.run = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var httpServer, scServer, game, environment, app, limiter, api;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('   >> Worker PID:', process.pid, 'ID:', this.id);
                        httpServer = this.httpServer;
                        scServer = this.scServer;
                        scServer.setCodecEngine(scCodecMinBin);
                        game = new game_1.Game();
                        return [4 /*yield*/, game.init(scServer, this.id)];
                    case 1:
                        _a.sent();
                        environment = this.options.environment;
                        app = express();
                        app.use(compression());
                        if (environment === 'dev') {
                            app.use(morgan('dev'));
                            app.use(cors());
                        }
                        else {
                            app.use(cors({
                                origin: 'https://play.idle.land'
                            }));
                        }
                        // Add GET /health-check express route
                        healthChecker.attach(this, app);
                        limiter = rateLimit({
                            windowMs: 10 * 1000,
                            max: 10
                        });
                        if (process.env.NODE_ENV === 'production') {
                            app.use('/api/', limiter);
                        }
                        api = express();
                        Object.values(allAPI).forEach(function (API) {
                            API.init(api, game);
                        });
                        app.use('/api', api);
                        httpServer.on('request', app);
                        // initialize all the socket commands for the newly connected client
                        scServer.on('connection', function (socket) {
                            Object.values(allEvents).forEach(function (EvtCtor) {
                                var evtInst = new EvtCtor(game, socket);
                                socket.on(evtInst.event, function (args) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                    return tslib_1.__generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (evtInst.isDoingSomething)
                                                    return [2 /*return*/];
                                                evtInst.isDoingSomething = true;
                                                return [4 /*yield*/, evtInst.callback(args || {})];
                                            case 1:
                                                _a.sent();
                                                evtInst.isDoingSomething = false;
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                            });
                        });
                        // handle disconnecting the client from the player
                        // if they do not come back within GRACE_PERIOD_DISCONNECT, we remove their player from the game, too
                        scServer.on('disconnection', function (socket) {
                            if (!socket.playerName)
                                return;
                            var player = game.playerManager.getPlayer(socket.playerName);
                            if (!player)
                                return;
                            player.loggedIn = false;
                            setTimeout(function () {
                                var checkAgainPlayer = game.playerManager.getPlayer(socket.playerName);
                                if (!checkAgainPlayer || checkAgainPlayer && checkAgainPlayer.loggedIn)
                                    return;
                                game.playerManager.removePlayer(checkAgainPlayer);
                                game.databaseManager.savePlayer(checkAgainPlayer);
                            }, GRACE_PERIOD_DISCONNECT);
                        });
                        scServer.on('error', function (err) {
                            console.error(err);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return GameWorker;
}(SCWorker));
exports.GameWorker = GameWorker;
var gameWorker = new GameWorker();
//# sourceMappingURL=worker.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("../interfaces");
var ServerSocketEvent = /** @class */ (function () {
    function ServerSocketEvent(game, socket) {
        this.game = game;
        this.socket = socket;
    }
    Object.defineProperty(ServerSocketEvent.prototype, "playerName", {
        get: function () {
            return this.socket.playerName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ServerSocketEvent.prototype, "player", {
        get: function () {
            return this.game.playerManager.getPlayer(this.playerName);
        },
        enumerable: true,
        configurable: true
    });
    ServerSocketEvent.prototype.emit = function (event, data) {
        if (data === void 0) { data = {}; }
        this.socket.emit('gameevent', { name: event, data: data });
    };
    ServerSocketEvent.prototype.notConnected = function () {
        this.emit(interfaces_1.ServerEventName.GameMessage, { message: 'You aren\'t yet logged back in. Try again in a moment.' });
    };
    ServerSocketEvent.prototype.gameSuccess = function (err) {
        this.emit(interfaces_1.ServerEventName.GameMessage, { message: err, type: 'success' });
    };
    ServerSocketEvent.prototype.gameError = function (err) {
        this.emit(interfaces_1.ServerEventName.GameMessage, { message: err, type: 'danger' });
    };
    ServerSocketEvent.prototype.gameWarning = function (err) {
        this.emit(interfaces_1.ServerEventName.GameMessage, { message: err, type: 'warning' });
    };
    ServerSocketEvent.prototype.gameMessage = function (err) {
        this.emit(interfaces_1.ServerEventName.GameMessage, { message: err });
    };
    ServerSocketEvent.prototype.setPlayer = function (player) {
        if (!player) {
            this.socket.playerName = null;
            return;
        }
        this.socket.playerName = player.name;
    };
    return ServerSocketEvent;
}());
exports.ServerSocketEvent = ServerSocketEvent;
//# sourceMappingURL=ServerSocketEvent.js.map
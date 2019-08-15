"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var Discord = require("discord.js");
var logger_1 = require("../logger");
var DiscordManager = /** @class */ (function () {
    function DiscordManager() {
        this.onMessageCallback = function (msg) { };
    }
    DiscordManager.prototype.init = function (onMessageCallback, canServerNodeRunDiscord) {
        if (canServerNodeRunDiscord === void 0) { canServerNodeRunDiscord = true; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var e_1;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!process.env.DISCORD_SECRET || !canServerNodeRunDiscord)
                            return [2 /*return*/];
                        this.onMessageCallback = onMessageCallback;
                        this.discord = new Discord.Client();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.discord.login(process.env.DISCORD_SECRET)];
                    case 2:
                        _a.sent();
                        this.logger.log('Discord', 'Connected!');
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        this.logger.error("Discord", e_1.message);
                        return [2 /*return*/];
                    case 4:
                        this.discordGuild = this.discord.guilds.get(process.env.DISCORD_GUILD_ID);
                        this.discordChannel = this.discord.channels.get(process.env.DISCORD_CHANNEL_ID);
                        this.discord.on('error', function (error) {
                            _this.logger.error(new Error(error.message));
                        });
                        this.discord.on('message', function (message) {
                            if (message.channel.id !== _this.discordChannel.id || message.author.bot)
                                return;
                            var content = message.cleanContent;
                            if (!content) {
                                var attachment = message.attachments.first();
                                if (attachment) {
                                    content = attachment.url;
                                }
                            }
                            if (!content)
                                return;
                            _this.onMessageCallback({
                                fromDiscord: true,
                                timestamp: Date.now(),
                                playerName: message.member.displayName,
                                message: content
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    DiscordManager.prototype.updateUserCount = function (userCount) {
        if (!this.discordChannel)
            return;
        this.discordChannel.setTopic(userCount + " player(s) in game");
    };
    DiscordManager.prototype.sendMessage = function (message) {
        if (!this.discordChannel)
            return;
        this.discordChannel.send(message);
    };
    DiscordManager.prototype.discordUserWithTag = function (tag) {
        if (!this.discordChannel)
            return null;
        return this.discord.users.find(function (u) { return u.username + "#" + u.discriminator === tag; });
    };
    DiscordManager.prototype.isTagInDiscord = function (tag) {
        if (!this.discordChannel)
            return false;
        return !!this.discordUserWithTag(tag);
    };
    DiscordManager.prototype.hasRole = function (tag, role) {
        var roles = this.getUserRoles(tag);
        if (!roles)
            return false;
        return !!roles.find(function (r) { return r.name === role; });
    };
    DiscordManager.prototype.getUserRoles = function (tag) {
        var guildUser = this.discordGuild.members.find(function (u) { return u.user.username + "#" + u.user.discriminator === tag; });
        if (!guildUser)
            return null;
        return guildUser.roles;
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", logger_1.Logger)
    ], DiscordManager.prototype, "logger", void 0);
    DiscordManager = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], DiscordManager);
    return DiscordManager;
}());
exports.DiscordManager = DiscordManager;
//# sourceMappingURL=discord-manager.js.map
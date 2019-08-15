"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var SCBroker = require('socketcluster/scbroker');
var scClusterBrokerClient = require('scc-broker-client');
var scRedis = require('sc-redis');
var Broker = /** @class */ (function (_super) {
    tslib_1.__extends(Broker, _super);
    function Broker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Broker.prototype.run = function () {
        console.log('   >> Broker PID:', process.pid);
        // This is defined in server.js (taken from environment constiable SC_CLUSTER_STATE_SERVER_HOST).
        // If this property is defined, the broker will try to attach itself to the SC cluster for
        // automatic horizontal scalability.
        // This is mostly intended for the Kubernetes deployment of SocketCluster - In this case,
        // The clustering/sharding all happens automatically.
        if (this.options.clusterStateServerHost) {
            scClusterBrokerClient.attach(this, {
                stateServerHost: this.options.clusterStateServerHost,
                stateServerPort: this.options.clusterStateServerPort,
                mappingEngine: this.options.clusterMappingEngine,
                clientPoolSize: this.options.clusterClientPoolSize,
                authKey: this.options.clusterAuthKey,
                stateServerConnectTimeout: this.options.clusterStateServerConnectTimeout,
                stateServerAckTimeout: this.options.clusterStateServerAckTimeout,
                stateServerReconnectRandomness: this.options.clusterStateServerReconnectRandomness
            });
        }
        if (this.options.brokerOptions && this.options.brokerOptions.host) {
            scRedis.attach(this);
        }
    };
    return Broker;
}(SCBroker));
exports.Broker = Broker;
var broker = new Broker();
//# sourceMappingURL=broker.js.map
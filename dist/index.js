"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@actions/core");
var github_1 = require("@actions/github");
var hotloop_sdk_1 = require("@hotloop/hotloop-sdk");
var ConfigFactory_1 = require("./ConfigFactory");
var syncCoverage = function (config) {
    var opts = { userAgent: 'coverage-action', timeout: 5000, retries: 3, retryDelay: 1000 };
    var client = hotloop_sdk_1.HotLoopSdkFactory.getInstance(config.key, opts);
    return client.syncCoverage(config.options);
};
var setFailure = function (error) { return core_1.setFailed(error.message); };
var logCorrelation = function (correlationId) { return core_1.info("Correlation ID: " + correlationId); };
ConfigFactory_1.ConfigFactory.get(core_1.getInput, github_1.context)
    .then(syncCoverage)
    .then(logCorrelation)
    .catch(setFailure);
//# sourceMappingURL=index.js.map
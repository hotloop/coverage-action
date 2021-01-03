"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@actions/core");
var ConfigFactory_1 = require("./ConfigFactory");
var github = require('@actions/github');
var HotLoopSdkFactory = require('@hotloop/hotloop-sdk').HotLoopSdkFactory;
var publishCoverage = function (config) {
    var opts = { userAgent: 'coverage-action', timeout: 5000, retries: 3, retryDelay: 1000 };
    var client = HotLoopSdkFactory.getInstance(config.token, opts);
    return client.syncCoverage(config.options);
};
var setFailure = function (error) { return core_1.setFailed(error.message); };
var logCorrelation = function (correlationId) { return core_1.info("Correlation ID: " + correlationId); };
ConfigFactory_1.ConfigFactory.get(core_1.getInput, github.context)
    .then(publishCoverage)
    .then(logCorrelation)
    .catch(setFailure);
//# sourceMappingURL=index.js.map
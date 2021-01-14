"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigFactory = void 0;
var glob_1 = require("@actions/glob");
var fs_1 = require("fs");
var ConfigFactory = /** @class */ (function () {
    function ConfigFactory() {
    }
    ConfigFactory.get = function (inputFn, githubContext) {
        var options = { required: true };
        var key = inputFn('hotloop-key', options);
        var reportPath = inputFn('report-path', options);
        var context = githubContext.payload;
        if (key === '')
            return Promise.reject(new Error('invalid hotloop key'));
        if (reportPath === '')
            return Promise.reject(new Error('invalid report path'));
        if (!context.repository || !context.repository.html_url)
            return Promise.reject(new Error('invalid github context'));
        return glob_1.create(reportPath)
            .then(function (globber) { return globber.glob(); })
            .then(function (files) { return fs_1.promises.readFile(files[0]); })
            .then(function (report) { return ({
            key: key,
            options: {
                lcov: report.toString(),
                repository: context.repository ? context.repository.html_url : null,
                branch: context.pull_request ? context.pull_request.head.ref : context.ref.substr(11),
                issueNumber: context.pull_request ? context.pull_request.number : null
            }
        }); });
    };
    return ConfigFactory;
}());
exports.ConfigFactory = ConfigFactory;
//# sourceMappingURL=ConfigFactory.js.map
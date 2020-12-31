const { promises: fs } = require('fs')
const core = require('@actions/core')
const github = require('@actions/github')
const glob = require('@actions/glob')
const { HotLoopSdkFactory } = require('@hotloop/hotloop-sdk')

const getConfig = () => {
  const token = core.getInput('token')
  const reportPath = core.getInput('report-path')
  const context = github.context.payload
  const isPr = !!context.pull_request

  return glob.create(reportPath)
    .then(globber => globber.glob())
    .then(files => fs.readFile(files[0]))
    .then(lcov => ({
      token,
      options: {
        lcov: lcov.toString(),
        repository: context.repository.html_url,
        branch: isPr ? context.pull_request.head.ref : context.ref.substr(11),
        issueNumber: isPr ? context.pull_request.number : null
      }
    }))
}

const publishCoverage = config => {
  const opts = { userAgent: 'coverage-action', timeout: 5000, retries: 3, retryDelay: 1000 }
  const client = HotLoopSdkFactory.getInstance(config.token, opts)
  return client.syncCoverage(config.options)
}

const setFailure = error => core.setFailed(error.message)

const logCorrelation = correlationId => core.info(`Correlation ID: ${correlationId}`)

return Promise.resolve()
  .then(getConfig)
  .then(publishCoverage)
  .then(logCorrelation)
  .catch(setFailure)
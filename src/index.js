const fs = require('fs')
const core = require('@actions/core')
const github = require('@actions/github')
const { HotloopClient } = require('./hotloop-client')

const nullOrEmpty = val => val === null || val === ''

const getConfig = () => {
  const token = core.getInput('token')
  const reportPath = core.getInput('report-path')
  const context = github.context.payload
  const isPr = !!context.pull_request

  const lcov = fs.readFileSync(reportPath)
  if (nullOrEmpty(lcov)) throw new Error('Invalid lcov')

  return {
    token,
    options: {
      lcov: lcov.toString(),
      repository: context.repository.html_url,
      branch: isPr ? context.pull_request.head.ref : context.ref.substr(11),
      issueNumber: isPr ? context.pull_request.number : null
    }
  }
}

const publishCoverage = config => {
  const client = new HotloopClient(config.token)
  return client.reportCoverage(config.options)
}

const setFailure = error => core.setFailed(error.message)

const logCorrelation = correlationId => core.info(`Correlation ID: ${correlationId}`)

return Promise.resolve()
  .then(getConfig)
  .then(publishCoverage)
  .then(logCorrelation)
  .catch(setFailure)
const fs = require('fs')
const core = require('@actions/core')
const github = require('@actions/github')
const { HotloopClient } = require('./hotloop-client')

const nullOrEmpty = val => val === null || val === ''

const getConfig = () => {
  const reportPath = core.getInput('report-path')
  const token = core.getInput('token')

  const {
    repository: {
      html_url: repository
    },
    pull_request: {
      number: issueNumber,
      base: {
        ref: baseRef
      },
      head: {
        ref: headRef
      },
    }
  } = github.context.payload

  const isPr = !!headRef

  const lcov = fs.readFileSync(reportPath)
  if (nullOrEmpty(lcov)) throw new Error('Invalid lcov')

  return {
    token,
    options: {
      lcov: lcov.toString(),
      repository,
      branch: isPr ? headRef : baseRef,
      issueNumber: isPr ? issueNumber : null
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
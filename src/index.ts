import { CorrelationId } from '@hotloop/hotloop-sdk'
import { getInput, info, setFailed } from '@actions/core'
import { Config, ConfigFactory } from './ConfigFactory'

const github = require('@actions/github')
const { HotLoopSdkFactory } = require('@hotloop/hotloop-sdk')

const publishCoverage = (config: Config) => {
  const opts = { userAgent: 'coverage-action', timeout: 5000, retries: 3, retryDelay: 1000 }
  const client = HotLoopSdkFactory.getInstance(config.token, opts)
  return client.syncCoverage(config.options)
}

const setFailure = (error: Error) => setFailed(error.message)

const logCorrelation = (correlationId: CorrelationId) => info(`Correlation ID: ${correlationId}`)

ConfigFactory.get(getInput, github.context)
  .then(publishCoverage)
  .then(logCorrelation)
  .catch(setFailure)

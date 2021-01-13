import { getInput, info, setFailed } from '@actions/core'
import { context } from '@actions/github'
import { CorrelationId, HotLoopSdkFactory } from '@hotloop/hotloop-sdk'
import { Config, ConfigFactory } from './ConfigFactory'

const syncCoverage = (config: Config) => {
  const opts = { userAgent: 'coverage-action', timeout: 5000, retries: 3, retryDelay: 1000 }
  const client = HotLoopSdkFactory.getInstance(config.token, opts)
  return client.syncCoverage(config.options)
}

const setFailure = (error: Error) => setFailed(error.message)

const logCorrelation = (correlationId: CorrelationId) => info(`Correlation ID: ${correlationId}`)

ConfigFactory.get(getInput, context)
  .then(syncCoverage)
  .then(logCorrelation)
  .catch(setFailure)

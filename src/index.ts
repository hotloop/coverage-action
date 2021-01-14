import { getInput, info, setFailed } from '@actions/core'
import { context } from '@actions/github'
import { CorrelationId, HotLoopSdkFactory } from '@hotloop/hotloop-sdk'
import { Config, ConfigFactory } from './ConfigFactory'
import { GoogleAuth } from 'google-auth-library'

const getAuthToken = () => {
  const keysEnvVar = process.env['HOTLOOP_KEY']
  if (!keysEnvVar) throw new Error('No hotloop keys provided')
  const credentials = JSON.parse(keysEnvVar)

  const targetAudience = 'https://europe-west3-hotloop-289416.cloudfunctions.net'
  const auth = new GoogleAuth({ credentials })
  return auth.getIdTokenClient(targetAudience)
    .then(client => client.idTokenProvider.fetchIdToken(targetAudience))
}

const syncCoverage = (config: Config) => {
  return getAuthToken()
    .then(token => {
      const opts = { userAgent: 'coverage-action', timeout: 5000, retries: 3, retryDelay: 1000 }
      const client = HotLoopSdkFactory.getInstance(token, opts)
      return client.syncCoverage(config.options)
    })
}

const setFailure = (error: Error) => setFailed(error.message)

const logCorrelation = (correlationId: CorrelationId) => info(`Correlation ID: ${correlationId}`)

ConfigFactory.get(getInput, context)
  .then(syncCoverage)
  .then(logCorrelation)
  .catch(setFailure)

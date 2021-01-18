import { InputOptions } from '@actions/core'
import { Context } from '@actions/github/lib/context'
import { create, Globber } from '@actions/glob'
import { WebhookPayload } from '@actions/github/lib/interfaces'
import { promises as fs } from 'fs'
import { SyncCoverageOptions } from '@hotloop/hotloop-sdk'

interface Config {
  key: string
  options: SyncCoverageOptions
}

type InputFunction = (name: string, options?: InputOptions) => string

class ConfigFactory {
  public static get (inputFn: InputFunction, githubContext: Context): Promise<Config> {
    const options = { required: true }
    const key: string = inputFn('hotloop-key', options)
    const reportPath: string = inputFn('report-path', options)
    const context: WebhookPayload = githubContext.payload

    if (key === '') return Promise.reject(new Error('invalid hotloop key'))
    if (reportPath === '') return Promise.reject(new Error('invalid report path'))
    if (!context.repository || !context.repository.html_url) return Promise.reject(new Error('invalid github context'))

    return create(reportPath)
      .then((globber: Globber) => globber.glob())
      .then((files: string[]) => fs.readFile(files[0]))
      .then((report: Buffer ) => ({
        key,
        options: {
          lcov: report.toString(),
          repository: context.repository ? context.repository.html_url : null,
          branch: context.pull_request ? context.pull_request.head.ref : context.ref.substr(11),
          issueNumber: context.pull_request ? context.pull_request.number : null
        }
      } as Config))
  }
}

export { ConfigFactory, InputFunction, Config }

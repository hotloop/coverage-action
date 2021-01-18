import { expect } from 'chai'
import { createSandbox, SinonSandbox, SinonStub } from 'sinon'
import { ConfigFactory, Config } from '../../../src/ConfigFactory'
import { Context } from '@actions/github/lib/context'
import { promises as fs } from 'fs'

describe('ConfigFactory', () => {
  let sandbox: SinonSandbox = createSandbox()
  let inputFn: SinonStub

  const token = 'test-token'
  const reportDirectory = 'coverage-test'
  const reportFileName = 'lcov.info'
  const reportPath = `${reportDirectory}/${reportFileName}`
  const reportData = 'test-coverage-data'

  const htmlUrl = 'https://github.com/hotloop/coverage-action'
  const repository = { html_url: htmlUrl }
  const issueNumber = 1
  const headRef = 'test-head-ref'
  const baseBranch = 'main'
  const ref = `refs/heads/${baseBranch}`

  const pullRequestGithubContext = {
    payload: {
      ref,
      repository,
      pull_request: {
        number: issueNumber,
        head: {
          ref: headRef
        }
      }
    }
  } as any as Context

  const mergeGithubContext = {
    payload: {
      ref,
      repository,
    }
  } as any as Context

  beforeEach(() => {
    inputFn = sandbox.stub()

    return fs.mkdir(reportDirectory)
      .then(() => fs.writeFile(reportPath, reportData, { encoding: 'utf-8' }))
  })

  afterEach(() => {
    sandbox.restore()
    return fs.rmdir(reportDirectory, { recursive: true })
  })

  it('throws when the token is not supplied', () => {
    const message = 'token not supplied'

    inputFn
      .withArgs('hotloop-key')
      .throws(new Error(message))

    const exec = () => ConfigFactory.get(inputFn, mergeGithubContext)
    return exec.should.throw(message)
  })

  it('throws when the report path is not supplied', () => {
    const message = 'report-path not supplied'

    inputFn
      .withArgs('token')
      .returns(token)
      .withArgs('report-path')
      .throws(new Error(message))

    const exec = () => ConfigFactory.get(inputFn, mergeGithubContext)
    return exec.should.throw(message)
  })

  it('rejects when an empty token is supplied', () => {
    inputFn
      .withArgs('hotloop-key')
      .returns('')
      .withArgs('report-path')
      .returns(reportPath)

    return ConfigFactory.get(inputFn, mergeGithubContext).should.eventually.be.rejectedWith('invalid hotloop key')
  })

  it('rejects when an empty report-path is supplied', () => {
    inputFn
      .withArgs('token')
      .returns(token)
      .withArgs('report-path')
      .returns('')

    return ConfigFactory.get(inputFn, mergeGithubContext).should.eventually.be.rejectedWith('invalid report path')
  })

  it('sets the token correctly', () => {
    inputFn
      .withArgs('hotloop-key')
      .returns(token)
      .withArgs('report-path')
      .returns(reportPath)

    return ConfigFactory.get(inputFn, mergeGithubContext)
      .then((config: Config) => config.key.should.deep.equal(token))
  })

  it('reads the report file', () => {
    inputFn
      .withArgs('token')
      .returns(token)
      .withArgs('report-path')
      .returns(reportPath)

    return ConfigFactory.get(inputFn, mergeGithubContext)
      .then((config: Config) => config.options.lcov.should.deep.equal(reportData))
  })

  it('sets the repository to the html_url', () => {
    inputFn
      .withArgs('token')
      .returns(token)
      .withArgs('report-path')
      .returns(reportPath)

    return ConfigFactory.get(inputFn, mergeGithubContext)
      .then((config: Config) => config.options.repository.should.deep.equal(htmlUrl))
  })

  describe('Pull Requests', () => {
    it('sets the branch name to the head ref', () => {
      inputFn
        .withArgs('token')
        .returns(token)
        .withArgs('report-path')
        .returns(reportPath)

      return ConfigFactory.get(inputFn, pullRequestGithubContext)
        .then((config: Config) => config.options.branch.should.deep.equal(headRef))
    })

    it('sets the issueNumber to the actual issue number', () => {
      inputFn
        .withArgs('token')
        .returns(token)
        .withArgs('report-path')
        .returns(reportPath)

      return ConfigFactory.get(inputFn, pullRequestGithubContext)
        .then((config: Config) => config.options.issueNumber.should.deep.equal(issueNumber))
    })
  })

  describe('Merge', () => {
    it('sets the branch name to the base base branch', () => {
      inputFn
        .withArgs('token')
        .returns(token)
        .withArgs('report-path')
        .returns(reportPath)

      return ConfigFactory.get(inputFn, mergeGithubContext)
        .then((config: Config) => config.options.branch.should.deep.equal(baseBranch))
    })

    it('sets the issueNumber to null', () => {
      inputFn
        .withArgs('token')
        .returns(token)
        .withArgs('report-path')
        .returns(reportPath)

      return ConfigFactory.get(inputFn, mergeGithubContext)
        .then((config: Config) => expect(config.options.issueNumber).to.equal(null))
    })
  })
})

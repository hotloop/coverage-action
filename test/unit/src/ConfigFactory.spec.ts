import { createSandbox, SinonSandbox, SinonStub } from 'sinon'
import { ConfigFactory } from '../../../src/ConfigFactory'
import { Context } from '@actions/github/lib/context'

describe('ConfigFactory', () => {
  let sandbox: SinonSandbox = createSandbox()
  let inputFn: SinonStub

  const token = 'test-token'
  const reportPath = 'coverage/lcov.info'

  beforeEach(() => {
    sandbox.reset()
    inputFn = sandbox.stub()
  })

  it('throws when the token is not supplied', () => {
    const message = 'token not supplied'

    inputFn
      .withArgs('token')
      .throws(new Error(message))

    const exec = () => ConfigFactory.get(inputFn, {} as Context)
    return exec.should.throw(message)
  })

  it('throws when the report path is not supplied', () => {
    const message = 'report-path not supplied'

    inputFn
      .withArgs('token')
      .returns(token)
      .withArgs('report-path')
      .throws(new Error(message))

    const exec = () => ConfigFactory.get(inputFn, {} as Context)
    return exec.should.throw(message)
  })

  it('rejects when an empty token is supplied', () => {
    inputFn
      .withArgs('token')
      .returns('')
      .withArgs('report-path')
      .returns(reportPath)

    return ConfigFactory.get(inputFn, {} as Context).should.eventually.be.rejectedWith('invalid hotloop token')
  })

  it('rejects when an empty report-path is supplied', () => {
    inputFn
      .withArgs('token')
      .returns(token)
      .withArgs('report-path')
      .returns('')

    return ConfigFactory.get(inputFn, {} as Context).should.eventually.be.rejectedWith('invalid report path')
  })
})

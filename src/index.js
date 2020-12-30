const core = require('@actions/core')
const github = require('@actions/github')

try {
  const reportPath = core.getInput('report-path')
  const token = core.getInput('token')
  console.log(`Report path: ${reportPath}`)
  console.log(`Token: ${token}`)
} catch (error) {
  core.setFailed(error.message)
}

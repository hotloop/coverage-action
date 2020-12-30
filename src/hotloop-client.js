const Axios = require('axios')

class HotLoopClient {
  constructor (token) {
    const config = {
      baseURL: 'https://europe-west3-hotloop-289416.cloudfunctions.net/',
      timeout: 30000,
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${token}`
      }
    }

    this.axios = Axios.create(config)
  }

  reportCoverage(options) {
    return this.axios.post('/HandlePR', options)
      .then(response => response.headers['x-correlation-id'])
  }
}

module.exports = {
  HotLoopClient
}

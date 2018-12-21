const { EclipseClient } = require('../src/eclipse-engine/eclipse.js')

const Client = new EclipseClient({
  token: ''
})

Client.on('ready', () => console.log('Test completed'))
Client.login()

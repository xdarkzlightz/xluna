import { EclipseClient } from '../src/eclipse-engine/eclipse.js'
import { token } from '../../src/config'
const Client = new EclipseClient({ token })

Client.on('ready', () => console.log('Test completed'))
Client.login()

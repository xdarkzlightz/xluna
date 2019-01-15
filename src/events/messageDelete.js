import { handleMessageDelete } from '@serverutil/serverutil'

module.exports = (client, message) => {
  handleMessageDelete(message)
}

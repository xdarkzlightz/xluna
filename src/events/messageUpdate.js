import { handleMessageUpdate } from '@serverutil/serverutil'

module.exports = (client, oldMessage, newMessage) => {
  handleMessageUpdate(oldMessage, newMessage)
}

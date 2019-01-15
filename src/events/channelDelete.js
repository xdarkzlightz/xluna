import { handleChannelDelete } from '@serverutil/serverutil'

module.exports = (client, channel) => {
  handleChannelDelete(channel)
}

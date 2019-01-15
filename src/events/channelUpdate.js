import { handleChannelUpdate } from '@serverutil/serverutil'

module.exports = (client, oldChannel, newChannel) => {
  handleChannelUpdate(oldChannel, newChannel)
}

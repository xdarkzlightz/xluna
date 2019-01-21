import { Collection } from 'discord.js'
// import Youtube from 'simple-youtube-api'
const ytdl = require('ytdl-core')

export class Music {
  constructor (key) {
    // this.youtube = new Youtube(key)

    this.queue = new Collection()
    this.streams = new Collection()
  }

  play (connection, url) {
    const stream = ytdl('https://www.youtube.com/watch?v=n0tW6bZWbS8', {
      filter: 'audioonly',
      quality: 'highestaudio'
    })
    this.streams.set(
      connection.playStream(stream, { seek: 0, volume: 1, bitrate: 'auto' })
    )
  }
}

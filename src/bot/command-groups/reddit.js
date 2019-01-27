import {
  getPost,
  getMeme,
  getTIL,
  getST,
  getHentai,
  getFood
} from '@modules/reddit/commands'

export const GroupConfig = {
  name: 'reddit',
  aliases: ['r'],
  parent: true,
  description: 'Get content off of reddit!'
}

export const fetch = {
  config: {
    rating: 2,
    description: 'Fetch a random post from a subreddit!',
    usage: 'fetch (subreddit)',
    args: [
      {
        type: 'string',
        name: 'subreddit',
        description: 'The subreddit you want to get a post from'
      }
    ]
  },
  run: getPost
}

export const meme = {
  config: {
    rating: 2,
    description: 'Fetch a random meme from reddit!',
    usage: 'meme'
  },
  run: getMeme
}

export const til = {
  config: {
    rating: 1,
    description: 'Get a random fact from r/todayilearned!',
    usage: 'til'
  },
  run: getTIL
}

export const showerthought = {
  config: {
    aliases: ['st'],
    rating: 1,
    description: 'Get a random shower thought from r/ShowerThoughts!',
    usage: 'showerthought'
  },
  run: getST
}

export const hentai = {
  config: {
    rating: 2,
    nsfw: true,
    description: 'Get a random hentai post from reddit!',
    usage: 'hentai'
  },
  run: getHentai
}

export const food = {
  config: {
    rating: 0,
    description: 'Get pictures of some good looking food from reddit!',
    usage: 'food'
  },
  run: getFood
}

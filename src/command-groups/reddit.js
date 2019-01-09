import { getPost, getMeme } from '@reddit/commands'

export const GroupConfig = {
  name: 'reddit',
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

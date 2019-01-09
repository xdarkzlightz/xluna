import { RichEmbed } from 'discord.js'

import { getRandomFromSub } from '@reddit/reddit'
import { embedPost } from '@reddit/embed'
import { getRandomElement } from '@reddit/util'

export async function getPost (ctx, { subreddit }) {
  const embed = new RichEmbed()

  const post = await getRandomFromSub(ctx.client.r, subreddit)
  if (!post) return ctx.error(`Could not find subreddit: ${subreddit}!`)
  embedPost(ctx, post, embed)
  ctx.say(embed)
}

export async function getMeme (ctx) {
  const embed = new RichEmbed()
  const subreddits = [
    '2meirl4meirl',
    'dank_meme',
    'DeepFriedMemes',
    'me_irl',
    'memes',
    'WhitePeopleTwitter'
  ]
  const sub = getRandomElement(subreddits)
  const post = await getRandomFromSub(ctx.client.r, sub)
  if (!post) return ctx.error(`Could not find subreddit: ${sub}!`)
  embedPost(ctx, post, embed)
  ctx.say(embed)
}

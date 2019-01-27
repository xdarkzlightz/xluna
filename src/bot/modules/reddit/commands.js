import { RichEmbed } from 'discord.js'

import { getRandomFromSub } from './reddit'
import { embedPost, embedTIL } from './embed'
import { getRandomElement } from './util'

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

export async function getTIL (ctx) {
  const embed = new RichEmbed()
  const post = await getRandomFromSub(ctx.client.r, 'todayilearned')
  embedTIL(ctx, post, embed)
  ctx.say(embed)
}

export async function getST (ctx) {
  const embed = new RichEmbed()

  const post = await getRandomFromSub(ctx.client.r, 'ShowerThoughts')
  embedPost(ctx, post, embed)
  ctx.say(embed)
}

export async function getFood (ctx) {
  const embed = new RichEmbed()
  const post = await getRandomFromSub(ctx.client.r, 'FoodPorn')
  embedPost(ctx, post, embed)
  ctx.say(embed)
}

export async function getHentai (ctx) {
  const embed = new RichEmbed()
  const subreddits = [
    'rule34',
    'MonsterGirl',
    'hentai',
    'yuri',
    'hentaibondage',
    'sex_comics',
    'animemidriff',
    'OppaiLove',
    'wholesomehentai',
    'AnimeFeet',
    'AnimeBooty'
  ]
  const sub = getRandomElement(subreddits)
  const post = await getRandomFromSub(ctx.client.r, sub)
  embedPost(ctx, post, embed)
  ctx.say(embed)
}

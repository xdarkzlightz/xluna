// FIND BETTER WAY TO EMBED/CHECK FOR IMAGES
export async function embedPost (ctx, post, embed) {
  embed
    .setColor(0xd82162)
    .setTitle(post.title)
    .setFooter(`Posted by: u/${post.author.name}`)
  if (post.url) {
    if (post.selftext) {
      embed.setDescription(
        `${post.selftext}\n[Click here to see the source!](${post.url})`
      )
    } else {
      embed.setDescription(`[Click here to see the source!](${post.url})`)
    }
    embed.setAuthor(
      post.subreddit_name_prefixed,
      'https://image.ibb.co/eRrdV9/icons8-reddit-50.png',
      post.url
    )
    embed.setImage(post.url)
  } else {
    if (post.selftext) embed.setDescription(post.selftext)
    embed.setAuthor(
      post.subreddit_name_prefixed,
      'https://image.ibb.co/eRrdV9/icons8-reddit-50.png'
    )
  }
}

export function embedTIL (ctx, post, embed) {
  embed
    .setColor(0xd82162)
    .setTitle(post.title)
    .setFooter(`Posted by: u/${post.author.name}`)
  if (post.url) {
    if (post.selftext) {
      embed.setDescription(
        `${post.selftext}\n[Click here to see the source!](${post.url})`
      )
    } else {
      embed.setDescription(`[Click here to see the source!](${post.url})`)
    }
    embed.setAuthor(
      post.subreddit_name_prefixed,
      'https://image.ibb.co/eRrdV9/icons8-reddit-50.png',
      post.url
    )
    embed.setThumbnail(post.thumbnail)
  } else {
    if (post.selftext) embed.setDescription(post.selftext)
    embed.setAuthor(
      post.subreddit_name_prefixed,
      'https://image.ibb.co/eRrdV9/icons8-reddit-50.png'
    )
  }
}

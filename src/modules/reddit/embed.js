export async function embedPost (ctx, post, embed) {
  embed
    .setColor(0xd82162)
    .setTitle(post.title)
    .setFooter(`Posted by: u/${post.author.name}`)
  if (post.url) {
    if (post.selftext) {
      embed.setDescription(
        `${post.selftext}\n[Image not loading? Click here](${post.url})`
      )
    } else {
      embed.setDescription(`[Image not loading? Click here](${post.url})`)
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

import Snoowrap from 'snoowrap'

export function connect ({ AGENT, ID, CS, PWD, USER }) {
  return new Snoowrap({
    userAgent: AGENT,
    clientId: ID,
    clientSecret: CS,
    username: USER,
    password: PWD
  })
}

export async function getRandomFromSub (client, subreddit) {
  try {
    const sub = await client.getSubreddit(subreddit).fetch()
    return sub.getRandomSubmission()
  } catch (e) {
    return false
  }
}

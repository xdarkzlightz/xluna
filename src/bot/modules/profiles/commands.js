import { RichEmbed } from 'discord.js'
import { removeFromArray } from '@eclipse/util/array'
import { getLevelEXP } from '@levels/level'
import User from '@eclipse/dbProvider/mongoProvider/models/user'

export async function sendProfile (ctx) {
  const user = ctx.author.db
  let marriedTo
  if (user.profile.marriedTo) {
    marriedTo = await ctx.client.fetchUser(user.profile.marriedTo)
  }
  const embed = new RichEmbed()
    .setColor(0xd84bcf)
    .setAuthor(ctx.author.username, ctx.author.displayAvatarURL)
    .setThumbnail(ctx.author.displayAvatarURL)
    .setDescription(user.profile.desc || 'No description set')
    .addField('Level', `Lvl. ${user.profile.level}`, true)
    .addField(
      'Progress',
      `${user.profile.exp}/${getLevelEXP(
        user.profile.level + 1
      )} till Lvl. ${user.profile.level + 1}`,
      true
    )
    .addField(
      'Married to',
      marriedTo ? `💍 ${marriedTo.username}` : 'No one 😢'
    )
    .setFooter(`Created account on ${ctx.author.createdAt.toUTCString()}`)

  ctx.say(embed)
}

export async function setDesc (ctx, { desc }) {
  const user = ctx.author.db

  user.profile.desc = desc

  await ctx.db.saveUser(user)
  ctx.say(`Description set to ${desc}`)
}

export async function sendMarriageRequest (ctx, { member }) {
  if (member.user.bot) return ctx.say("Don't try to marry a bot...")
  if (ctx.author.id === member.id) {
    return ctx.say("Hey don't be alone! Go out and find someone to marry!")
  }

  if (ctx.author.db.profile.marriedTo !== '') { return ctx.say("Hey you're already married to someone!") }

  let target = await User.findOne({ id: member.id.toString() })
  if (!target) {
    target = new User({
      id: member.id,
      profile: {
        marryRequests: []
      }
    })
  }

  target.profile.marryRequests.push(ctx.author.id)

  await ctx.db.saveUser(target)

  ctx.say(
    `<@${ctx.author.id}> has asked <@${member.id}> to marry them! <@${
      member.id
    }> do you accept? Use ${ctx.prefix}accept <@${ctx.author.id}> or ${
      ctx.prefix
    }reject <@${ctx.author.id}>`
  )
}

export async function acceptMarriageRequest (ctx, { member }) {
  const user = ctx.author.db
  let target = ctx.db.users.get(member.id)

  if (!target || user.profile.marryRequests.indexOf(member.id) !== -1) {
    ctx.say(
      `<@${ctx.author.id}> has accepted <@${
        member.id
      }>'s request to marry them! 🌹 💍`
    )

    user.profile.marryRequests = []
    user.profile.marriedTo = member.id
    target.profile.marryRequests = []
    target.profile.marriedTo = ctx.author.id

    await ctx.db.saveUser(user)
    await ctx.db.saveUser(target)
  } else {
    ctx.say(`That user hasn't sent you a marriage request!`)
  }
}

export async function rejectMarriageRequest (ctx, { member }) {
  const user = ctx.author.db

  if (user.profile.marryRequests.indexOf(member.id) !== -1) {
    ctx.say(`<@${ctx.author.id}> has rejected <@${member.id}>! 💔 🥀`)

    removeFromArray(user.profile.marryRequests, member.id.toString())
    await ctx.db.saveUser(user)
  } else {
    ctx.say(`That user hasn't sent you a marriage request!`)
  }
}

export async function divorceUser (ctx) {
  const user = ctx.author.db

  if (user.profile.marriedTo !== '') {
    const target = await ctx.client.fetchUser(user.profile.marriedTo)
    let targetDB = ctx.db.users.get(target.id)

    ctx.say(`Has divorced ${target.username}!  💔 🥀`)

    user.profile.marriedTo = ''
    targetDB.profile.marriedTo = ''

    await ctx.db.saveUser(user)
    await ctx.db.saveUser(targetDB)
  } else {
    ctx.say(`You're not married to anyone!`)
  }
}

import { RichEmbed } from 'discord.js'
import { removeFromArray } from '@util/array'
import { getLevelEXP } from '@modules/levels/level'

export async function sendProfile (ctx) {
  const user = ctx.author.db
  let marriedTo
  if (user.profile.marriedTo && user.profile.marriedTo !== '') {
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

  await user.update(u => (u.profile.desc = desc))
  ctx.say(`Description set to ${desc}`)
}

export async function sendMarriageRequest (ctx, { member }) {
  if (member.user.bot) return ctx.say("Don't try to marry a bot...")
  if (ctx.author.id === member.id) {
    return ctx.say("Hey don't be alone! Go out and find someone to marry!")
  } else if (ctx.author.db.profile.marriedTo !== '') {
    return ctx.say("Hey you're already married to someone!")
  }

  let target = ctx.db.users.get(member.id)
  if (!target) target = await ctx.db.newUser(member.id)

  target.profile.marryRequests.push(ctx.author.id)

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

  if (user.profile.marriedTo !== '') {
    ctx.say("You're already married to someone")
  }
  let target = ctx.db.users.get(member.id)

  if (user.profile.marryRequests.indexOf(member.id) !== -1) {
    ctx.say(
      `<@${ctx.author.id}> has accepted <@${
        member.id
      }>'s request to marry them! 🌹 💍`
    )

    await user.update(u => {
      u.profile.marryRequests = []
      u.profile.marriedTo = member.id
    })
    await target.update(u => {
      u.profile.marryRequests = []
      u.profile.marriedTo = ctx.author.id
    })
  } else {
    ctx.say(`That user hasn't sent you a marriage request!`)
  }
}

export async function rejectMarriageRequest (ctx, { member }) {
  const user = ctx.author.db

  if (user.profile.marryRequests.indexOf(member.id) !== -1) {
    ctx.say(`<@${ctx.author.id}> has rejected <@${member.id}>! 💔 🥀`)

    await user.update(u => {
      removeFromArray(u.profile.marryRequests, member.id.toString())
    })
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

    await user.update(u => (u.profile.marriedTo = ''))

    await targetDB.update(u => (u.profile.marriedTo = ''))
  } else {
    ctx.say(`You're not married to anyone!`)
  }
}

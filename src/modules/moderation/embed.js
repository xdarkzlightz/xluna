import { getMember } from '@eclipse/core'
import { asyncForEach } from '@eclipse/util/array'

export async function embedWarnings (embed, member, ctx) {
  embed.setAuthor(`${member.user.tag} (${member.id})`, member.user.avatarURL)
  embed.setColor(0x8b89e7)
  const dbMember = getMember(member.id, ctx.db)
  if (!dbMember.warnings.length) {
    return embed.setDescription(`${member.user.tag} has no warnings!`)
  }

  await asyncForEach(dbMember.warnings, async warning => {
    const mod = await ctx.client.fetchUser(warning.modID)
    const pos = dbMember.warnings.indexOf(warning)

    embed.addField(
      `Warning #${pos + 1}`,
      `**Warned by:** ${mod.tag} (${mod.id})\n**Warned on:** ${
        warning.timestamp
      }\n**Reason:** ${warning.reason}`
    )
  })
}

export async function embedLogs (embed, member, ctx) {
  embed.setAuthor(`${member.user.tag} (${member.id})`, member.user.avatarURL)
  embed.setColor(0x8b89e7)
  const dbMember = getMember(member.id, ctx.db)
  if (!dbMember.modLogs.length) {
    return embed.setDescription(`${member.user.tag} has no logs!`)
  }

  if (member.nickname) {
    embed.setDescription(`Current nickname: ${member.nickname}`)
  }

  await asyncForEach(dbMember.modLogs, async log => {
    const mod = await ctx.client.fetchUser(log.modID)
    const pos = dbMember.modLogs.indexOf(log)

    const reason = log.reason ? log.reason : 'N/A'

    embed.addField(
      `Log #${pos + 1}`,
      `**${log.action} by:** ${mod.tag} (${mod.id})\n**${log.action} on:** ${
        log.timestamp
      }\n**Reason:** ${reason}`
    )
  })
}

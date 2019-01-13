import { getMember } from '@eclipse/database'
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

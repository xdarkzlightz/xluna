export function embedChannel (action, { oldChannel, channel }, embed) {
  embed.setAuthor(`${channel.name} (${channel.id})`, channel.guild.iconURL)
  embed.setColor(0x44aea5)
  embed.setDescription(`**Channel was ${action}**\n<#${channel.id}>`)
  embed.setFooter(`At ${new Date().toUTCString()}`)

  if (oldChannel && channel.name !== oldChannel.name) {
    embed.addField('Name before', oldChannel.name)
    embed.addField('Name after', channel.name)
  }
}

export function embedRole (action, { oldRole, role }, embed) {
  embed.setAuthor(`${role.name} (${role.id})`, role.guild.iconURL)
  embed.setColor(role.hexColor)
  embed.setDescription(`**Role was ${action}**\n<@&${role.id}>`)
  embed.setFooter(`At ${new Date().toUTCString()}`)

  if (oldRole && role.name !== oldRole.name) {
    embed.addField('Name before', oldRole.name)
    embed.addField('Name after', role.name)
  }

  if (oldRole && oldRole.hexColor !== role.hexColor) {
    embed.addField('Hex colour before', `${oldRole.hexColor}`)
    embed.addField('Hex colour after', `${role.hexColor}`)
  }
}

export function embedMessage (action, { oldMsg, message }, embed) {
  embed.setAuthor(
    `${message.author.tag} (${message.author.id})`,
    message.guild.iconURL
  )
  embed.setColor(0x44aea5)
  embed.setDescription(`**Message was ${action}**\n<@${message.author.id}>`)
  embed.setFooter(`At ${new Date().toUTCString()}`)
  if (oldMsg && oldMsg.content !== message.content) {
    embed.addField('Message before', oldMsg.content)
    embed.addField('Message after', message.content)
  }

  if (action === 'deleted') {
    embed.addField('Content', message.content || 'Content was an image')
  }
}

export function embedMember (action, { oldMember, member }, embed) {
  embed.setAuthor(`${member.user.tag} (${member.id})`, member.guild.iconURL)
  embed.setColor(0x44aea5)
  embed.setDescription(`**Member was ${action}**\n<@${member.id}>`)
  embed.setFooter(`At ${new Date().toUTCString()}`)
  embed.setThumbnail(member.displayAvatarURL)

  if (
    oldMember &&
    oldMember.nickname &&
    oldMember.nickname !== member.nickname
  ) {
    embed.addField('Nickname before', oldMember.nickname)
    embed.addField('Nickname after', member.nickname || 'No nickname')
  }

  const newRole = member.roles.find(r => !oldMember.roles.has(r.id))
  if (newRole) {
    embed.addField(
      'Role added',
      `${newRole.name} (${newRole.id})\n<@&${newRole.id}>`
    )
  }

  const removedRole = oldMember.roles.find(r => !member.roles.has(r.id))
  if (removedRole) {
    embed.addField(
      'Role removed',
      `${removedRole.name} (${removedRole.id})\n<@&${removedRole.id}>`
    )
  }
}

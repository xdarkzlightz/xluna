export function embedChannel (action, { oldChannel, channel }, embed) {
  embed.setAuthor(`Channel was ${action}`, channel.guild.iconURL)
  embed.setColor(0x44aea5)
  embed.setDescription(`**${channel.name} (${channel.id})**\n<#${channel.id}>`)
  embed.setFooter(`At ${new Date().toUTCString()}`)

  if (oldChannel && channel.name !== oldChannel.name) {
    embed.addField('Name before', oldChannel.name)
    embed.addField('Name after', channel.name)
  }
}

export function embedRole (action, { oldRole, role }, embed) {
  embed.setAuthor(`Role was ${action}`, role.guild.iconURL)
  embed.setColor(0x44aea5)
  embed.setDescription(`**${role.name} (${role.id})**\n<@&${role.id}>`)
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
  embed.setAuthor(`Message was ${action}`, message.guild.iconURL)
  embed.setColor(0x44aea5)
  embed.setDescription(
    `**${message.author.tag} (${message.author.id})**\n<@${message.author.id}>`
  )
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
  embed.setAuthor(`Member was ${action}`, member.guild.iconURL)
  embed.setColor(0x44aea5)
  embed.setDescription(`**${member.user.tag} (${member.id})**\n<@${member.id}>`)
  embed.setFooter(`At ${new Date().toUTCString()}`)

  if (
    oldMember &&
    oldMember.nickname &&
    oldMember.nickname !== member.nickname
  ) {
    embed.addField('Nickname before', oldMember.nickname)
    embed.addField('Nickname after', oldMember.nickname)
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

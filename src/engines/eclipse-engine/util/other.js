export function checkForClientPerms ({ cmd, guild }) {
  const response = { perm: true, missingPerm: null }
  cmd.clientPermissions.forEach(perm => {
    if (!response.perm) return
    if (!guild.me.hasPermission(perm)) {
      response.perm = false
      response.missingPerm = perm
    }
  })

  return response
}

export function checkForMemberPerms ({ cmd, member }) {
  const response = { perm: true, missingPerm: null }
  cmd.memberPermissions.forEach(perm => {
    if (!response.perm) return
    if (!member.hasPermission(perm)) {
      response.perm = false
      response.missingPerm = perm
    }
  })
  return response
}

export function hasPermission (obj, ctx) {
  if (obj.memberPermissions) {
    const { perm, missingPerm } = checkForMemberPerms(ctx)
    if (!perm) {
      ctx.say(`You're missing permission: ${missingPerm.toLowerCase()}`)
      return false
    }
  } else if (obj.clientPermissions) {
    const { perm, missingPerm } = checkForClientPerms(ctx)
    if (!perm) {
      ctx.say(`I'm missing permission: ${missingPerm.toLowerCase()}`)
      return false
    } else {
      return true
    }
  }
}

export function dev (ctx) {
  if (ctx.client.devs.indexOf(ctx.author.id) === -1) return false
  return true
}

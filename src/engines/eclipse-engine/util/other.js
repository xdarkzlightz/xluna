export function checkForClientPerms (obj, { guild }) {
  const response = { perm: true, missingPerm: null }
  obj.clientPermissions.forEach(perm => {
    if (!response.perm) return
    if (!guild.me.hasPermission(perm)) {
      response.perm = false
      response.missingPerm = perm
    }
  })

  return response
}

export function checkForMemberPerms (obj, { member }) {
  const response = { perm: true, missingPerm: null }
  obj.memberPermissions.forEach(perm => {
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
    const { perm, missingPerm } = checkForMemberPerms(obj, ctx)
    if (!perm) {
      ctx.say(`You're missing permission: ${missingPerm.toLowerCase()}`)
      return false
    } else return true
  } else if (obj.clientPermissions) {
    const { perm, missingPerm } = checkForClientPerms(obj, ctx)
    if (!perm) {
      ctx.say(`I'm missing permission: ${missingPerm.toLowerCase()}`)
      return false
    } else return true
  } else return true
}

export function dev (ctx) {
  if (ctx.client.devs.indexOf(ctx.author.id) === -1) return false
  return true
}

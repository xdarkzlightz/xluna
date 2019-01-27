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

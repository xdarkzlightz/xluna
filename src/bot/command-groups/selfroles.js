import {
  addSelfRole,
  removeSelfRole,
  showSelfRoles,
  giveSelfRole,
  addReactionRole,
  sendReactionMessage
} from '@modules/selfroles/commands'

export const GroupConfig = {
  name: 'selfroles',
  description: 'Lets users add their own roles!'
}

export const addrole = {
  config: {
    description: "Add's a self role",
    usage: 'addrole (role)',
    memberPermissions: ['MANAGE_ROLES'],
    args: [{ type: 'role' }]
  },
  run: addSelfRole
}

export const removerole = {
  config: {
    description: 'removes a self role',
    usage: 'removerole (role)',
    memberPermissions: ['MANAGE_ROLES'],
    args: [{ type: 'role' }]
  },
  run: removeSelfRole
}

export const showroles = {
  config: {
    description: 'Shows a list of available self roles',
    usage: 'showroles'
  },
  run: showSelfRoles
}

export const selfrole = {
  config: {
    description: 'Add or remove a self role from yourself!',
    usage: 'selfrole (role)',
    args: [{ type: 'role' }]
  },
  run: giveSelfRole
}

export const reactionrole = {
  config: {
    description: 'Add a reactionrole',
    usage: 'reactionrole (role) (emote)',
    memberPermissions: ['MANAGE_ROLES'],
    args: [{ type: 'role' }, { type: 'string', name: 'emote' }]
  },
  run: addReactionRole
}

export const reactionmessage = {
  config: {
    description: 'Send a message with all of the reaction roles',
    usage: 'reactionmessage (channel)',
    memberPermissions: ['MANAGE_ROLES'],
    args: [{ type: 'channel', default: ctx => ctx.channel }]
  },
  run: sendReactionMessage
}

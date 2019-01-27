import {
  sendProfile,
  setDesc,
  sendMarriageRequest,
  acceptMarriageRequest,
  rejectMarriageRequest,
  divorceUser
} from '@profiles/commands'

export const GroupConfig = {
  name: 'userprofile',
  description: 'Profile related commands!'
}

export const profile = {
  config: {
    description: 'Check what level you are!',
    usage: 'profile'
  },
  run: sendProfile
}

export const setdesc = {
  config: {
    description: 'Set your profiles description',
    usage: 'setdesc (string)',
    example: "setdesc 'no u'",
    args: [
      {
        type: 'string',
        name: 'desc'
      }
    ]
  },
  run: setDesc
}

export const marry = {
  config: {
    description: 'Marry a member in a server!',
    usage: 'marry (member)',
    args: [
      {
        type: 'member',
        name: 'member'
      }
    ]
  },
  run: sendMarriageRequest
}

export const accept = {
  config: {
    description: 'Accept a marriage request!',
    usage: 'accept (member)',
    args: [
      {
        type: 'member',
        name: 'member'
      }
    ]
  },
  run: acceptMarriageRequest
}

export const reject = {
  config: {
    description: 'Reject a marriage request!',
    usage: 'reject (member)',
    args: [
      {
        type: 'member',
        name: 'member'
      }
    ]
  },
  run: rejectMarriageRequest
}

export const divorce = {
  config: {
    description: "Divorce the person you're married to",
    usage: 'divorce'
  },
  run: divorceUser
}

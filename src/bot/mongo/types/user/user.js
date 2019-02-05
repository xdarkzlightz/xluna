export default class MongoUser {
  constructor (user, provider) {
    this.provider = provider
    this.data = user

    this.profile = user.profile

    this.saving = false
  }

  async update (callback) {
    // eslint-disable-next-line standard/no-callback-literal
    callback(this)
    await this.data.save()
  }
}

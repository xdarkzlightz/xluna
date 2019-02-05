export default class MongoUser {
  constructor (user, provider) {
    this.provider = provider
    this.data = user

    this.profile = user.profile

    this.saving = false
  }

  /** Saves the guild data
   * If you pass a CTX object it'll update the guild, channel, member, and everyone objects
   */
  async save (ctx) {
    this.saving = true
    await this.data.save()
    this.saving = false

    if (ctx) ctx.auther.db = this.data
  }
}

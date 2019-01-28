export default class Flag {
  constructor (name, options) {
    this.name = name
    this.description = options.description
    this.example = options.example
    this.usage = options.usage
    this.notes = options.notes

    this.args = options.args
    this.default = options.default
    this.run = options.run
  }

  async run (ctx) {
    await this.run(ctx)
  }
}

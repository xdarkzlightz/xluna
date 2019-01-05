class EclipseError extends Error {
  constructor ({ type, defaults }, ...rest) {
    super(...rest)

    this.type = type
    this.defaults = defaults
  }
}

export default EclipseError

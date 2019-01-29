class EclipseError extends Error {
  constructor ({ type, options }, ...rest) {
    super(...rest)

    this.type = type
    this.options = options
  }
}

export default EclipseError

class HttpApiError extends Error {
  constructor(httpStatus, message) {
    super(message);

    this.status = httpStatus;
  }
}

module.exports = HttpApiError;

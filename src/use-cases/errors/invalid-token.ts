export class InvalidTokenError extends Error {
  constructor() {
    super('Invalid token provided or account is alredy verified.')
  }
}

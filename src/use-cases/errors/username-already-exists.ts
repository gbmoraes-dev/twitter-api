export class UsernameAlreadyExistsError extends Error {
  constructor() {
    super('This username is already in use.')
  }
}

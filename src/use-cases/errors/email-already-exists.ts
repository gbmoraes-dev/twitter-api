export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('This email is already in use.')
  }
}

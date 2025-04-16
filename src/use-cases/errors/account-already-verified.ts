export class AccountAlreadyVerifiedError extends Error {
  constructor() {
    super('This account is already verified.')
  }
}

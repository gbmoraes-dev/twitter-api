export class AccountNotVerifiedError extends Error {
  constructor() {
    super('Please, verify your account before authenticate.')
  }
}

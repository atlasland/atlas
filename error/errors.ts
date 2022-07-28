export abstract class BaseError extends Error {
  protected constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

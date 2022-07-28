export abstract class BaseError extends Error {
	protected constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, BaseError.prototype);
	}
}

export class MissingArgumentError extends BaseError {
	constructor(argument?: string) {
		super(`Missing argument${argument ? `: ${argument}` : ""}`);
		Object.setPrototypeOf(this, MissingArgumentError.prototype);
	}
}

import { BaseError } from "../error/mod.ts";

export class InvalidCommandError extends BaseError {
	constructor(message?: string) {
		super(message);
		Object.setPrototypeOf(this, InvalidCommandError.prototype);
	}
}

export class InvalidArgumentError extends BaseError {
	constructor(message?: string) {
		super(message);
		Object.setPrototypeOf(this, InvalidArgumentError.prototype);
	}
}

export class InvalidOptionError extends BaseError {
	constructor(message?: string) {
		super(message);
		Object.setPrototypeOf(this, InvalidOptionError.prototype);
	}
}

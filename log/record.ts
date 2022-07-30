import { type LogLevel } from "./level.ts";

export type LogRecordOptions = {
	level: LogRecord["level"];
	message: LogRecord["message"];
	args?: unknown[];
};

// deno-lint-disable no-explicit-any
export class LogRecord<T = any> {
	readonly level: LogLevel;
	readonly message: T;
	readonly #args: LogRecordOptions["args"];
	#datetime: Date;

	constructor({ level, message, args }: LogRecordOptions) {
		this.level = level;
		this.message = message;
		this.#args = [...(args ?? [])];
		this.#datetime = new Date();
	}

	/** The date and time the log record was created, in ISO format */
	get datetime(): string {
		return new Date(this.#datetime).toISOString();
	}

	get args(): LogRecordOptions["args"] {
		return this.#args;
	}
}

import { type LogLevel } from "./level.ts";

export type LogRecordOptions = {
	level: LogRecord["level"];
	message?: LogRecord["message"];
	args?: unknown[];
};

// deno-lint-ignore no-explicit-any
export class LogRecord<T = any> {
	readonly level: LogLevel;
	readonly message: T;
	readonly #args: unknown[];
	#timestamp: string;

	constructor({ level, message, args }: LogRecordOptions) {
		this.level = level;
		this.message = message;
		this.#args = [...(args ?? [])];
		this.#timestamp = new Date().toISOString();
	}

	/** The timestamp log record was created, in ISO format */
	get timestamp(): string {
		return this.#timestamp;
	}

	get args(): LogRecordOptions["args"] {
		return this.#args;
	}
}

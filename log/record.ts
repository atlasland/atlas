import { type LogLevel } from "./level.ts";

export type LogRecordOptions = {
	level: LogLevel;
	message?: LogRecord["message"];
};

export class LogRecord {
	readonly level: LogLevel;
	// deno-lint-ignore no-explicit-any
	readonly message?: any;

	#timestamp: string;

	constructor({ level, message }: LogRecordOptions) {
		this.level = level;
		this.message = message;
		this.#timestamp = new Date().toISOString();
	}

	/** The timestamp log record was created, in ISO format */
	get timestamp(): string {
		return this.#timestamp;
	}
}

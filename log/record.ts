import { type LogLevel } from "./level.ts";

export type LogRecordOptions = {
	level: LogLevel;
	message: string;
};

export class LogRecord {
	readonly level: LogLevel;
	readonly message: string;
	#datetime: Date;

	constructor(options: LogRecordOptions) {
		this.level = options.level;
		this.message = options.message;
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

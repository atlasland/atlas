import { type LogHandler } from "./handler.ts";
import { LogLevel } from "./level.ts";
import { LogRecord } from "./record.ts";

type LoggerOptions = {
	handlers?: LogHandler[];
};

export class Logger {
	/** The logger name. Used as prefix for log records when formatting */
	readonly name: string;

	/** A list of log handlers. Each log record will be passed to them in turn */
	public handlers: LogHandler[];

	constructor(name: Logger["name"], options?: LoggerOptions) {
		this.name = name;
		this.handlers = options?.handlers ?? [];
	}

	/** Logs a message with `emergency` level */
	emergency(...message: LogRecord["message"]) {
		this.#log(LogLevel.EMERGENCY, ...message);
	}

	/** Logs a message with `alert` level */
	alert(...message: LogRecord["message"]) {
		this.#log(LogLevel.ALERT, ...message);
	}

	/** Logs a message with `critical` level */
	critical(...message: LogRecord["message"]) {
		this.#log(LogLevel.CRITICAL, ...message);
	}

	/** Logs a message with `error` level */
	error(...message: LogRecord["message"]) {
		this.#log(LogLevel.ERROR, ...message);
	}

	/** Logs a message with `warning` level */
	warning(...message: LogRecord["message"]) {
		this.#log(LogLevel.WARNING, ...message);
	}

	/** Logs a message with `notice` level */
	notice(...message: LogRecord["message"]) {
		this.#log(LogLevel.NOTICE, ...message);
	}

	/** Logs a message with `info` level */
	info(...message: LogRecord["message"]) {
		this.#log(LogLevel.INFO, ...message);
	}

	/** Logs a message with `debug` level */
	debug(...message: LogRecord["message"]) {
		this.#log(LogLevel.DEBUG, ...message);
	}

	#log(
		level: LogLevel,
		...message: LogRecord["message"]
	) {
		const record = new LogRecord({ level, message });

		for (const handler of this.handlers) {
			handler.handle({ loggerName: this.name, record });
		}
	}
}

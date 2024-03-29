import { bgRed, blue, brightRed, cyan, gray, magenta, red, white, yellow } from "../deps.ts";
import { LogHandler, type LogHandlerOptions } from "../handler.ts";
import { getLevelValue, LogLevel } from "../level.ts";

export type ConsoleHandlerOptions = {
	/** Show logger name on console output. Defaults to `false` */
	name?: boolean;

	/** Show colors on the console output. Defaults to `true` */
	color?: boolean;

	/** Add timestamp to the log message. Defaults to `false` */
	timestamp?: boolean;

	/** Format log message as JSON. Defaults to `false` */
	json?: boolean;
};

export class ConsoleHandler extends LogHandler {
	#color: boolean;
	#timestamp: boolean;
	#json: boolean;
	#name: boolean;

	constructor(options?: ConsoleHandlerOptions) {
		super();
		this.#color = options?.color ?? true;
		this.#json = options?.json ?? false;
		this.#name = options?.name ?? false;
		this.#timestamp = options?.timestamp ?? false;
	}

	override handle(
		{ loggerName, record }: LogHandlerOptions,
		// deno-lint-ignore no-explicit-any
	): any {
		const formatted = this.format({ loggerName, record });

		if (getLevelValue(record.level) <= getLevelValue(LogLevel.ERROR)) {
			console.error(...formatted);
		} else if (record.level === LogLevel.WARNING) {
			console.warn(...formatted);
		} else if (record.level === LogLevel.DEBUG) {
			console.debug(...formatted);
		} else {
			console.log(...formatted);
		}

		return formatted;
	}

	// deno-lint-ignore no-explicit-any
	override format({ loggerName, record }: LogHandlerOptions): any {
		if (this.#json) {
			return [JSON.stringify({
				...(this.#name && { name: loggerName }),
				...(this.#timestamp && { timestamp: record.timestamp }),
				level: record.level,
				message: record.message,
			})];
		}

		const output = [];

		if (this.#name && loggerName) {
			if (this.#color) {
				output.push(gray(`[${loggerName}]`));
			} else {
				output.push(`[${loggerName}]`);
			}
		}

		if (this.#timestamp) {
			if (this.#color) {
				output.push(gray(record.timestamp));
			} else {
				output.push(record.timestamp);
			}
		}

		const level = this.#formatLevel(record.level);

		output.push(level, ...record.message);

		return output;
	}

	#formatLevel(level: LogLevel): string {
		if (this.#color) {
			switch (level) {
				case LogLevel.EMERGENCY:
					return bgRed(white(` ${level.toUpperCase()} `));

				case LogLevel.ALERT:
					return brightRed(level.toUpperCase());

				case LogLevel.CRITICAL:
					return magenta(level);

				case LogLevel.ERROR:
					return red(level);

				case LogLevel.WARNING:
					return yellow(level);

				case LogLevel.NOTICE:
					return cyan(level);

				case LogLevel.INFO:
					return blue(level);

				case LogLevel.DEBUG:
					return gray(level);
			}
		}

		return level;
	}
}

import { colors } from "../deps.ts";
import { LogHandler, type LogHandlerOptions } from "../handler.ts";
import { getLevelValue, LogLevel } from "../level.ts";

export type ConsoleHandlerOptions = {
	/** Show logger name on console output. Defaults to `false` */
	name?: boolean;

	/** Show colors on the console output. Defaults to `true` */
	color?: boolean;

	/** Add datetime to the log message. Defaults to `false` */
	datetime?: boolean;

	/** Format log message as JSON. Defaults to `false` */
	json?: boolean;
};

export class ConsoleHandler extends LogHandler {
	#color: ConsoleHandlerOptions["color"];
	#datetime: ConsoleHandlerOptions["datetime"];
	#json: ConsoleHandlerOptions["json"];
	#name: ConsoleHandlerOptions["name"];

	constructor(options?: ConsoleHandlerOptions) {
		super();
		this.#color = options?.color ?? true;
		this.#json = options?.json ?? false;
		this.#name = options?.name ?? false;
		this.#datetime = options?.datetime ?? false;
	}

	override handle(
		{ loggerName, record }: LogHandlerOptions,
	): string {
		const formatted = this.format({ loggerName, record });

		if (getLevelValue(record.level) <= getLevelValue(LogLevel.ERROR)) {
			console.error(formatted);
		} else {
			console.log(formatted);
		}

		return formatted;
	}

	override format({ loggerName, record }: LogHandlerOptions): string {
		if (this.#json) {
			return JSON.stringify({
				...(this.#name && { name: loggerName }),
				...(this.#datetime && { datetime: record.datetime }),
				level: record.level,
				message: record.message,
			});
		}

		const output = [];

		if (this.#name && loggerName) {
			if (this.#color) {
				output.push(colors.gray(`[${loggerName}]`));
			} else {
				output.push(`[${loggerName}]`);
			}
		}

		if (this.#datetime) {
			if (this.#color) {
				output.push(colors.gray(record.datetime));
			} else {
				output.push(record.datetime);
			}
		}

		const level = this.#formatLevel(record.level);

		output.push(level, record.message);

		return output.join(" ");
	}

	#formatLevel(level: LogLevel): string {
		if (this.#color) {
			switch (level) {
				case LogLevel.EMERGENCY:
					return colors.bgRed(colors.white(` ${level.toUpperCase()} `));

				case LogLevel.ALERT:
					return colors.brightRed(level.toUpperCase());

				case LogLevel.CRITICAL:
					return colors.magenta(level);

				case LogLevel.ERROR:
					return colors.red(level);

				case LogLevel.WARNING:
					return colors.yellow(level);

				case LogLevel.NOTICE:
					return colors.cyan(level);

				case LogLevel.INFO:
					return colors.blue(level);

				case LogLevel.DEBUG:
					return colors.gray(level);
			}
		}

		return level;
	}
}

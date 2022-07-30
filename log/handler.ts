import { type LogRecord } from "./record.ts";

export type LogHandlerOptions = {
	/** The logger instance name */
	loggerName?: string;

	/** The log record */
	record: LogRecord;
};

export abstract class LogHandler {
	/** Formats a log record for the handler */
	format({ loggerName, record }: LogHandlerOptions): string {
		const formatted = [];

		if (loggerName) {
			formatted.push(`[${loggerName}]`);
		}

		formatted.push(`${record.level}:`, record.message);

		return formatted.join("");
	}

	/** Handles a log record. Returns the formatted message by default, to enable inline logging */
	handle({ loggerName, record }: LogHandlerOptions): Promise<string> | string {
		return this.format({ loggerName, record });
	}
}

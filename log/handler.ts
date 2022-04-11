import { type LogRecord } from "./record.ts";

export abstract class LogHandler {
  /** Formats a log record for the handler */
  format(record: LogRecord): string {
    return record.message;
  }

  /** Handles a log record. Returns the formatted message by default, to enable inline logging */
  handle(record: LogRecord): string {
    return this.format(record);
  }
}

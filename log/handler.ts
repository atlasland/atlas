import { LogMessage } from "./message.ts";

export abstract class LogHandler {
  /** Formats a log message for the handler */
  format(message: LogMessage): string {
    return message.value;
  }

  /** Handles a log message */
  handle(message: LogMessage): void {
    const formatted = this.format(message);
    return this.log(formatted);
  }

  /** Logs a message */
  abstract log(message: string): void;
}

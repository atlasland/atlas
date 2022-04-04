import { LogLevel } from "./level.ts";
import { LogMessage } from "./message.ts";
import { type LogHandler } from "./handler.ts";
import { ConsoleHandler } from "./handlers/console.ts";

type LoggerOptions = {
  handlers?: LogHandler[];
};

export class Logger {
  readonly name: string;
  public handlers: LogHandler[];

  constructor(name: Logger["name"], options?: LoggerOptions) {
    this.name = name;
    this.handlers = options?.handlers ?? [];
  }

  /** Logs a message with emergency level */
  emergency(message: LogMessage["value"]): void {
    this.#log(LogLevel.EMERGENCY, message);
  }

  /** Logs a message with alert level */
  alert(message: LogMessage["value"]): void {
    this.#log(LogLevel.ALERT, message);
  }

  /** Logs a message with critical level */
  critical(message: LogMessage["value"]): void {
    this.#log(LogLevel.CRITICAL, message);
  }

  /** Logs a message with error level */
  error(message: LogMessage["value"]): void {
    this.#log(LogLevel.ERROR, message);
  }

  /** Logs a message with warning level */
  warning(message: LogMessage["value"]): void {
    this.#log(LogLevel.WARNING, message);
  }

  /** Logs a message with notice level */
  notice(message: LogMessage["value"]): void {
    this.#log(LogLevel.NOTICE, message);
  }

  /** Logs a message with info level */
  info(message: LogMessage["value"]): void {
    this.#log(LogLevel.INFO, message);
  }

  /** Logs a message with debug level */
  debug(message: LogMessage["value"]): void {
    this.#log(LogLevel.DEBUG, message);
  }

  #log(level: LogLevel, message: LogMessage["value"]): void {
    const messageObject = new LogMessage(level, message);

    for (const handler of this.handlers) {
      handler.handle(messageObject);
    }
  }
}

export default new Logger("default", {
  handlers: [
    new ConsoleHandler(),
  ],
});

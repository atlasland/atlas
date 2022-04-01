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

  emergency(message: LogMessage["value"]): void {
    this.#log(LogLevel.EMERGENCY, message);
  }

  alert(message: LogMessage["value"]): void {
    this.#log(LogLevel.ALERT, message);
  }

  critical(message: LogMessage["value"]): void {
    this.#log(LogLevel.CRITICAL, message);
  }

  error(message: LogMessage["value"]): void {
    this.#log(LogLevel.ERROR, message);
  }

  warning(message: LogMessage["value"]): void {
    this.#log(LogLevel.WARNING, message);
  }

  notice(message: LogMessage["value"]): void {
    this.#log(LogLevel.NOTICE, message);
  }

  info(message: LogMessage["value"]): void {
    this.#log(LogLevel.INFO, message);
  }

  debug(message: LogMessage["value"]): void {
    this.#log(LogLevel.DEBUG, message);
  }

  #log(level: LogMessage["level"], message: LogMessage["value"]): void {
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

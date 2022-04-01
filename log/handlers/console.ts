import * as colors from "fmt/colors.ts";
import { LogHandler } from "../handler.ts";
import { LogMessage } from "../message.ts";
import { getLevelValue, LogLevel } from "../level.ts";

type ConsoleHandlerOptions = {
  color?: boolean;
  timestamp?: boolean;
  json?: boolean;
};

export class ConsoleHandler extends LogHandler {
  #target = Deno.stdout;
  #color: boolean;
  #timestamp: boolean;
  #json: boolean;

  constructor(options?: ConsoleHandlerOptions) {
    super();
    this.#color = options?.color ?? true;
    this.#timestamp = options?.timestamp ?? false;
    this.#json = options?.json ?? false;
  }

  override handle(message: LogMessage): void {
    if (getLevelValue(message.level) <= getLevelValue(LogLevel.ERROR)) {
      this.#target = Deno.stderr;
    }

    super.handle(message);
  }

  override format(message: LogMessage): string {
    if (this.#json) {
      return JSON.stringify({
        ...(this.#timestamp && { timestamp: message.time }),
        level: message.level,
        message: message.value,
      });
    }

    const output = [];

    if (this.#timestamp) {
      output.push(colors.gray(message.time));
    }

    const level = this.#formatLevel(message.level);

    output.push(level, message.value);

    return output.join(" ");
  }

  log(message: string): void {
    this.#target.writeSync(
      new TextEncoder().encode(`${message}\n`),
    );
  }

  #formatLevel(level: LogLevel): string {
    if (this.#color) {
      switch (level) {
        case LogLevel.EMERGENCY:
          return colors.bgRed(` ${level.toUpperCase()} `);

        case LogLevel.ALERT:
          return colors.red(level.toUpperCase());

        case LogLevel.CRITICAL:
          return colors.red(level);

        case LogLevel.ERROR:
          return colors.magenta(level);

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

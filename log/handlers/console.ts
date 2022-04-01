import * as colors from "fmt/colors.ts";
import { LogHandler } from "../handler.ts";
import { LogMessage } from "../message.ts";
import { getLevelValue, LogLevel } from "../level.ts";

type ConsoleHandlerOptions = {
  /** Show colors on the console output. Defaults to `true` */
  color?: boolean;

  /** Add timestamp to the log message. Defaults to `false` */
  timestamp?: boolean;

  /** Format log message as JSON. Defaults to `false` */
  json?: boolean;

  /**
   * Target for the log messages.
   *
   * | Default       | Level                                         |
   * |:--------------|:----------------------------------------------|
   * | `Deno.stdout` | `debug`, `info`, `notice`, and `warning`      |
   * | `Deno.stderr` | `error`, `critical`, `alert`, and `emergency` |
   */
  target?: Deno.WriterSync;
};

export class ConsoleHandler extends LogHandler {
  #color: boolean;
  #json: boolean;
  #target: Deno.WriterSync;
  #timestamp: boolean;

  constructor(options?: ConsoleHandlerOptions) {
    super();
    this.#color = options?.color ?? true;
    this.#json = options?.json ?? false;
    this.#target = options?.target ?? Deno.stdout;
    this.#timestamp = options?.timestamp ?? false;
  }

  override handle(message: LogMessage): void {
    if (
      this.#target === Deno.stdout &&
      getLevelValue(message.level) <= getLevelValue(LogLevel.ERROR)
    ) {
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
      if (this.#color) {
        output.push(colors.gray(message.time));
      } else {
        output.push(message.time);
      }
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

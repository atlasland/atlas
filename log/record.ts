import { type LogLevel } from "./level.ts";

export type LogRecordOptions = {
  level: LogLevel;
  message: string;
};

export class LogRecord {
  readonly level: LogLevel;
  readonly message: string;
  #timestamp: number;

  constructor(options: LogRecordOptions) {
    this.level = options.level;
    this.message = options.message;
    this.#timestamp = Date.now();
  }

  /** The time the message was created in ISO format */
  get time(): string {
    return new Date(this.#timestamp).toISOString();
  }
}

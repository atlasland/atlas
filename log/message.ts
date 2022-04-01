import { LogLevel } from "./level.ts";

export class LogMessage {
  readonly level: LogLevel;
  readonly value: string;
  #timestamp: number;

  constructor(level: LogLevel, value: string) {
    this.level = level;
    this.value = value;
    this.#timestamp = Date.now();
  }

  /** The time the message was created in ISO format */
  get time(): string {
    return new Date(this.#timestamp).toISOString();
  }
}

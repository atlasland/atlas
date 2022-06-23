import { asserts } from "../deps.ts";
import { LogHandler, type LogHandlerOptions } from "./handler.ts";
import { LogLevel } from "./level.ts";
import { LogRecord } from "./record.ts";
import { Logger } from "./logger.ts";

const { assertEquals } = asserts;

type TestHandlerOptions = {
  name?: boolean;
};

class TestHandler extends LogHandler {
  public records: LogRecord[] = [];
  public formatted: string[] = [];
  #name: boolean;

  constructor(options?: TestHandlerOptions) {
    super();
    this.#name = options?.name ?? false;
  }

  override format({ loggerName, record }: LogHandlerOptions): string {
    const fmt = [];

    if (this.#name) {
      fmt.push(`[${loggerName}]`);
    }

    fmt.push(`${record.level}:`, record.message);

    this.formatted.push(fmt.join(" "));

    return this.formatted.at(-1) as string;
  }

  override handle({ loggerName, record }: LogHandlerOptions): string {
    this.records.push(record);
    return this.format({ loggerName, record });
  }
}

Deno.test("[log] logger: has a name", () => {
  const logger = new Logger("test");
  assertEquals(logger.name, "test");
});

Deno.test("[log] logger: formats a message", () => {
  const logger = new Logger("test", {
    handlers: [new TestHandler()],
  });
  const fmt = (logger.handlers[0] as TestHandler).formatted;

  logger.debug(`formatted message`);

  assertEquals(
    (logger.handlers[0] as TestHandler).formatted[fmt.length - 1],
    "debug: formatted message",
  );
});

Deno.test("[log] logger: accepts multiple handlers", () => {
  const logger = new Logger("test", {
    handlers: [
      new TestHandler(),
      new TestHandler(),
    ],
  });

  assertEquals(logger.handlers.length, 2);

  logger.debug(`a single message`);

  assertEquals(
    (logger.handlers[0] as TestHandler).records[0],
    (logger.handlers[1] as TestHandler).records[0],
  );
});

Object.values(LogLevel).forEach((level) => {
  Deno.test(`[log] logger: logs a message with '${level}' level`, () => {
    const logger = new Logger("test", {
      handlers: [new TestHandler()],
    });
    const records = (logger.handlers[0] as TestHandler).records;

    logger[level]?.(`hello`);

    assertEquals(records[records.length - 1]?.level, level);
  });
});

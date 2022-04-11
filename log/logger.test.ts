import { asserts } from "../deps.ts";
import { LogHandler } from "./handler.ts";
import { LogLevel } from "./level.ts";
import { LogRecord } from "./record.ts";
import { Logger } from "./logger.ts";

const { assertEquals } = asserts;

class TestHandler extends LogHandler {
  public records: LogRecord[] = [];
  public formatted: string[] = [];

  override format(record: LogRecord): string {
    const formatted = `[${record.level}] ${record.message}`;
    this.formatted.push(formatted);
    return formatted;
  }

  override handle(record: LogRecord): string {
    this.records.push(record);
    return this.format(record);
  }
}

Object.values(LogLevel).forEach((level) => {
  Deno.test(`logs a message with ${level} level`, () => {
    const logger = new Logger("test", {
      handlers: [new TestHandler()],
    });

    const records = (logger.handlers[0] as TestHandler).records;

    logger[level]?.(`hello`);

    assertEquals(records[records.length - 1].level, level);
    assertEquals(records[records.length - 1].message, "hello");
  });
});

Deno.test("formats a message", () => {
  const logger = new Logger("test", {
    handlers: [new TestHandler()],
  });
  const formatted = (logger.handlers[0] as TestHandler).formatted;

  logger.debug(`formatted message`);

  assertEquals(
    (logger.handlers[0] as TestHandler).formatted[formatted.length - 1],
    "[debug] formatted message",
  );
});

Deno.test("accepts multiple handlers", () => {
  const logger = new Logger("test", {
    handlers: [new TestHandler(), new TestHandler()],
  });

  assertEquals(logger.handlers.length, 2);

  logger.debug(`a single message`);

  assertEquals(
    (logger.handlers[0] as TestHandler).records[0],
    (logger.handlers[1] as TestHandler).records[0],
  );
});

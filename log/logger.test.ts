import { assertEquals, assertStrictEquals } from "testing/asserts.ts";
import { LogHandler } from "./handler.ts";
import { LogLevel } from "./level.ts";
import { LogMessage } from "./message.ts";
import { Logger } from "./logger.ts";

class TestHandler extends LogHandler {
  public messages: LogMessage[] = [];
  public formatted: string[] = [];

  override format(message: LogMessage): string {
    return `[${message.level}] ${message.value}`;
  }

  override handle(message: LogMessage): void {
    this.messages.push(message);
    super.handle(message);
  }

  log(message: string): void {
    this.formatted.push(message);
  }
}

Object.values(LogLevel).forEach((level) => {
  Deno.test(`logs a message with ${level} level`, () => {
    const logger = new Logger("test", {
      handlers: [new TestHandler()],
    });

    const messages = (logger.handlers[0] as TestHandler).messages;

    logger[level]?.(`hello`);

    assertEquals(messages[messages.length - 1].level, level);
    assertEquals(messages[messages.length - 1].value, "hello");
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

  assertStrictEquals(
    (logger.handlers[0] as TestHandler).messages[0],
    (logger.handlers[1] as TestHandler).messages[0],
  );
});

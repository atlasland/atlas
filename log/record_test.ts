import { asserts } from "../deps.ts";
import { LogLevel } from "./level.ts";
import { LogRecord } from "./record.ts";

const { assertEquals } = asserts;

Deno.test("log record", () => {
  const record = new LogRecord({
    level: LogLevel.DEBUG,
    message: "Hello World!",
  });

  assertEquals(record.level, LogLevel.DEBUG);
  assertEquals(record.message, "Hello World!");
  assertEquals(record.time, new Date(record.time).toISOString());
});

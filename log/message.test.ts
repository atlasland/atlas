import { assertEquals } from "testing/asserts.ts";
import { LogLevel } from "./level.ts";
import { LogMessage } from "./message.ts";

Deno.test("log message", () => {
  const message = new LogMessage(LogLevel.DEBUG, "Hello World!");
  assertEquals(message.level, LogLevel.DEBUG);
  assertEquals(message.value, "Hello World!");
  assertEquals(message.time, new Date(message.time).toISOString());
});

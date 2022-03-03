import { asserts } from "../deps.ts";
import { LogLevel } from "./level.ts";
import { LogMessage } from "./message.ts";

const { assertEquals } = asserts;

Deno.test("log message", () => {
  const message = new LogMessage(LogLevel.DEBUG, "Hello World!");
  assertEquals(message.level, LogLevel.DEBUG);
  assertEquals(message.value, "Hello World!");
});

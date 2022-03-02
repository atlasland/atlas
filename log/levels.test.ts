import { assertEquals } from "../deps.ts";
import { getLevelName, Level } from "./levels.ts";

Deno.test("log level: emergency", () => {
  assertEquals(Level.EMERGENCY, 0);
  assertEquals(getLevelName(Level.EMERGENCY), "EMERGENCY");
});

Deno.test("log level: alert", () => {
  assertEquals(Level.ALERT, 1);
  assertEquals(getLevelName(Level.ALERT), "ALERT");
});

Deno.test("log level: critical", () => {
  assertEquals(Level.CRITICAL, 2);
  assertEquals(getLevelName(Level.CRITICAL), "CRITICAL");
});

Deno.test("log level: error", () => {
  assertEquals(Level.ERROR, 3);
  assertEquals(getLevelName(Level.ERROR), "ERROR");
});

Deno.test("log level: warn", () => {
  assertEquals(Level.WARN, 4);
  assertEquals(getLevelName(Level.WARN), "WARN");
});

Deno.test("log level: notice", () => {
  assertEquals(Level.NOTICE, 5);
  assertEquals(getLevelName(Level.NOTICE), "NOTICE");
});

Deno.test("log level: info", () => {
  assertEquals(Level.INFO, 6);
  assertEquals(getLevelName(Level.INFO), "INFO");
});

Deno.test("log level: debug", () => {
  assertEquals(Level.DEBUG, 7);
  assertEquals(getLevelName(Level.EMERGENCY), "EMERGENCY");
});

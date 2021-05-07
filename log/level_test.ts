import { assert } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { LogLevel } from "./level.ts";

const { test } = Deno;

test("log level: emergency", () => {
  assert(LogLevel.EMERGENCY === 0);
});

test("log level: alert", () => {
  assert(LogLevel.ALERT === 1);
});

test("log level: critical", () => {
  assert(LogLevel.CRITICAL === 2);
});

test("log level: error", () => {
  assert(LogLevel.ERROR === 3);
});

test("log level: warn", () => {
  assert(LogLevel.WARN === 4);
});

test("log level: notice", () => {
  assert(LogLevel.NOTICE === 5);
});

test("log level: info", () => {
  assert(LogLevel.INFO === 6);
});

test("log level: debug", () => {
  assert(LogLevel.DEBUG === 7);
});

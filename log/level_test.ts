import { asserts } from "../deps.ts";
import { getLevelValue, LogLevel } from "./level.ts";

const { assertEquals } = asserts;

Deno.test("[log] level: emergency", () => {
	assertEquals(LogLevel.EMERGENCY, "emergency");
	assertEquals(getLevelValue(LogLevel.EMERGENCY), 0);
});

Deno.test("[log] level: alert", () => {
	assertEquals(LogLevel.ALERT, "alert");
	assertEquals(getLevelValue(LogLevel.ALERT), 1);
});

Deno.test("[log] level: critical", () => {
	assertEquals(LogLevel.CRITICAL, "critical");
	assertEquals(getLevelValue(LogLevel.CRITICAL), 2);
});

Deno.test("[log] level: error", () => {
	assertEquals(LogLevel.ERROR, "error");
	assertEquals(getLevelValue(LogLevel.ERROR), 3);
});

Deno.test("[log] level: warn", () => {
	assertEquals(LogLevel.WARNING, "warning");
	assertEquals(getLevelValue(LogLevel.WARNING), 4);
});

Deno.test("[log] level: notice", () => {
	assertEquals(LogLevel.NOTICE, "notice");
	assertEquals(getLevelValue(LogLevel.NOTICE), 5);
});

Deno.test("[log] level: info", () => {
	assertEquals(LogLevel.INFO, "info");
	assertEquals(getLevelValue(LogLevel.INFO), 6);
});

Deno.test("[log] level: debug", () => {
	assertEquals(LogLevel.DEBUG, "debug");
	assertEquals(getLevelValue(LogLevel.DEBUG), 7);
});

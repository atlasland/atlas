import { assertEquals } from "../deps_dev.ts";
import { getLevelValue, LogLevel } from "./level.ts";

Deno.test("[log/level] LogLevel emergency", () => {
	assertEquals(LogLevel.EMERGENCY, "emergency");
	assertEquals(getLevelValue(LogLevel.EMERGENCY), 0);
});

Deno.test("[log/level] LogLevel alert", () => {
	assertEquals(LogLevel.ALERT, "alert");
	assertEquals(getLevelValue(LogLevel.ALERT), 1);
});

Deno.test("[log/level] LogLevel critical", () => {
	assertEquals(LogLevel.CRITICAL, "critical");
	assertEquals(getLevelValue(LogLevel.CRITICAL), 2);
});

Deno.test("[log/level] LogLevel error", () => {
	assertEquals(LogLevel.ERROR, "error");
	assertEquals(getLevelValue(LogLevel.ERROR), 3);
});

Deno.test("[log/level] LogLevel warn", () => {
	assertEquals(LogLevel.WARNING, "warning");
	assertEquals(getLevelValue(LogLevel.WARNING), 4);
});

Deno.test("[log/level] LogLevel notice", () => {
	assertEquals(LogLevel.NOTICE, "notice");
	assertEquals(getLevelValue(LogLevel.NOTICE), 5);
});

Deno.test("[log/level] LogLevel info", () => {
	assertEquals(LogLevel.INFO, "info");
	assertEquals(getLevelValue(LogLevel.INFO), 6);
});

Deno.test("[log/level] LogLevel debug", () => {
	assertEquals(LogLevel.DEBUG, "debug");
	assertEquals(getLevelValue(LogLevel.DEBUG), 7);
});

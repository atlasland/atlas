import { asserts } from "../deps.ts";
import { LogLevel } from "./level.ts";
import { LogRecord } from "./record.ts";

const { assertEquals } = asserts;

Deno.test("[log] record: has a 'debug' level", () => {
	const record = new LogRecord({
		level: LogLevel.DEBUG,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.DEBUG);
});

Deno.test("[log] record: has a 'info' level", () => {
	const record = new LogRecord({
		level: LogLevel.INFO,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.INFO);
});

Deno.test("[log] record: has a 'notice' level", () => {
	const record = new LogRecord({
		level: LogLevel.NOTICE,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.NOTICE);
});

Deno.test("[log] record: has a 'warning' level", () => {
	const record = new LogRecord({
		level: LogLevel.WARNING,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.WARNING);
});

Deno.test("[log] record: has a 'error' level", () => {
	const record = new LogRecord({
		level: LogLevel.ERROR,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.ERROR);
});

Deno.test("[log] record: has a 'critical' level", () => {
	const record = new LogRecord({
		level: LogLevel.CRITICAL,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.CRITICAL);
});

Deno.test("[log] record: has a 'alert' level", () => {
	const record = new LogRecord({
		level: LogLevel.ALERT,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.ALERT);
});

Deno.test("[log] record: has a 'emergency' level", () => {
	const record = new LogRecord({
		level: LogLevel.EMERGENCY,
		message: "Hello World!",
	});

	assertEquals(record.level, LogLevel.EMERGENCY);
});

Deno.test("[log] record: has a message", () => {
	const record = new LogRecord({
		level: LogLevel.EMERGENCY,
		message: "Hello World!",
	});

	assertEquals(record.message, "Hello World!");
});

Deno.test("[log] record: has a datetime in ISO", () => {
	const record = new LogRecord({
		level: LogLevel.EMERGENCY,
		message: "Hello World!",
	});
	assertEquals(record.datetime, new Date(record.datetime).toISOString());
});

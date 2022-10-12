import { assertEquals, assertThrows } from "../deps_dev.ts";
import { BaseError } from "./errors.ts";

Deno.test("[error/errors] BaseError accepts a message", () => {
	class TestError extends BaseError {}
	const error = new TestError("test error!");
	assertEquals(error.message, "test error!");
});

Deno.test("[error/errors] BaseError inherits from Error", () => {
	class TestError extends BaseError {}
	const error = new TestError("test error!");
	assertThrows(() => {
		throw error;
	}, Error);
});

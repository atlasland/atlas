import { assertEquals, assertThrows } from "./deps.ts";
import { BaseError } from "./errors.ts";

Deno.test({
	name: "[error] BaseError",
	fn: () => {
		class TestError extends BaseError {}
		const error = new TestError("test error!");
		assertEquals(error.message, "test error!");
		assertThrows(() => {
			throw error;
		}, Error);
	},
});

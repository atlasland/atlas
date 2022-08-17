# atlas/error

The error module for the Atlas framework.

## Usage

The module provides a `BaseError` class that can be extended to implement your
custom errors.

## Custom Errors

To create your own custom error classes, you can extend the `BaseError` class
and implement your own custom logic.

```ts
import { BaseError } from "https://deno.land/x/atlas/error/mod.ts";

export class MyCustomError extends BaseError {
	constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, MyCustomError.prototype);
	}
}
```

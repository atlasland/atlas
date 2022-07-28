# atlas/error

The error module for the Atlas framework.

## Usage

The module provides a set of standard errors to be used in Atlas applications.
It also provides a `BaseError` class that
can be extended to implement your custom errors.

## Errors

### `MissingArgumentError`

This error type is meant to provide runtime safety for your functions. It can be
useful on functions with variadic signatures:

```ts
import { MissingArgumentError } from "https://deno.land/x/atlas/error/mod.ts";

function myHandler(...args: unknown[]): void {
  if (args.lenght === 0) {
    throw new MissingArgumentError();
  }
}
```

## Custom Errors

To create your own custom error classes, you can extend the `BaseError`
class and implement your own custom logic.

```ts
import { BaseError } from "https://deno.land/x/atlas/error/mod.ts";

export class MyCustomError extends BaseError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, MyCustomError.prototype);
  }
}
```

# atlas/log

The log module for the Atlas framework.

## Usage

The module provides a default logger instance with a basic
[console handler](#console).

```ts
import { default as logger } from "https://deno.land/x/atlas/log/mod.ts";

logger.debug(message);
logger.info(message);
logger.notice(message);
logger.warning(message);
logger.error(message);
logger.critical(message);
logger.alert(message);
logger.emergency(message);
```

## Log levels

This module implements the severity levels described in the
[RFC 5424 specification](https://datatracker.ietf.org/doc/html/rfc5424#section-6.2.1):

| Level       | Code | Description                                                                                       |
| ----------- | :--: | ------------------------------------------------------------------------------------------------- |
| `debug`     |  7   | Detailed debug information.                                                                       |
| `info`      |  6   | Interesting events.                                                                               |
| `notice`    |  5   | Normal but significant events.                                                                    |
| `warning`   |  4   | Exceptional occurrences that are not errors.                                                      |
| `error`     |  3   | Runtime errors that do not require immediate action but should typically be logged and monitored. |
| `critical`  |  2   | Critical conditions.                                                                              |
| `alert`     |  1   | Action must be taken immediately.                                                                 |
| `emergency` |  0   | System is unusable.                                                                               |

## Log handlers

A log handler is responsible for formatting and writing a log message to a
destination.

A logger instance can have multiple handlers, each with their own configuration.
A message will be passed to each handler in turn.

### Console

The `ConsoleHandler` writes log messages to the console.

If the log level is `debug`, `info` or `notice`, the message is written to
`Deno.stdout`. Conversely, if the log level is `warning`, `error`, `critical`,
`alert` or `emergency`, the message is written to `Deno.stderr`.

You can optionally configure the `ConsoleHandler` instance to include a
timestamp (in UTC) and output the message as a JSON string.

```ts
export const logger = new Logger("default", {
	handlers: [
		new ConsoleHandler({
			timestamp: true,
			json: true,
		}),
	],
});

logger.debug("Hello world!");
// outputs:
// {"timestamp":"2022-04-04T21:56:14.464Z","level":"debug","message":"Hello world!"}
```

### Custom

Writing your own handler is as simple as implementing the `LogHandler`
interface. Refer to the
[API reference](https://doc.deno.land/https://deno.land/x/atlas@v0.2.0/log/handler.ts/~/LogHandler)
for the up to date interface definition.

```ts
import {
	ConsoleHandler,
	Logger,
	LogMessage,
} from "https://deno.land/x/atlas/log/mod.ts";

class CustomConsoleHandler extends ConsoleHandler {
	override format(message: LogMessage): string {
		const formatted = super.format(message);
		return `[custom prefix] ${formatted}`;
	}
}

export const logger = new Logger("default", {
	handlers: [
		new CustomConsoleHandler({
			timestamp: true,
		}),
	],
});

logger.debug("Hello world!");
// outputs:
// [custom prefix] 2022-04-04T21:45:07.343Z debug Hello world!
```

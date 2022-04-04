import { Logger } from "./logger.ts";
import { ConsoleHandler } from "./handlers/console.ts";

export * from "./logger.ts";
export * from "./level.ts";
export * from "./message.ts";
export * from "./handler.ts";
export * from "./handlers/console.ts";

export default new Logger("default", {
  handlers: [
    new ConsoleHandler(),
  ],
});

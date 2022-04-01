import { parse } from "flags/mod.ts";

import { default as logger } from "./log/logger.ts";
import { type Command } from "./console/mod.ts";

/**
 * Initializes an Atlas application
 */
const init: Command = {
  name: "init",
  description: "Initializes an Atlas application",
  handler: () => {
    // TBD
    logger.debug(`atlas init`);
  },
};

/**
 * Starts an Atlas application
 */
const start: Command = {
  name: "start",
  description: "Starts an Atlas application",
  help: `
    --port  The port where to start the application listener
  `,
  handler: () => {
    // TBD
    logger.debug(`atlas start`);
  },
};

if (import.meta.main) {
  const commands = new Map<Command["name"], Command>([
    [init.name, init],
    [start.name, start],
  ]);

  const command = Deno.args[0] ?? "";
  const args = parse(Deno.args.slice(1));

  if (commands.has(command)) {
    try {
      await commands.get(command)?.handler(args);
    } catch (err) {
      logger.error(`command '${command}' failed with message: ${err.message}`);
    }
  } else {
    logger.error(`command '${command}' not found`);
  }
}

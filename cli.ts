import { parse } from "https://deno.land/std@0.95.0/flags/mod.ts";

import * as log from "./log/mod.ts";
import type { Command } from "./console/mod.ts";

/**
 * Initializes an Atlas application
 */
const init: Command = {
  name: "init",
  description: "Initializes an Atlas application",
  handler: async (args) => {
    // TBD
    await log.info("atlas init", args);
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
  handler: async (args) => {
    // TBD
    await log.info("atlas start", args);
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
      log.error(`Command '${command}' failed`, err.message);
    }
  } else {
    log.error(`Command '${command}' not found`);
  }
}

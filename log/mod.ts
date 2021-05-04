import {
  blue,
  gray,
  red,
  yellow,
} from "https://deno.land/std@0.95.0/fmt/colors.ts";
import { Level } from "./levels.ts";

export * from "./levels.ts";

/**
 * Log to stdout with trace level
 */
export async function trace(...msg: unknown[]): Promise<void> {
  await write(Deno.stdout, gray(Level.TRACE), ...msg);
}

/**
 * Log to stdout with debug level
 */
export async function debug(...msg: unknown[]): Promise<void> {
  await write(Deno.stdout, gray(Level.DEBUG), ...msg);
}

/**
 * Log to stdout with info level
 */
export async function info(...msg: unknown[]): Promise<void> {
  await write(Deno.stdout, ` ${blue(Level.INFO)}`, ...msg);
}

/**
 * Log to stdout with warn level
 */
export async function warn(...msg: unknown[]): Promise<void> {
  await write(Deno.stdout, ` ${yellow(Level.WARN)}`, ...msg);
}

/**
 * Log to stderr with error level
 */
export async function error(...msg: unknown[]): Promise<void> {
  await write(Deno.stderr, red(Level.ERROR), ...msg);
}

/**
 * Log to stderr with fatal level
*/
export async function fatal(...msg: unknown[]): Promise<void> {
  await write(Deno.stderr, red(Level.FATAL.toUpperCase()), ...msg);
}

async function write(
  output: Deno.Writer,
  prefix: string,
  ...msg: unknown[]
): Promise<void> {
  await output.write(new TextEncoder().encode(`${prefix} ${msg}\n`));
}

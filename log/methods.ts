import { colors } from "../deps.ts";
import { getLevelName, Level } from "./levels.ts";

/** Log to stdout with debug level */
export function debug(...msg: unknown[]): void {
  const level = getLevelName(Level.DEBUG);
  const prefix = colors.gray(level);
  write(Deno.stdout, prefix, ...msg);
}

/** Log to stdout with info level */
export function info(...msg: unknown[]): void {
  const level = getLevelName(Level.INFO);
  const prefix = colors.blue(level);
  write(Deno.stdout, prefix, ...msg);
}

/** Log to stdout with notice level */
export function notice(...msg: unknown[]): void {
  const level = getLevelName(Level.NOTICE);
  const prefix = colors.brightBlue(level);
  write(Deno.stdout, prefix, ...msg);
}

/** Log to stdout with warn level */
export function warn(...msg: unknown[]): void {
  const level = getLevelName(Level.WARN);
  const prefix = colors.yellow(level);
  write(Deno.stdout, prefix, ...msg);
}

/** Log to stderr with error level */
export function error(...msg: unknown[]): void {
  const level = getLevelName(Level.ERROR);
  const prefix = colors.red(level);
  write(Deno.stderr, prefix, ...msg);
}

/** Log to stderr with critical level */
export function critical(...msg: unknown[]): void {
  const level = getLevelName(Level.CRITICAL);
  const prefix = colors.red(level);
  write(Deno.stderr, prefix, ...msg);
}

/** Log to stderr with alert level */
export function alert(...msg: unknown[]): void {
  const level = getLevelName(Level.ALERT);
  const prefix = colors.red(level);
  write(Deno.stderr, prefix, ...msg);
}

/** Log to stderr with emergency level */
export function emergency(...msg: unknown[]): void {
  const level = getLevelName(Level.EMERGENCY);
  const prefix = colors.red(level);
  write(Deno.stderr, prefix, ...msg);
}

function write(
  output: Deno.WriterSync,
  level: string,
  ...msg: unknown[]
): void {
  try {
    const prefix = level.toLowerCase();
    output.writeSync(new TextEncoder().encode(`${prefix} ${msg}\n`));
  } catch (error) {
    console.error("Failed to write to output", error);
  }
}

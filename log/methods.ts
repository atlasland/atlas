import { colors } from "../deps.ts";
import { getLevelName, Level } from "./levels.ts";

/** Log to stdout with debug level */
export function debug(...message: unknown[]): void {
  const level = getLevelName(Level.DEBUG);
  const prefix = colors.gray(level);
  write(Deno.stdout, prefix, ...message);
}

/** Log to stdout with info level */
export function info(...message: unknown[]): void {
  const level = getLevelName(Level.INFO);
  const prefix = colors.blue(level);
  write(Deno.stdout, prefix, ...message);
}

/** Log to stdout with notice level */
export function notice(...message: unknown[]): void {
  const level = getLevelName(Level.NOTICE);
  const prefix = colors.brightBlue(level);
  write(Deno.stdout, prefix, ...message);
}

/** Log to stdout with warn level */
export function warn(...message: unknown[]): void {
  const level = getLevelName(Level.WARN);
  const prefix = colors.yellow(level);
  write(Deno.stdout, prefix, ...message);
}

/** Log to stderr with error level */
export function error(...message: unknown[]): void {
  const level = getLevelName(Level.ERROR);
  const prefix = colors.red(level);
  write(Deno.stderr, prefix, ...message);
}

/** Log to stderr with critical level */
export function critical(...message: unknown[]): void {
  const level = getLevelName(Level.CRITICAL);
  const prefix = colors.red(level);
  write(Deno.stderr, prefix, ...message);
}

/** Log to stderr with alert level */
export function alert(...message: unknown[]): void {
  const level = getLevelName(Level.ALERT);
  const prefix = colors.red(level);
  write(Deno.stderr, prefix, ...message);
}

/** Log to stderr with emergency level */
export function emergency(...message: unknown[]): void {
  const level = getLevelName(Level.EMERGENCY);
  const prefix = colors.red(level);
  write(Deno.stderr, prefix, ...message);
}

function write(
  output: Deno.WriterSync,
  level: string,
  ...message: unknown[]
): void {
  try {
    const prefix = level.toLowerCase();
    output.writeSync(new TextEncoder().encode(`${prefix} ${message}\n`));
  } catch (error) {
    console.error("Failed to write to output", error);
  }
}

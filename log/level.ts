/**
 * Log severity levels
 * @see https://tools.ietf.org/html/rfc5424#section-6.2.1
 */
export enum LogLevel {
  EMERGENCY,
  ALERT,
  CRITICAL,
  ERROR,
  WARN,
  NOTICE,
  INFO,
  DEBUG,
}

/** Union of valid log severity level strings */
export type LogLevelName = keyof typeof LogLevel;

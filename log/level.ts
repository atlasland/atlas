/** Log severity levels as per RFC 5424 specification. */
export enum LogLevel {
  /** Emergency: System is unusable. */
  EMERGENCY = "emergency",
  /** Alert: Action must be taken immediately. */
  ALERT = "alert",
  /** Critical: Critical conditions. */
  CRITICAL = "critical",
  /** Error: Runtime errors that do not require immediate action but should typically be logged and monitored. */
  ERROR = "error",
  /** Warning: Exceptional occurrences that are not errors. */
  WARNING = "warning",
  /** Notice: Normal but significant events. */
  NOTICE = "notice",
  /** Informational: Interesting events. */
  INFO = "info",
  /** Debug: Detailed debug information. */
  DEBUG = "debug",
}

/** Union of valid log severity level strings */
export type LogLevelName = Lowercase<keyof typeof LogLevel>;

export function getLevelValue(level: LogLevel): number {
  return Object.values(LogLevel).indexOf(level);
}

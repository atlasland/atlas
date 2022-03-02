/** Log severity levels */
export enum Level {
  /** Emergency: system is unusable */
  EMERGENCY,
  /** Alert: action must be taken immediately */
  ALERT,
  /** Critical: critical conditions */
  CRITICAL,
  /** Error: error conditions */
  ERROR,
  /** Warning: warning conditions */
  WARN,
  /** Notice: normal but significant condition */
  NOTICE,
  /** Informational: informational messages */
  INFO,
  /** Debug: debug-level messages */
  DEBUG,
}

/** Union of valid log severity level strings */
export type LevelName = keyof typeof Level;

/** Returns the string log level name provided the log level enum */
export function getLevelName(level: Level): LevelName {
  switch (level) {
    case Level.EMERGENCY:
      return "EMERGENCY";
    case Level.ALERT:
      return "ALERT";
    case Level.CRITICAL:
      return "CRITICAL";
    case Level.ERROR:
      return "ERROR";
    case Level.WARN:
      return "WARN";
    case Level.NOTICE:
      return "NOTICE";
    case Level.INFO:
      return "INFO";
    case Level.DEBUG:
      return "DEBUG";
  }
}

export enum Level {
  FATAL = "fatal",
  ERROR = "error",
  WARN = "warn",
  INFO = "info",
  DEBUG = "debug",
  TRACE = "trace",
}

/** Union of valid log level strings */
export type LevelName = keyof typeof Level;

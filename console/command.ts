export type Command = {
  /** The console command name. */
  name: string;
  /** The console command description. */
  description?: string;
  /** The console command help text. */
  help?: string;
  /** Indicates whether the command should be shown in the commands list. */
  hidden?: boolean;
  /** The command handler function. */
  handler: (args: unknown) => Promise<void>;
};

import {
  alert,
  critical,
  debug,
  emergency,
  error,
  info,
  notice,
  warn,
} from "./methods.ts";

// TODO(gabe): Add tests for the log methods

emergency("This is an emergency message");
alert("This is an alert message");
critical("This is an critical message");
error("This is an error message");
warn("This is a warning message");
notice("This is a notice message");
info("This is an info message");
debug("This is an debug message");

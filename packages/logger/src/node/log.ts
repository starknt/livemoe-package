import type { ILogger } from '../comom/log'
import { AbstractLogger, DEFAULT_FORMAT, LogLevel } from '../comom/log'

const COLORS_TABLE = {
  [LogLevel.Trace]: ['\x1B[90m', '\x1B[90m'],
  [LogLevel.Debug]: ['\x1B[97m', '\x1B[90m'],
  [LogLevel.Info]: ['\x1B[90m', '\x1B[90m'],
  [LogLevel.Warning]: ['\x1B[93m', '\x1B[90m'],
  [LogLevel.Error]: ['\x1B[91m', '\x1B[90m'],
}

export class ConsoleMainLogger extends AbstractLogger implements ILogger {
  useColors = true

  log(level: LogLevel, message: string | Error, ...args: any[]) {
    switch (level) {
      case LogLevel.Trace:
        this.trace(message, ...args)
        break
      case LogLevel.Debug:
        this.debug(message, ...args)
        break
      case LogLevel.Info:
        this.info(message, ...args)
        break
      case LogLevel.Warning:
        this.warn(message, ...args)
        break
      case LogLevel.Error:
        this.error(message, ...args)
        break
      default:
        break
    }
  }

  trace(message: string | Error, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Trace)
      DEFAULT_FORMAT.node(this.getLevel(), this.getLable(), COLORS_TABLE[this.getLevel()], message, ...args)
  }

  debug(message: string | Error, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Debug)
      DEFAULT_FORMAT.node(this.getLevel(), this.getLable(), COLORS_TABLE[this.getLevel()], message, ...args)
  }

  info(message: string | Error, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Info)
      DEFAULT_FORMAT.node(this.getLevel(), this.getLable(), COLORS_TABLE[this.getLevel()], message, ...args)
  }

  warn(message: string | Error, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Warning)
      DEFAULT_FORMAT.node(this.getLevel(), this.getLable(), COLORS_TABLE[this.getLevel()], message, ...args)
  }

  error(message: string | Error, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Error)
      DEFAULT_FORMAT.node(this.getLevel(), this.getLable(), COLORS_TABLE[this.getLevel()], message, ...args)
  }
}

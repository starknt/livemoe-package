import type { ILogger } from '../comom/log'
import { AbstractLogger, DEFAULT_FORMAT, LogLevel } from '../comom/log'

const COLORS_TABLE = {
  [LogLevel.Trace]: ['#888', '#888'],
  [LogLevel.Debug]: ['#eee', '#888'],
  [LogLevel.Info]: ['#33f', '#888'],
  [LogLevel.Warning]: ['#993', '#888'],
  [LogLevel.Error]: ['#f33', '#888'],
}

export class ConsoleLogger extends AbstractLogger implements ILogger {
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
      DEFAULT_FORMAT.browser(this.getLevel(), this.getLable(), COLORS_TABLE[this.getLevel()], message, ...args)
  }

  debug(message: string | Error, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Debug)
      DEFAULT_FORMAT.browser(this.getLevel(), this.getLable(), COLORS_TABLE[this.getLevel()], message, ...args)
  }

  info(message: string | Error, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Info)
      DEFAULT_FORMAT.browser(this.getLevel(), this.getLable(), COLORS_TABLE[this.getLevel()], message, ...args)
  }

  warn(message: string | Error, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Warning)
      DEFAULT_FORMAT.browser(this.getLevel(), this.getLable(), COLORS_TABLE[this.getLevel()], message, ...args)
  }

  error(message: string | Error, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Error)
      DEFAULT_FORMAT.browser(this.getLevel(), this.getLable(), COLORS_TABLE[this.getLevel()], message, ...args)
  }
}


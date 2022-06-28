import type { Event, IDisposable } from '@livemoe/utils'
import { Disposable, Emitter } from '@livemoe/utils'
import { toErrorMessage } from '../base/error'
import { win } from '../base/platform'

const separator = win() ? '>' : '›'

function padSeparator(p = 2, fillstring = ' '): string {
  return `${fillstring.repeat(p)}${separator}${fillstring.repeat(p)}`
}

function now() {
  return new Date().toLocaleString()
}

type FORMAT_TYPE = 'node' | 'browser'

export const DEFAULT_FORMAT: Record<FORMAT_TYPE, (level: LogLevel, label: string, colors: string[], message: string | Error, ...args: any[]) => void> = {
  browser: (level: LogLevel, label: string, colors: string[], message: string | Error, ...args: any[]) => {
    console[LogLevelToConsoleMethod(level)](`%c [${label} ${now()}] [${LogLevelToString(level).toUpperCase()}]%c%c${padSeparator()}%s`, `color: ${colors[0]};`, 'color: unset;', `color: ${colors[1]}`, message, ...args)
  },
  node: (level: LogLevel, label: string, colors: string[], message: string | Error, ...args: any[]) => {
    console[LogLevelToConsoleMethod(level)](`${colors[0]} [${label} ${now()}] [${LogLevelToString(level).toUpperCase()}]\x1B[0m${padSeparator()}${colors[1]}${message}\x1B[0m`, ...args)
  },
}

export const enum LogLevel {
  Trace,
  Debug,
  Info,
  Warning,
  Error,
}

export const DEFAULT_LOGLEVEL = LogLevel.Info

export function LogLevelToString(level: LogLevel) {
  switch (level) {
    case LogLevel.Trace:
      return 'Trace'
    case LogLevel.Debug:
      return 'Debug'
    case LogLevel.Info:
      return 'Info'
    case LogLevel.Warning:
      return 'Warning'
    case LogLevel.Error:
      return 'Error'
  }
}

export function LogLevelToConsoleMethod(level: LogLevel) {
  switch (level) {
    case LogLevel.Trace:
      return 'trace'
    case LogLevel.Debug:
      return 'debug'
    case LogLevel.Info:
      return 'info'
    case LogLevel.Warning:
      return 'warn'
    case LogLevel.Error:
      return 'error'
    default:
      return 'log'
  }
}

export function parseLogLevel(level: string) {
  switch (level) {
    case 'Trace':
      return LogLevel.Trace
    case 'Debug':
      return LogLevel.Debug
    case 'Info':
      return LogLevel.Info
    case 'Warning':
      return LogLevel.Warning
    case 'Error':
      return LogLevel.Error
    default:
      return LogLevel.Info
  }
}

export interface ILogger extends IDisposable {
  onDidChangeLogLevel: Event<LogLevel>

  setLevel(level: LogLevel): void

  getLevel(): LogLevel

  trace(message: string, ...args: any[]): void

  debug(message: string, ...args: any[]): void

  info(message: string, ...args: any[]): void

  warn(message: string, ...args: any[]): void

  error(message: string | Error, ...args: any[]): void
}

export function log(logger: ILogger, level: LogLevel, message: string) {
  switch (level) {
    case LogLevel.Trace:
      return logger.trace(message)
    case LogLevel.Debug:
      return logger.debug(message)
    case LogLevel.Info:
      return logger.info(message)
    case LogLevel.Warning:
      return logger.warn(message)
    case LogLevel.Error:
      return logger.error(message)
    default:
      throw new Error(`Unknown log level: ${level}`)
  }
}

export interface ILoggerService {
  create(lable: string): ILogger
}

export abstract class AbstractLogger extends Disposable {
  protected readonly _onDidChangeLogLevel = this._register(
    new Emitter<LogLevel>(),
  )

  private lable = 'Default'

  private _level: LogLevel = DEFAULT_LOGLEVEL

  constructor(level: LogLevel = DEFAULT_LOGLEVEL) {
    super()

    this._level = level
  }

  setLable(lable: string) {
    this.lable = lable
  }

  getLable() {
    return this.lable
  }

  getLevel(): LogLevel {
    return this._level
  }

  checkLogLevel(level: LogLevel) {
    return this._level <= level
  }

  get onDidChangeLogLevel(): Event<LogLevel> {
    return this._onDidChangeLogLevel.event
  }

  setLevel(level: LogLevel) {
    if (this._level !== level) {
      this._level = level
      this._onDidChangeLogLevel.fire(level)
    }
  }
}

export class AdapterLogger extends AbstractLogger implements ILogger {
  constructor(
    private readonly adapter: { log: (level: LogLevel, array: any[]) => void },
    logLevel: LogLevel = DEFAULT_LOGLEVEL,
  ) {
    super()
    this.setLevel(logLevel)
  }

  trace(message: string, ...args: any[]): void {
    this.adapter.log(LogLevel.Trace, [this.extractError(message), ...args])
  }

  debug(message: string, ...args: any[]): void {
    this.adapter.log(LogLevel.Debug, [this.extractError(message), ...args])
  }

  info(message: string, ...args: any[]): void {
    this.adapter.log(LogLevel.Info, [this.extractError(message), ...args])
  }

  warn(message: string, ...args: any[]): void {
    this.adapter.log(LogLevel.Warning, [this.extractError(message), ...args])
  }

  error(message: string | Error, ...args: any[]): void {
    this.adapter.log(LogLevel.Error, [this.extractError(message), ...args])
  }

  extractError(msg: Error | string) {
    if (typeof msg === 'string')
      return msg

    return toErrorMessage(msg, this.getLevel() <= LogLevel.Trace)
  }
}


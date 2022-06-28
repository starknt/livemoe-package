import { promises as fs } from 'fs'
import path from 'path'
import { Queue } from '@livemoe/utils'
import type { ILogger } from '../comom/log'
import { AbstractLogger, LogLevel, LogLevelToString } from '../comom/log'
import { dev } from '../base/platform'

const MAX_LOG_FILE_SIZE = 1024 * 1024 * 10

export class FileLogger extends AbstractLogger implements ILogger {
  private readonly queue: Queue<void>

  private fileHandle: fs.FileHandle | undefined

  private initalizePromise: Promise<void>

  constructor(label: string, private readonly filePath: string, level: LogLevel) {
    super()

    this.setLable(label)
    this.setLevel(level)
    this.queue = this._register(new Queue())
    this.initalizePromise = this.initalize()
  }

  private async initalize() {
    try {
      this.fileHandle = await fs.open(this.filePath, 'w+', 0o777)
    }
    catch (error) {
      this.fileHandle = undefined
      console.error(error)
      if (dev())
        throw error
    }
  }

  private _log(level: LogLevel, message: string): void {
    this.queue.queue(async () => {
      await this.initalizePromise

      if (!this.fileHandle)
        return undefined

      await this.fileHandle.appendFile(`[${this.getCurrentTimestamp()} ${this.getLable()}] [${LogLevelToString(level)}] ${message}\n`)
    })
  }

  private getCurrentTimestamp(): string {
    const toTwoDigits = (v: number) => v < 10 ? `0${v}` : v
    const toThreeDigits = (v: number) => v < 10 ? `00${v}` : v < 100 ? `0${v}` : v
    const currentTime = new Date()
    return `${currentTime.getFullYear()}-${toTwoDigits(currentTime.getMonth() + 1)}-${toTwoDigits(currentTime.getDate())} ${toTwoDigits(currentTime.getHours())}:${toTwoDigits(currentTime.getMinutes())}:${toTwoDigits(currentTime.getSeconds())}.${toThreeDigits(currentTime.getMilliseconds())}`
  }

  private format(args: any): string {
    let result = ''

    for (let i = 0; i < args.length; i++) {
      let a = args[i]

      if (typeof a === 'object') {
        try {
          a = JSON.stringify(a)
        }
        catch (e) { }
      }

      result += (i > 0 ? ' ' : '') + a
    }

    return result
  }

  trace(message: string, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Trace)
      this._log(LogLevel.Trace, this.format([message, ...args]))
  }

  debug(message: string, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Debug)
      this._log(LogLevel.Debug, this.format([message, ...args]))
  }

  info(message: string, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Info)
      this._log(LogLevel.Info, this.format([message, ...args]))
  }

  warn(message: string, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Warning)
      this._log(LogLevel.Warning, this.format([message, ...args]))
  }

  error(message: string | Error, ...args: any[]): void {
    if (this.getLevel() <= LogLevel.Error)
      this._log(LogLevel.Error, this.format([message, ...args]))
  }
}
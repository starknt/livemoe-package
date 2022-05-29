import type { IDisposable } from './lifecycle'

export class PauseTimeout implements IDisposable {
  private timer: NodeJS.Timeout | undefined = undefined

  private intervalTimer: NodeJS.Timer | undefined = undefined

  private _time = this.time

  constructor(
    private time: number,
    private listener: () => void,
    private readonly thisArg?: unknown,
  ) {
    // noop
  }

  start() {
    if (this.timer)
      return

    if (this.thisArg)
      this.listener = this.listener.bind(this.thisArg)

    this.timer = setTimeout(this.listener, this._time)
    this.setupIntervalTimer()
  }

  private setupIntervalTimer() {
    if (this.intervalTimer || this._time === 0)
      return
    this.intervalTimer = setInterval(() => {
      this._time -= 10
      if (this._time <= 0 && this.intervalTimer) {
        this._time = 0
        clearInterval(this.intervalTimer)
      }
    }, 10)
  }

  pause() {
    if (!this.timer)
      return

    if (this._time !== 0 && this.intervalTimer) {
      clearInterval(this.intervalTimer)
      this.intervalTimer = undefined
    }
    clearInterval(this.timer)
    this.timer = undefined
  }

  restore() {
    this.start()
  }

  reset(time?: number) {
    if (time)
      this.time = time

    this.dispose()
    this.start()
  }

  dispose() {
    if (this.intervalTimer)
      clearInterval(this.intervalTimer)

    if (this.timer)
      clearTimeout(this.timer)

    this.intervalTimer = undefined
    this.timer = undefined
    this._time = this.time
  }
}

export class PauseInterval implements IDisposable {
  private timer: NodeJS.Timer | undefined = undefined

  constructor(
    private time: number,
    private readonly listener: () => void,
    private readonly thisArg?: unknown,
  ) {
    // noop
  }

  start() {
    if (this.timer)
      return

    this.timer = setInterval(this.listener.bind(this.thisArg), this.time)
  }

  pause() {
    if (!this.timer)
      return

    clearInterval(this.timer)
    this.timer = undefined
  }

  restore() {
    this.start()
  }

  reset(time?: number) {
    if (time)
      this.time = time

    this.dispose()
    this.start()
  }

  dispose() {
    if (this.timer)
      clearInterval(this.timer)
    this.timer = undefined
  }
}

export const setPauseTimeout = (handler: () => void, time: number) => {
  return new PauseTimeout(time, handler).start()
}

export const setPauseInterval = (handler: () => void, time: number) => {
  return new PauseInterval(time, handler).start()
}
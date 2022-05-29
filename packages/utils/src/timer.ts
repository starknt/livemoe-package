import type { IDisposable } from './lifecycle'

export class PauseTimeout implements IDisposable {
  private timer: NodeJS.Timeout | undefined = undefined

  private _time = this.time

  private startTime = 0

  constructor(
    private time: number,
    private listener: () => void,
    private readonly thisArg?: unknown,
  ) {
    // noop
  }

  start(): PauseTimeout {
    if (this.timer)
      return this

    if (this.thisArg)
      this.listener = this.listener.bind(this.thisArg)

    this.timer = setTimeout(this.listener, this._time)
    this.startTime = Date.now()
    return this
  }

  pause() {
    if (!this.timer)
      return

    this._time = this.time - (Date.now() - this.startTime)
    clearInterval(this.timer)
    this.timer = undefined
    return this
  }

  restore() {
    return this.start()
  }

  reset(time?: number) {
    if (time)
      this.time = time

    this.dispose()
    return this.start()
  }

  dispose() {
    if (this.timer)
      clearTimeout(this.timer)

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
      return this

    this.timer = setInterval(this.listener.bind(this.thisArg), this.time)
    return this
  }

  pause() {
    if (!this.timer)
      return

    clearInterval(this.timer)
    this.timer = undefined
    return this
  }

  restore() {
    return this.start()
  }

  reset(time?: number) {
    if (time)
      this.time = time

    this.dispose()
    return this.start()
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
import type { Event, VSBuffer } from '@livemoe/utils'
import type { IMessagePassingProtocol } from './ipc'

export interface Sender {
  send(channel: string, msg: Buffer | null): void
}

export class Protocol implements IMessagePassingProtocol {
  constructor(
    private readonly sender: Sender,
    readonly onMessage: Event<VSBuffer>,
  ) {}

  send(message: VSBuffer): void {
    try {
      this.sender.send('ipc:message', <Buffer>message.buffer)
    }
    catch (e) {
      // systems are going down
    }
  }

  dispose(): void {
    this.sender.send('ipc:disconnect', null)
  }
}

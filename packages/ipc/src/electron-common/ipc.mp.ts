// MessagePort
/**
 * 主进程
 *  const { MessageChannelMain } = require('electron')
 *  const { port1, port2 } = new MessageChannelMain()
 *   w.webContents.postMessage('port', null, [port2])
 *   port1.postMessage({ some: 'message' })
 *
 * 渲染进程
 *   const { ipcRenderer } = require('electron')
 *   ipcRenderer.on('port', (e) => {
 *       e.ports[0].on('message', (messageEvent) => {
 *           console.log(messageEvent.data)
 *       })
 *   })
 *
 */

import type { Event, VSBuffer } from '@livemoe/utils'
import type { IMessagePassingProtocol } from './ipc'

export interface Sender {
  postMessage(channel: string, msg: Buffer | null, transfer?: Electron.MessagePortMain[]): void
}

export class Protocol implements IMessagePassingProtocol {
  constructor(
    private readonly sender: Sender,
    readonly onMessage: Event<VSBuffer>,
  ) {}

  send(message: VSBuffer): void {
    try {
      this.sender.postMessage('ipc:message', <Buffer>message.buffer)
    }
    catch (e) {
      // systems are going down
    }
  }

  dispose(): void {
    this.sender.postMessage('ipc:disconnect', null)
  }
}
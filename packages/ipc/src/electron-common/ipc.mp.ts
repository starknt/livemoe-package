// MessagePort
/**
 * 主进程
 *  const { MessageChannelMain } = require('electron')
 *  const { port1, port2 } = new MessageChannelMain()
 *   w.webContents.postMessage('port', null, [port2])
 *   port1.postMessage({ some: 'message' })
 *   port1.start()
 *
 * 渲染进程
 *   const { ipcRenderer } = require('electron')
 *   ipcRenderer.on('port', (e) => {
 *       e.ports[0].on('message', (messageEvent) => {
 *           console.log(messageEvent.data)
 *       })
 *       e.ports[0].start()
 *   })
 */

import { Event, VSBuffer } from '@livemoe/utils'
import type { IDisposable } from '@livemoe/utils'
import type { IMessagePassingProtocol } from './ipc'
import { IPCClient } from './ipc'

export interface MessageEvent {
  data: Uint8Array
}

export interface MessagePort {
  addEventListener(event: 'message', listener: (this: MessagePort, e: MessageEvent) => unknown): void
  removeEventListener(event: 'message', listener: (this: MessagePort, e: MessageEvent) => unknown): void

  postMessage(message: Uint8Array): void

  start(): void
  close(): void
}

export class Protocol implements IMessagePassingProtocol {
  readonly onMessage: Event<VSBuffer>

  constructor(private readonly port: MessagePort) {
    this.onMessage = Event.fromDOMEventEmitter<VSBuffer>(port, 'message', (e: MessageEvent) => VSBuffer.wrap(e.data))

    port.start()
  }

  send(message: VSBuffer): void {
    try {
      this.port.postMessage(message.buffer)
    }
    catch (e) {
      // systems are going down
    }
  }

  disconnect(): void {
    this.port.close()
  }
}

export class MessagePortClient extends IPCClient implements IDisposable {
  private protocol: Protocol

  constructor(
    port: MessagePort,
    clientId: string,
  ) {
    const protocol = new Protocol(port)
    super(protocol, clientId)

    this.protocol = protocol
  }

  dispose(): void {
    this.protocol.disconnect()
  }
}
import type { IDisposable } from '@livemoe/utils'
import { Event, VSBuffer } from '@livemoe/utils'
import { ipcRenderer } from 'electron'
import { IPCClient } from '../electron-common/ipc'
import { Protocol } from '../electron-common/ipc.electron'
import type { IIPCLogger } from '../electron-common/ipc.logger'

// @ts-expect-error ok
window.ipcRenderer = ipcRenderer

export interface ICommonProtocol {
  send(event: string | symbol, ...args: unknown[]): void
  on(event: string | symbol, callback: Function): void
  removeListener(event: string | symbol, listener: (...args: unknown[]) => void): void
}

export class IPCRenderServer extends IPCClient implements IDisposable {
  static commonProtocol?: ICommonProtocol

  private readonly protocol: Protocol

  private static createProtocol(commonProtocol?: ICommonProtocol): Protocol {
    let ipcRenderer: ICommonProtocol
    let onMessage
    if (typeof window.require === 'function' && window.require('electron').ipcRenderer) {
      // node
      ipcRenderer = window.require('electron').ipcRenderer
      onMessage = Event.fromNodeEventEmitter<VSBuffer>(ipcRenderer, 'ipc:message', (_, message: Buffer) => VSBuffer.wrap(message))
      ipcRenderer.send('ipc:hello')
    }
    // @ts-expect-error ok
    else if (window.ipcRenderer) {
      // electron
      // @ts-expect-error ok
      ipcRenderer = window.ipcRenderer
      onMessage = Event.fromNodeEventEmitter<VSBuffer>(ipcRenderer, 'ipc:message', (_, message: Buffer) => VSBuffer.wrap(message))
      ipcRenderer.send('ipc:hello')
    }
    else {
      // web
      // 优先使用构造函数传入的参数
      if (commonProtocol) {
        ipcRenderer = commonProtocol
        onMessage = Event.fromNodeEventEmitter(ipcRenderer, 'ipc:message', (_, message: any) => VSBuffer.wrap(message))
        ipcRenderer.send('ipc:hello')
      }
      else if (this.commonProtocol) {
        ipcRenderer = this.commonProtocol
        onMessage = Event.fromNodeEventEmitter(ipcRenderer, 'ipc:message', (_, message: any) => VSBuffer.wrap(message))
        ipcRenderer.send('ipc:hello')
      }
      else {
        throw new Error('FatalError: In the web environment, you must provide a custom protocol, otherwise the RendererServer will not work properly')
      }
    }

    return new Protocol(ipcRenderer, onMessage)
  }

  /**
   *
   * @param ctx 创建连接上下文
   * @param commonProtocol 用于扩展服务器的通信方式
   */
  constructor(ctx: string, commonProtocol?: ICommonProtocol, ipcLogger: IIPCLogger | null = null) {
    const protocol = IPCRenderServer.createProtocol(commonProtocol)
    super(protocol, ctx, ipcLogger)
    this.protocol = protocol
  }

  dispose(): void {
    this.protocol.dispose()
  }
}

import { Event, generateUuid } from '@livemoe/utils'
import type { BrowserWindow, IpcMainEvent, MessagePortMain } from 'electron'
import { ipcMain } from 'electron'
import { MessagePortClient as MessagePortServer } from '../electron-common/ipc.mp'

export class MessageMainPortServer extends MessagePortServer {
  constructor(port: MessagePortMain, clintId: string) {
    super({
      addEventListener: (event, listener) => port.addListener(event, listener),
      removeEventListener: (event, listener) => port.removeListener(event, listener),
      postMessage: (message: Uint8Array) => port.postMessage(message),
      start: () => port.start(),
      close: () => port.close(),
    }, clintId)
  }
}

export async function connect(window: BrowserWindow) {
  if (window.isDestroyed() || window.webContents.isDestroyed())
    throw new Error('ipc.mp#connect: Cannot talk to window because it is closed or destroyed')

  const nonce = generateUuid()
  window.webContents.postMessage('ipc:createMessageChannel', nonce)

  const onCreateChannelResult = Event.fromNodeEventEmitter<{ nonce: string; port: MessagePortMain }>(ipcMain, 'ipc:messageChannelResult', (e: IpcMainEvent, nonce: string) => ({ nonce, port: e.ports[0] }))
  const { port } = await Event.toPromise(Event.filter(onCreateChannelResult, e => e.nonce === nonce))

  return port
}
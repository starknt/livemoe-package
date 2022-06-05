import { Event } from '@livemoe/utils'
import { ipcRenderer } from 'electron'
import type { ClientConnectionEvent } from '../electron-common/ipc'
import { IPCServer } from '../electron-common/ipc'
import { Protocol } from '../electron-common/ipc.mp'

export class MessagePortClient extends IPCServer {
  private static getOnDidClientConnect() {
    const onCreateMessageChannel = Event.fromNodeEventEmitter(ipcRenderer, 'ipc:createMessageChannel', (_, nonce) => nonce)

    return Event.map(onCreateMessageChannel, (nonce) => {
      const { port1: incomingPort, port2: outgoingPort } = new MessageChannel()
      const protocol = new Protocol(incomingPort)

      const result: ClientConnectionEvent = {
        protocol,
        onDidClientDisconnect: Event.fromDOMEventEmitter(incomingPort, 'close'),
      }

      ipcRenderer.postMessage('ipc:messageChannelResult', nonce, [outgoingPort])

      return result
    })
  }

  constructor() {
    super(MessagePortClient.getOnDidClientConnect())
  }
}

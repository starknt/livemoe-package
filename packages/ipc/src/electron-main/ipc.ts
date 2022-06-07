import { ipcMain } from 'electron'
import { Emitter, Event, VSBuffer, toDisposable } from '@livemoe/utils'
import type { IDisposable } from '@livemoe/utils'
import { IPCServer } from '../electron-common/ipc'
import type { ClientConnectionEvent } from '../electron-common/ipc'
import { Protocol } from '../electron-common/ipc.electron'
import type { IIPCLogger } from '../electron-common/ipc.logger'

interface IIPCEvent {
  event: { sender: Electron.WebContents }
  message: Buffer | null
}

function createScopedOnMessageEvent(
  senderId: number,
  eventName: string,
): Event<VSBuffer | Buffer> {
  const onMessage = Event.fromNodeEventEmitter<IIPCEvent>(
    ipcMain,
    eventName,
    (event, message) => ({ event, message }),
  )
  const onMessageFromSender = Event.filter(
    onMessage,
    ({ event }) => event.sender.id === senderId,
  )

  return Event.map(onMessageFromSender, ({ message }) =>
    message ? VSBuffer.wrap(message) : message!,
  )
}

export class IPCMainServer extends IPCServer {
  private static readonly Clients: Map<number, IDisposable> = new Map<
    number,
    IDisposable
  >()

  private static getOnDidClientConnect(): Event<ClientConnectionEvent> {
    const onHello = Event.fromNodeEventEmitter<Electron.WebContents>(
      ipcMain,
      'ipc:hello',
      ({ sender }) => sender,
    )

    return Event.map(onHello, (webContents) => {
      const { id } = webContents
      const client = IPCMainServer.Clients.get(id)

      if (client)
        client.dispose()

      const onDidClientReconnect = new Emitter<void>()
      IPCMainServer.Clients.set(
        id,
        toDisposable(() => onDidClientReconnect.fire()),
      )

      const onMessage = createScopedOnMessageEvent(
        id,
        'ipc:message',
      ) as Event<VSBuffer>
      const onDidClientDisconnect = Event.any(
        Event.signal(createScopedOnMessageEvent(id, 'ipc:disconnect')),
        onDidClientReconnect.event,
      )
      const protocol = new Protocol(webContents, onMessage)
      return { protocol, onDidClientDisconnect }
    })
  }

  constructor(ipcLogger: IIPCLogger | null = null) {
    super(IPCMainServer.getOnDidClientConnect(), ipcLogger)
  }
}

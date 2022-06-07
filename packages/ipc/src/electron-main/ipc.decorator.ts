import { IdleValue } from '@livemoe/utils'
import { IPCLogger } from '../electron-common/ipc.logger'
import type { IService } from '../electron-common/ipc.service'
import { IPCService } from '../electron-common/ipc.service'
import { IPCMainServer } from './ipc'

let _server: IdleValue<IPCMainServer> | undefined
const serviceCollection = new Map<string, IService>()

export interface IPCMainServerOptions {
  log: boolean
  outgoingPrefix?: string
  incomingPrefix?: string
}

export function InjectedService(channleName: string, server?: IPCMainServer): any {
  return (target: any, key: string) => {
    try {
      if (serviceCollection.has(channleName)) {
        target[key] = serviceCollection.get(channleName)!
      }
      else {
        target[key] = new IPCService()

        serviceCollection.set(channleName, target[key])

        if (!server)
          _server?.value.registerChannel(channleName, target[key])
        else
          server.registerChannel(channleName, target[key])
      }
    }
    catch (error) {
      console.error(error)
    }
  }
}

export function InjectedServer(options?: IPCMainServerOptions, exector?: () => IPCMainServer) {
  return (target: any, key: string) => {
    if (!_server) {
      if (options && !exector) {
        _server = new IdleValue(() => {
          return new IPCMainServer(new IPCLogger(options.outgoingPrefix ?? 'outgoing', options.incomingPrefix ?? 'incoming'))
        })
      }
      else if (exector) {
        _server = new IdleValue(exector)
      }
      else {
        _server = new IdleValue(() => new IPCMainServer())
      }
    }
    try {
      target[key] = _server.value
    }
    catch (error) {
      console.error(error)
    }
  }
}

export const getInsideServer = () => _server ? _server.value : null
import { IdleValue } from '@livemoe/utils'
import { IPCLogger } from '../electron-common/ipc.logger'
import type { IService } from '../electron-common/ipc.service'
import { IPCService } from '../electron-common/ipc.service'
import { IPCMainServer } from './ipc'

interface PendingService {
  target: Record<string | number | symbol, any>
  key: string
}

let _server: IdleValue<IPCMainServer> | undefined
const _serviceCollection = new Map<string, IService>()
let _pendingServices: Map<string, PendingService> | null = new Map()

export interface IPCMainServerOptions {
  log: boolean
  outgoingPrefix?: string
  incomingPrefix?: string
}

export function InjectedService(channleName: string, server?: IPCMainServer): any {
  return (target: any, key: string) => {
    try {
      if (_serviceCollection.has(channleName)) {
        target[key] = _serviceCollection.get(channleName)!
      }
      else {
        if (server) {
          const service = new IPCService()
          target[key] = service
          server.registerChannel(channleName, service)
        }
        else if (!_server) {
          _pendingServices?.set(channleName, {
            target,
            key,
          })
        }
        else if (_server) {
          target[key] = new IPCService()

          _serviceCollection.set(channleName, target[key])

          _server.value.registerChannel(channleName, target[key])
        }
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

      if (_pendingServices) {
        for (const [channelName, PendingService] of _pendingServices) {
          if (_serviceCollection.has(channelName)) {
            const service = _serviceCollection.get(channelName)!

            const { target, key } = PendingService

            target[key] = service

            _server.value.registerChannel(channelName, service)
          }
          else {
            const service = new IPCService()
            target[key] = service
            _serviceCollection.set(channelName, service)
            _server.value.registerChannel(channelName, service)
          }
        }

        _pendingServices?.clear()
        _pendingServices = null
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

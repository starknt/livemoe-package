import { IdleValue } from '@livemoe/utils'
import type { IService } from '../electron-common/ipc.service'
import { IPCService } from '../electron-common/ipc.service'
import { IPCMainServer } from './ipc'

let _server = new IdleValue(() => new IPCMainServer())
const serviceCollection = new Map<string, IService>()

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
          _server.value.registerChannel(channleName, target[key])
        else
          server.registerChannel(channleName, target[key])
      }
    }
    catch (error) {
      console.error(error)
    }
  }
}

export function InjectedServer() {
  return (target: any, key: string) => {
    try {
      target[key] = _server.value
    }
    catch (error) {
      console.error(error)
    }
  }
}

export function InitalizedServer(server: IPCMainServer) {
  serviceCollection.forEach((service, key) => {
    _server.dispose()
    server.registerChannel(key, service)
    _server = new IdleValue(() => server)
  })
}
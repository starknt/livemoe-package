/* eslint-disable no-new */
import { IdleValue } from '@livemoe/utils'
import { SyncDescriptor } from './descriptors'
import type { ServiceIdentifier } from './instantiation'
import { InstantiationService } from './instantiationService'
import { ServiceCollection } from './serviceCollection'

const serviceCollection = new ServiceCollection()

export const Service = <T>(id: ServiceIdentifier<T>) => {
  return function (constructor: new (...args: any[]) => any) {
    serviceCollection.set(id, new SyncDescriptor<T>(constructor))
  }
}

export const Module = () => {
  const instantiationService = new InstantiationService(serviceCollection)

  return (constructor: new (...args: any[]) => any) => {
    new IdleValue(() => {
      instantiationService.createInstance(new SyncDescriptor(constructor, [], true))
    })
  }
}
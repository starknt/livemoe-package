import { IdleValue } from '@livemoe/utils'
import { SyncDescriptor } from './descriptors'
import type { ServiceIdentifier } from './instantiation'
import { InstantiationService } from './instantiationService'
import { ServiceCollection } from './serviceCollection'

const serviceCollection = new ServiceCollection()

export const Injectable = <T>(id: ServiceIdentifier<T>, staticParams?: any[] | any, supportsDelayedInstantiation = false) => {
  return function (constructor: new (...args: any[]) => any) {
    if (!serviceCollection.has(id))
      serviceCollection.set(id, new SyncDescriptor<T>(constructor, Array.isArray(staticParams) ? staticParams : [staticParams], supportsDelayedInstantiation))
  }
}

export const Module = (staticParams?: any[] | any, supportsDelayedInstantiation = false) => {
  const instantiationService = new InstantiationService(serviceCollection)

  return (constructor: new (...args: any[]) => any) => {
    new IdleValue(() => {
      instantiationService.createInstance(new SyncDescriptor(constructor, Array.isArray(staticParams) ? staticParams : [staticParams], supportsDelayedInstantiation))
    })
  }
}
import { IPCRenderServer, MessagePortClient } from '@livemoe/ipc/renderer'
import { Event, retry } from '@livemoe/utils'
import { contextBridge } from 'electron'
const client = new IPCRenderServer('')

const messagePortClient = new MessagePortClient()

messagePortClient.registerChannel('test', {
  // @ts-expect-error
  call: async (ctx, command) => {
    console.log(ctx, command)
    return command
  },
  listen: (ctx, event) => {
    console.log(ctx, event)
    return Event.None
  },
})

messagePortClient.onFirstConnection(async () => {
  console.log('connected')
  const port = await retry(async () => await messagePortClient.getChannel('main', 'test'), 50, 5)

  port!.call('test', 123).then(console.log).catch(console.error)
})

const testChannel = client.getChannel('test')

contextBridge.exposeInMainWorld('ipc', {
  call: async (channel: string, ...args: any[]) => {
    return await testChannel.call(channel, ...args)
  },
})
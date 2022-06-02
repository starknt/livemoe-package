import { IPCRenderServer } from '@livemoe/ipc/renderer'
import { contextBridge } from 'electron'
const client = new IPCRenderServer('')

const testChannel = client.getChannel('test')

testChannel.call('test')
  .then((res) => {
    console.log(res)
  })
  .catch(err => console.error(err))

contextBridge.exposeInMainWorld('ipc', {
  call: async (channel: string, ...args: any[]) => {
    return await testChannel.call(channel, ...args)
  },
})
import { Client } from '@livemoe/ipc/RP'
import { contextBridge } from 'electron'
const client = new Client('')

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
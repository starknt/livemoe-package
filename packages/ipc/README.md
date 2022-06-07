<h1 align="center">electron-easy-ipc</h1>

## 特性
- 更加易于管理维护的IPC通信
- 双向通信
- 轻量化的序列化

## 快速开始
### 在主进程中
- 装饰器
```typescript
import assert from 'assert'
import type { IPCService } from '@livemoe/ipc'
import { InjectedServer, InjectedService, MessageMainPortServer, connect } from '@livemoe/ipc/main'
import type { IPCMainServer } from '@livemoe/ipc/main'

class Main {
  @InjectedServer({ log: true, outgoingPrefix: 'out-main', incomingPrefix: 'in -main' })
  private readonly server!: IPCMainServer

  @InjectedService('test')
  private readonly tService!: IPCService

  constructor() {
    this.tService.registerCaller('test', async (msg) => {
      return msg
    })

    setTimeout(async () => {
      const port = await connect(BrowserWindow.getAllWindows()[0]) // an browserWindow

      const messagePortServer = new MessageMainPortServer(port, 'main')

      const channel = messagePortServer.getChannel('test')
      channel.call('s')
      messagePortServer.registerChannel('test', this.tService)
    })

    this.getService()
  }

  async getService() {
    const channel = await this.server.getChannel('preload', 'rtest')

    channel.call('rtest', 123).then(console.log).catch(console.error)
  }
}

new Main()
```
- 非装饰器
```typescript
import { IPCService, IPCLogger } from '@livemoe/ipc'
import { IPCMainServer } from '@livemoe/ipc/main'

const server = new IPCMainServer(new IPCLogger('out-main', 'in -main'))
const service = new IPCService()
server.registerChannel('test', service)
service.registerCaller('test', async (msg: string) => {
  return msg
})

app.on('will-quit', () => {
  server.dispose()
})
```
### Preload 脚本环境
```typescript
import { IPCLogger, IPCService } from '@livemoe/ipc'
import { IPCRenderServer, MessagePortClient } from '@livemoe/ipc/renderer'

const client = new IPCRenderServer('preload', ipcRenderer, new IPCLogger('main', 'preload'))

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

const testService = new IPCService()

client.registerChannel('rtest', testService)

testService.registerCaller('rtest', async (msg) => {
  return msg
})

const testChannel = client.getChannel('test')

testChannel.call('test', 'hello')
  .then((res: string) => {
    console.log(res) // print hello
  })
  .catch(err => console.error(err))
```
### Web 环境
```typescript
import { IPCRenderServer, ICommonProtocol } from '@livemoe/ipc/renderer'
import { IPCLogger, IPCService } from '@livemoe/ipc'
/**
 * commonProtocol: ICommonProtocol
 * interface ICommonProtocol {
 *  send(event: string | symbol, ...args: unknown[]): void
 *  on(event: string | symbol, callback: Function): void
 *  removeListener(event: string | symbol, listener: (...args: unknown[]) => void): void
 * }
*/

// commonProtocol需要由Preload脚本注入
const client = new IPCRenderServer('', window.commonProtocol, new IPCLogger('main', 'web'))

const testChannel = client.getChannel('test')

testChannel.call('test', 'hello')
  .then((res: string) => {
    console.log(res) // print hello
  })
  .catch(err => console.error(err))
```
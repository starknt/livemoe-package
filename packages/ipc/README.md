<h1 align="center">electron-easy-ipc</h1>

## 特性
- 更加易于管理维护的IPC通信
- 双向通信
- 轻量化的序列化

## 快速开始
### 在主进程中
```typescript
import { IPCService } from '@livemoe/ipc'
import { Server } from '@livemoe/ipc/main'

const server = new Server()
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
import { Client } from '@livemoe/ipc/renderer'

const client = new Client('')

const testChannel = client.getChannel('test')

testChannel.call('test', 'hello')
  .then((res: string) => {
    console.log(res) // hello
  })
  .catch(err => console.error(err))
```
### Web 环境
```typescript
import { Client, ICommonProtocol } from '@livemoe/ipc/renderer'

/**
 * commonProtocol: ICommonProtocol
 * interface ICommonProtocol {
 *  send(event: string | symbol, ...args: unknown[]): void
 *  on(event: string | symbol, callback: Function): void
 *  removeListener(event: string | symbol, listener: (...args: unknown[]) => void): void
 * }
*/

// commonProtocol需要由Preload脚本注入
const client = new Client('', window.commonProtocol)

const testChannel = client.getChannel('test')

testChannel.call('test', 'hello')
  .then((res: string) => {
    console.log(res) // hello
  })
  .catch(err => console.error(err))
```
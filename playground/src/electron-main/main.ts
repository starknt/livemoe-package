import path from 'path'
import assert from 'assert'
import { IPCService } from '@livemoe/ipc'
import { Server } from '@livemoe/ipc/MP'
import { BrowserWindow, app } from 'electron'
import { GetSysListViewPosition } from '@livemoe/tool'
import { InstantiationService, Service, ServiceCollection, SyncDescriptor, createDecorator } from '@livemoe/core'

export interface ITestService {
  hello: string
}

const ITestService = createDecorator<ITestService>('ITestService')

class TestService implements ITestService {
  hello = 'hello'
}

class Main {
  constructor(@ITestService private readonly testService: ITestService) {
    assert.ok(testService)
    assert.equal(testService.hello, 'hello')
    console.log('创建Main...')
  }
}

console.log(GetSysListViewPosition())
const serviceCollection = new ServiceCollection()
serviceCollection.set(ITestService, new SyncDescriptor<ITestService>(TestService))
const instantiationService = new InstantiationService(serviceCollection)
instantiationService.createInstance(new SyncDescriptor(Main, [], true))
instantiationService.invokeFunction((accessor) => {
  const d = accessor.get(ITestService)

  assert.ok(d)
  assert.equal(d.hello, 'hello')
  console.log(`invokeFunction:${ITestService}`)
})

const server = new Server()
const service = new IPCService()
server.registerChannel('test', service)
service.registerCaller('test', async (msg) => {
  return msg
})
let window: BrowserWindow

app
  .whenReady()
  .then(() => {
    window = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      webPreferences: {
        preload: path.join(__dirname, 'common.service.cjs'),
      },
    })

    window.on('ready-to-show', () => window.show())

    window.loadFile('../index.html')
  })
  .catch(err => console.error(err))

app.on('will-quit', () => {
  server.dispose()
})
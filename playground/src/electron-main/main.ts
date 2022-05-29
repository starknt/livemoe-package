import path from 'path'
import assert from 'assert'
import { IPCService } from '@livemoe/ipc'
import { Server } from '@livemoe/ipc/MP'
import { BrowserWindow, app } from 'electron'
import { GetSysListViewPosition } from '@livemoe/tool'
import { InstantiationService, Module, Service, ServiceCollection, SyncDescriptor, createDecorator, optional } from '@livemoe/core'

export interface ITestService {
  hello: string
}

const ITestService = createDecorator<ITestService>('ITestService')

@Module()
class Main {
  constructor(@ITestService private readonly testService: ITestService) {
    assert.ok(testService)
    assert.equal(testService.hello, 'hello')
    console.log('创建Main...')
    console.log(this.testService, this)
  }
}
@Module()
class Test1 {
  constructor(@ITestService private readonly testService: ITestService) {
    assert.ok(testService)
    assert.equal(testService.hello, 'hello')
    console.log('创建Main...')
    console.log(this.testService, this)
  }
}

@Module()
class Test2 {
  constructor(@ITestService private readonly testService: ITestService) {
    assert.ok(testService)
    assert.equal(testService.hello, 'hello')
    console.log('创建Main...')
    console.log(this.testService, this)
  }
}
@Module()
class Test3 {
  constructor(@ITestService private readonly testService: ITestService) {
    assert.ok(testService)
    assert.equal(testService.hello, 'hello')
    console.log('创建Main...')
    console.log(this.testService, this)
  }
}
@Module()
class Test4 {
  constructor(@ITestService private readonly testService: ITestService) {
    assert.ok(testService)
    assert.equal(testService.hello, 'hello')
    console.log('创建Main...')
    console.log(this.testService, this)
  }
}
@Module()
class Test5 {
  constructor(@ITestService private readonly testService: ITestService) {
    assert.ok(testService)
    assert.equal(testService.hello, 'hello')
    console.log('创建Main...')
    console.log(this.testService, this)
  }
}
@Module()
class Test6 {
  constructor(@ITestService private readonly testService: ITestService) {
    assert.ok(testService)
    assert.equal(testService.hello, 'hello')
    console.log('创建Main...')
    console.log(this.testService, this)
  }
}
@Module()
class Test7 {
  constructor(@optional(ITestService) private readonly testService: ITestService) {
    assert.ok(testService)
    assert.equal(testService.hello, 'hello')
    console.log('创建Main...')
    console.log(this.testService, this)
  }
}

@Service(ITestService)
class TestService implements ITestService {
  hello = 'hello'
}

console.log(GetSysListViewPosition())

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
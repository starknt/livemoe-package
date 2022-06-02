import path from 'path'
import assert from 'assert'
import type { IPCService } from '@livemoe/ipc'
import { InjectedServer, InjectedService } from '@livemoe/ipc/main'
import { BrowserWindow, app } from 'electron'
import { GetSysListViewPosition } from '@livemoe/tool'
import { Injectable, Module, createDecorator, optional } from '@livemoe/core'
import type { IPCMainServer } from '@livemoe/ipc/src/main'
import { InitalizedServer } from '@livemoe/ipc/src/main'

export interface ITestService {
  hello: string
}

const ITestService = createDecorator<ITestService>('ITestService')

@Module()
class Main {
  @InjectedServer()
  private readonly server!: IPCMainServer

  @InjectedService('test')
  private readonly tService!: IPCService

  constructor(@ITestService private readonly testService: ITestService) {
    assert.ok(testService)
    assert.equal(testService.hello, 'hello')
    console.log('创建Main...')
    console.log(this.testService, this)
    console.log('tService', this.tService)

    this.tService.registerCaller('test', async (msg) => {
      return msg
    })

    console.log('server: ', this.server)
  }
}
// @Module()
// class Test1 {
//   constructor(@ITestService private readonly testService: ITestService) {
//     assert.ok(testService)
//     assert.equal(testService.hello, 'hello')
//     console.log('创建Main...')
//     console.log(this.testService, this)
//   }
// }

// @Module()
// class Test2 {
//   constructor(@ITestService private readonly testService: ITestService) {
//     assert.ok(testService)
//     assert.equal(testService.hello, 'hello')
//     console.log('创建Main...')
//     console.log(this.testService, this)
//   }
// }
// @Module()
// class Test3 {
//   constructor(@ITestService private readonly testService: ITestService) {
//     assert.ok(testService)
//     assert.equal(testService.hello, 'hello')
//     console.log('创建Main...')
//     console.log(this.testService, this)
//   }
// }

@Injectable(ITestService)
class TestService implements ITestService {
  hello = 'hello'
}

console.log(GetSysListViewPosition())

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
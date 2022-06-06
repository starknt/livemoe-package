import path from 'path'
import assert from 'assert'
import type { IPCService } from '@livemoe/ipc'
import { InjectedServer, InjectedService, MessageMainPortServer, connect } from '@livemoe/ipc/main'
import { BrowserWindow, app } from 'electron'
import { GetSysListViewPosition } from '@livemoe/tool'
import { Injectable, Module, createDecorator } from '@livemoe/core'
import type { IPCMainServer } from '@livemoe/ipc/main'
import { IdleValue } from '@livemoe/utils'

export interface ITestService {
  hello: string
}

const ITestService = createDecorator<ITestService>('ITestService')

@Module('testParams')
class Main {
  @InjectedServer()
  private readonly server!: IPCMainServer

  @InjectedService('test')
  private readonly tService!: IPCService

  constructor(staticParam: string, @ITestService private readonly testService: ITestService) {
    assert.ok(testService)
    assert.equal(testService.hello, 'hello')
    console.log('创建Main...')
    assert.ok(this.tService)
    assert.ok(staticParam)

    this.tService.registerCaller('test', async (msg) => {
      return msg
    })

    new IdleValue(async () => {
      const port = await connect(BrowserWindow.getAllWindows()[0])

      const messagePortServer = new MessageMainPortServer(port, 'main')

      const channel = messagePortServer.getChannel('test')
      channel.call('s')
      messagePortServer.registerChannel('test', this.tService)
    })

    setTimeout(() => {
      this.getService()
    }, 2000)
  }

  async getService() {
    const channel = await this.server.getChannel('preload', 'rtest')

    channel.call('rtest', 123).then(console.log).catch(console.error)
  }
}

@Injectable(ITestService, 'testParams')
class TestService implements ITestService {
  hello = 'hello'
  constructor(staticParams: string) {
    assert.ok(staticParams)
    console.log('testParams', staticParams)
  }
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
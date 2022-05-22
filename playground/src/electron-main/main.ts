import path from 'path'
import { IPCService } from '@livemoe/ipc'
import { Server } from '@livemoe/ipc/main'
import { BrowserWindow, app } from 'electron'
import { GetSysListViewPosition } from '@livemoe/tool'

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
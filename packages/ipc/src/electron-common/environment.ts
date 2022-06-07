if (!(typeof process === 'object' && typeof process.versions === 'object' && process.versions.electron))
  throw new TypeError('Cannot run in non-electron environments')

export const isRenderer = () => process.type === 'renderer'
export const isMain = () => process.type === 'browser'
export const isWorker = () => process.type === 'worker'
export const win = () => process.platform === 'win32'
export const osx = () => process.platform === 'darwin'
export const linux = () => process.platform === 'linux'
export const winStore = () => process.windowsStore
export const macStore = () => process.mas
export const macOS = () => osx()
const isEnvSet = 'NODE_ENV' in process.env
const getFromEnv = process.env.NODE_ENV !== 'production'

let isDev: boolean
if (isMain())
  isDev = isEnvSet ? getFromEnv : !require('electron').app.isPackaged
if (isRenderer())
  isDev = isEnvSet ? getFromEnv : false

export const dev = () => isDev
export const production = () => !isDev

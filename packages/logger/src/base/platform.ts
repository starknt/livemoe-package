let _IsWindow = false
let _IsMac = false
let _IsLinux = false
let _IsWeb = false
let _IsDev = false

export interface INodeProcess {
  versions: any
  platform: string
  arch: string
  type: string
  sandboxed: boolean
  env: any
}

export const enum Platform {
  Web,
  Mac,
  Linux,
  Windows,
}

declare const _global: any

let nodeProcess: INodeProcess

if (typeof process === 'object')
  nodeProcess = process
else nodeProcess = _global.process

const isElectronRenderer
  = typeof nodeProcess?.versions?.electron === 'string'
  && nodeProcess.type === 'renderer'
export const isElectronSandboxed = isElectronRenderer && nodeProcess?.sandboxed

export function PlatformToString(platform: Platform) {
  switch (platform) {
    case Platform.Web:
      return 'Web'
    case Platform.Mac:
      return 'Mac'
    case Platform.Linux:
      return 'Linux'
    case Platform.Windows:
      return 'Windows'
  }
}

// In NativeEnvironment
if (typeof process === 'object') {
  _IsWeb = false
  _IsWindow = process.platform === 'win32'
  _IsMac = process.platform === 'darwin'
  _IsLinux = process.platform === 'linux'

  const isEnvSet = 'NODE_ENV' in process.env
  const getFromEnv = process.env.NODE_ENV !== 'production'

  if (isElectronRenderer)
    _IsDev = isEnvSet ? getFromEnv : false
  else _IsDev = isEnvSet ? getFromEnv : !require('electron').app.isPackaged
}

// In Web Environment
if (typeof navigator !== 'undefined' && !isElectronRenderer) {
  _IsWeb = true
  _IsWindow = navigator.userAgent.includes('Windows')
  _IsMac = navigator.userAgent.includes('Macintosh')
  _IsLinux = navigator.userAgent.includes('Linux')
  _IsDev = !(nodeProcess?.env?.NODE_ENV !== 'production')
}

export const windows = () => _IsWindow
export const win = () => windows()
export const mac = () => _IsMac
export const macOS = () => mac()
export const linux = () => _IsLinux
export const isWeb = () => _IsWeb
export const isElectron = () => !_IsWeb
export const isSandbox = () => isElectronSandboxed
export const isRenderer = () => isElectronRenderer
export const isNode = () => !_IsWeb && !isElectronRenderer
export const isMain = () => !isElectronRenderer
export const isDev = () => _IsDev
export const dev = () => isDev()
export const isProduction = () => !_IsDev
export const production = () => isProduction()

export function PlatformString() {
  let platform = Platform.Web
  windows() && (platform = Platform.Windows)
  mac() && (platform = Platform.Mac)
  linux() && (platform = Platform.Linux)
  return PlatformToString(platform)
}

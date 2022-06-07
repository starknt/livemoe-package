export const enum RequestInitiator {
  LocalSide = 0,
  OtherSide = 1,
}

export interface IIPCLogger {
  logIncoming(msgLength: number, requestId: number, initiator: RequestInitiator, str: string, data?: any): void
  logOutgoing(msgLength: number, requestId: number, initiator: RequestInitiator, str: string, data?: any): void
}

const colorTables = [
  ['#2977B1', '#FC802D', '#34A13A', '#D3282F', '#9366BA'],
  ['#8B564C', '#E177C0', '#7F7F7F', '#BBBE3D', '#2EBECD'],
]

const colorMainTables = [
  ['\x1B[35m', '\x1B[93m', '\x1B[32m', '\x1B[32m', '\x1B[36m'],
  ['\x1B[92m', '\x1B[34m', '\x1B[90m', '\x1B[33m', '\x1B[94m'],
]

function prettyWithoutArrays(data: any): any {
  if (Array.isArray(data))
    return data

  if (data && typeof data === 'object' && typeof data.toString === 'function') {
    const result = data.toString()
    if (result !== '[object Object]')
      return result
  }
  return data
}

function pretty(data: any): any {
  if (Array.isArray(data))
    return data.map(prettyWithoutArrays)

  return prettyWithoutArrays(data)
}

export function logWithColors(direction: string, totalLength: number, msgLength: number, req: number, initiator: RequestInitiator, str: string, data: any): void {
  data = pretty(data)

  const ELECTRON_MAIN = typeof window !== 'object' && typeof require === 'function'

  const colorTable = ELECTRON_MAIN ? colorMainTables[initiator] : colorTables[initiator]
  const color = colorTable[req % colorTable.length]
  let args = ELECTRON_MAIN
    ? [`\x1B[32m[${direction}]\x1B[0m \x1B[90m[${String(totalLength).padStart(5, ' ')}]\x1B[0m \x1B[90m[len: ${String(msgLength).padStart(4, ' ')}]\x1B[0m ${color}${String(req).padStart(4, ' ')} - ${str}\x1B[0m`]
    : [`%c[${direction}]%c[${String(totalLength).padStart(5, ' ')}]%c[len: ${String(msgLength).padStart(4, ' ')}]%c${String(req).padStart(4, ' ')} - ${str}`, 'color: darkgreen', 'color: grey', 'color: grey', `color: ${color}`]
  if (/\($/.test(str)) {
    args = args.concat(data)
    args.push(')')
  }
  else {
    args.push(data)
  }
  console.log.apply(console, args as [string, ...string[]])
}

export class IPCLogger implements IIPCLogger {
  private _totalIncoming = 0
  private _totalOutgoing = 0

  constructor(
    private readonly _outgoingPrefix: string,
    private readonly _incomingPrefix: string,
  ) { }

  public logOutgoing(msgLength: number, requestId: number, initiator: RequestInitiator, str: string, data?: any): void {
    this._totalOutgoing += msgLength
    logWithColors(this._outgoingPrefix, this._totalOutgoing, msgLength, requestId, initiator, str, data)
  }

  public logIncoming(msgLength: number, requestId: number, initiator: RequestInitiator, str: string, data?: any): void {
    this._totalIncoming += msgLength
    logWithColors(this._incomingPrefix, this._totalIncoming, msgLength, requestId, initiator, str, data)
  }
}

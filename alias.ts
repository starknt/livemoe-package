import path from 'path'
import type { AliasOptions } from 'vite'

export const r = function (...paths: string[]) {
  return path.resolve(__dirname, ...paths)
}

export const alias: AliasOptions = {
  '@livemoe/core': r('./packages/core/src/index.ts'),
  '@livemoe/ipc': r('./packages/ipc/src/index.ts'),
  '@livemoe/utils': r('./packages/utils/src/index.ts'),
  '@livemoe/tool': r('./packages/tools/src/index.ts'),
}


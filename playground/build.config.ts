import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { input: './src/electron-preload/preload', name: 'common.service', format: 'cjs' },
    { input: './src/electron-web/main', name: 'window', format: 'esm' },
    { input: './src/electron-main/main', name: 'main', format: 'cjs' },
  ],
  clean: true,
  externals: ['electron'],
  rollup: {
    emitCJS: true,
  },
})

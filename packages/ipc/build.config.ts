import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    './src/index',
    './src/main',
    './src/renderer',
  ],
  clean: true,
  declaration: true,
  externals: ['electron'],
  rollup: {
    emitCJS: true,
  },
})

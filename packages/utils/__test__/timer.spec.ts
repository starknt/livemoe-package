import { setPauseTimeout } from '@livemoe/utils'
import { describe, expect, it } from 'vitest'

describe('timer 模块', () => {
  it('setPauseTimeout 0', async () => {
    let flag = false
    console.time('timer')
    await new Promise((resolve, reject) => {
      const timer = setPauseTimeout(() => {
        flag = true
        resolve('')
      }, 1000)

      setTimeout(() => {
        timer.pause()
      }, 200)

      setTimeout(() => {
        timer.restore()
      }, 400)
    })
    // 误差为 0.02 秒, 调用pause次数越多, 误差可能会越大
    console.timeEnd('timer')

    expect(flag).toBe(true)
  })
})
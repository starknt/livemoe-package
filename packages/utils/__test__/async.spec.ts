import { retry } from '@livemoe/utils'
import { describe, expect, it } from 'vitest'

function tRetry(num: number, delay: number, retries: number) {
  let c = 0
  return retry(() => {
    return new Promise<string>((resolve, reject) => {
      if (c < num) {
        c++
        reject(new Error('test error'))
      }

      resolve('success')
    })
  }, delay, retries)
}

describe('async 模块测试', () => {
  it('retry 0', async () => {
    expect(await tRetry(0, 100, 1)).toBe('success')
  })

  it('retry 1', async () => {
    await tRetry(2, 100, 1)
      .then((v) => {
        expect(v).toBe('success')
      })
      .catch((err: Error) => {
        expect(err.message).toBe('test error')
      })
  }, 1000)
})
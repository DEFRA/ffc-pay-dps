const retry = require('../../app/retry')

jest.mock('../../app/config', () => ({
  verifyConfig: {
    totalRetries: 3
  }
}))

describe('retry', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.useRealTimers()
  })

  test('executes successfully without retries', async () => {
    const mockFn = jest.fn().mockResolvedValue('success')
    const result = await retry(mockFn)
    expect(result).toBe('success')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  test('retries on failure and succeeds', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('success')

    const promise = retry(mockFn)
    await jest.advanceTimersByTimeAsync(2000)
    const result = await promise

    expect(result).toBe('success')
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  test('retries with exponential backoff', async () => {
    const mockFn = jest.fn()
      .mockRejectedValueOnce(new Error('fail1'))
      .mockRejectedValueOnce(new Error('fail2'))
      .mockResolvedValueOnce('success')

    const promise = retry(mockFn, 3, 2000, true)
    await jest.advanceTimersByTimeAsync(2000)
    await jest.advanceTimersByTimeAsync(4000)
    const result = await promise

    expect(result).toBe('success')
    expect(mockFn).toHaveBeenCalledTimes(3)
  })
})

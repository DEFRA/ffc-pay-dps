jest.useFakeTimers()
jest.spyOn(global, 'setTimeout')

const { processingConfig } = require('../../../app/config')

jest.mock('../../../app/polling/poll-inbound')
const pollInbound = require('../../../app/polling/poll-inbound')

const polling = require('../../../app/polling')

describe('start polling', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call pollInbound once', async () => {
    await polling.start()
    expect(pollInbound).toHaveBeenCalledTimes(1)
  })

  test('should not call pollInbound once in pollingActive is false', async () => {
    processingConfig.pollingActive = false
    await polling.start()
    expect(pollInbound).not.toHaveBeenCalled()
  })

  test('should call setTimeout once', async () => {
    await polling.start()
    expect(setTimeout).toHaveBeenCalledTimes(1)
  })

  test('should not throw when pollInbound throws', async () => {
    pollInbound.mockRejectedValue(new Error('Polling issue'))

    const wrapper = async () => {
      await polling.start()
    }

    expect(wrapper).not.toThrow()
  })

  test('should call setTimeout with processing.start and processingConfig.pollingInterval', async () => {
    await polling.start()
    expect(setTimeout).toHaveBeenCalledWith(polling.start, processingConfig.pollingInterval)
  })

  test('should call setTimeout when pollInterval throws', async () => {
    pollInbound.mockRejectedValue(new Error('Polling issue'))
    await polling.start()
    expect(setTimeout).toHaveBeenCalled()
  })
})

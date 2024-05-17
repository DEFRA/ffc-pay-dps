const mockPolling = {
  start: jest.fn()
}
jest.mock('../../app/polling', () => mockPolling)

const mockMessageService = {
  start: jest.fn(),
  stop: jest.fn()
}
jest.mock('../../app/messaging', () => mockMessageService)

const mockInsights = {
  setup: jest.fn()
}
jest.mock('../../app/insights', () => mockInsights)

jest.mock('log-timestamp')

describe('index.js', () => {
  let index
  const processExit = process.exit

  beforeEach(() => {
    jest.isolateModules(() => {
      index = require('../../app/index')
    })
    process.exit = jest.fn() // Mock process.exit
  })

  afterEach(() => {
    process.exit = processExit // Restore original process.exit
  })

  test('starts polling and message service when required', async () => {
    await index.start()
    expect(mockPolling.start).toHaveBeenCalled()
    expect(mockMessageService.start).toHaveBeenCalled()
  })

  test('stops message service when SIGTERM signal is received', async () => {
    await index.handleSignals()
    expect(mockMessageService.stop).toHaveBeenCalled()
    expect(process.exit).toHaveBeenCalledWith(0)
  })

  test('stops message service when SIGINT signal is received', async () => {
    await index.handleSignals()
    expect(mockMessageService.stop).toHaveBeenCalled()
    expect(process.exit).toHaveBeenCalledWith(0)
  })
})

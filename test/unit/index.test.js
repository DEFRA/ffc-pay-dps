const { processingConfig } = require('../../app/config')

jest.mock('../../app/polling')
const { start: mockStartPolling } = require('../../app/polling')
jest.mock('../../app/messaging')
const { start: mockStartMessaging } = require('../../app/messaging')

const startApp = require('../../app')

describe('app start', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('starts polling when processingActive is true', async () => {
    processingConfig.processingActive = true
    await startApp()
    expect(mockStartPolling).toHaveBeenCalledTimes(1)
  })

  test('does not start polling if processingActive is false', async () => {
    processingConfig.processingActive = false
    await startApp()
    expect(mockStartPolling).toHaveBeenCalledTimes(0)
  })

  test('starts messaging when processingActive is true', async () => {
    processingConfig.processingActive = true
    await startApp()
    expect(mockStartMessaging).toHaveBeenCalledTimes(1)
  })

  test('does not start messaging when processingActive is false', async () => {
    processingConfig.processingActive = false
    await startApp()
    expect(mockStartMessaging).toHaveBeenCalledTimes(0)
  })

  test('does not log console.info when processingActive is true', async () => {
    processingConfig.processingActive = true
    const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
    await startApp()
    expect(consoleInfoSpy).not.toHaveBeenCalled()
    consoleInfoSpy.mockRestore()
  })

  test('logs console.info when processingActive is false', async () => {
    processingConfig.processingActive = false
    const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
    await startApp()
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('Processing capabilities are currently not enabled in this environment')
    )
    consoleInfoSpy.mockRestore()
  })
})

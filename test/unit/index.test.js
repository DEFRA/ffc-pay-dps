const { processingConfig } = require('../../app/config')

jest.mock('../../app/polling')
const { start: mockStartPolling } = require('../../app/polling')

jest.mock('../../app/messaging')
const { start: mockStartMessaging } = require('../../app/messaging')

jest.mock('../../app/server')
const { start: mockStartServer } = require('../../app/server')

const startApp = require('../../app')

describe('app start', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe.each([
    [true, 1, 1, 1], // processingActive = true
    [false, 0, 0, 1] // processingActive = false
  ])(
    'when processingActive is %s',
    (processingActive, pollingCalls, messagingCalls, serverCalls) => {
      beforeEach(() => {
        processingConfig.processingActive = processingActive
      })

      test(`polling start should be called ${pollingCalls} time(s)`, async () => {
        await startApp()
        expect(mockStartPolling).toHaveBeenCalledTimes(pollingCalls)
      })

      test(`messaging start should be called ${messagingCalls} time(s)`, async () => {
        await startApp()
        expect(mockStartMessaging).toHaveBeenCalledTimes(messagingCalls)
      })

      test(`server start should be called ${serverCalls} time(s)`, async () => {
        await startApp()
        expect(mockStartServer).toHaveBeenCalledTimes(serverCalls)
      })

      test(`${processingActive ? 'does not log' : 'logs'} console.info correctly`, async () => {
        const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
        await startApp()
        if (processingActive) {
          expect(consoleInfoSpy).not.toHaveBeenCalled()
        } else {
          expect(consoleInfoSpy).toHaveBeenCalledWith(
            expect.stringContaining(
              'Processing capabilities are currently not enabled in this environment'
            )
          )
        }
        consoleInfoSpy.mockRestore()
      })
    }
  )
})

const mockStart = jest.fn()
const mockSetup = jest.fn(() => ({ start: mockStart }))
const mockDefaultClient = {
  context: {
    keys: {
      cloudRole: 'testCloudRole'
    },
    tags: {}
  }
}

jest.mock('applicationinsights', () => ({
  setup: mockSetup,
  defaultClient: mockDefaultClient
}))

describe('insights', () => {
  let insights
  const originalConsoleLog = console.log
  const originalEnv = process.env

  beforeEach(() => {
    console.log = jest.fn()
    process.env = { ...originalEnv }
    insights = require('../../app/insights')
  })

  afterEach(() => {
    jest.clearAllMocks()
    console.log = originalConsoleLog
    process.env = originalEnv
  })

  test('should setup and start appInsights when connection string exists', () => {
    process.env.APPINSIGHTS_CONNECTIONSTRING = 'test-connection-string'
    process.env.APPINSIGHTS_CLOUDROLE = 'test-cloud-role'
    insights.setup()

    expect(mockSetup).toHaveBeenCalledWith('test-connection-string')
    expect(mockStart).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith('App Insights running')
    expect(mockDefaultClient.context.tags.testCloudRole).toBe('test-cloud-role')
  })

  test('should not setup appInsights when connection string is missing', () => {
    delete process.env.APPINSIGHTS_CONNECTIONSTRING
    insights.setup()
    expect(mockSetup).not.toHaveBeenCalled()
    expect(mockStart).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith('App Insights not running')
  })
})

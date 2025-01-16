jest.mock('@azure/storage-blob')
jest.mock('@azure/identity')

describe('storage', () => {
  let storage
  const mockBlobClient = {
    upload: jest.fn().mockResolvedValue({}),
    downloadToBuffer: jest.fn().mockResolvedValue(Buffer.from('test-content')),
    delete: jest.fn().mockResolvedValue({}),
    beginCopyFromURL: jest.fn().mockResolvedValue({
      pollUntilDone: jest.fn().mockResolvedValue({ copyStatus: 'success' })
    }),
    url: 'test-url'
  }

  const mockDpsContainer = {
    createIfNotExists: jest.fn(),
    getBlockBlobClient: jest.fn().mockReturnValue(mockBlobClient),
    listBlobsFlat: jest.fn()
  }

  const mockDaxContainer = {
    createIfNotExists: jest.fn(),
    getBlockBlobClient: jest.fn().mockReturnValue(mockBlobClient),
    listBlobsFlat: jest.fn()
  }

  const mockStorageConfig = {
    useConnectionStr: true,
    connectionStr: 'connection-string',
    createContainers: true,
    dpsContainer: 'dps-container',
    daxContainer: 'dax-container',
    inboundFolder: 'inbound',
    outboundFolder: 'outbound',
    archiveFolder: 'archive',
    quarantineFolder: 'quarantine'
  }

  const mockBlobServiceClient = {
    getContainerClient: jest.fn(container =>
      container === mockStorageConfig.dpsContainer
        ? mockDpsContainer
        : mockDaxContainer
    )
  }

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()

    require('@azure/storage-blob').BlobServiceClient.fromConnectionString = jest
      .fn()
      .mockReturnValue(mockBlobServiceClient)

    jest.mock('../../app/config', () => ({
      storageConfig: mockStorageConfig
    }))

    storage = require('../../app/storage')
  })

  test('initializes containers on startup', async () => {
    await storage.getFile('test.csv', 'DPS')
    expect(mockDpsContainer.createIfNotExists).toHaveBeenCalled()
  })

  test('gets file from blob storage', async () => {
    const result = await storage.getFile('test.csv', 'DPS')
    expect(result.toString()).toBe('test-content')
  })

  test('archives file successfully', async () => {
    const result = await storage.archiveFile('test.csv', 'DPS')
    expect(result).toBe(true)
  })

  test('quarantines file successfully', async () => {
    const result = await storage.quarantineFile('test.csv', 'DPS')
    expect(result).toBe(true)
  })
})

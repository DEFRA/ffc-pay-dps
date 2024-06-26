const { getNewFileName } = require('../../../app/processing/get-new-filename')

const { DPS, DAX } = require('../../../app/constants/file-types')
const filename = require('../../mocks/filename')

describe('Get new file name', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should change the file name correctly if type is DAX', async () => {
    const response = await getNewFileName(filename.DAX, DAX)
    expect(response).toEqual(filename.newDAX)
  })

  test('should change the file name correctly is file type is DPS', async () => {
    const response = await getNewFileName(filename.DPS, DPS)
    expect(response).toEqual(filename.newDPS)
  })
})

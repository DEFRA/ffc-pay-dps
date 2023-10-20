const { transformLine } = require('./transform-line')

const readDPSFile = async (readBatchLines, fileType, input, filename) => {
  return new Promise((resolve, reject) => {
    const batchLines = []
    readBatchLines.on('line', (line) => {
      const batchLine = line.split(',')
      !readLine(batchLines, batchLine, fileType.fileTypeId, filename) &&
        reject(new Error('Invalid file - Unknown line'))
    })

    readBatchLines.on('close', () => {
      batchLines
        ? resolve({ paymentRequests: batchLines })
        : reject(new Error('Invalid file'))
      readBatchLines.close()
      input.destroy()
    })
  })
}

const readLine = (batchLines, batchLine, fileTypeId, filename) => {
  if (batchLine) {
    batchLines.push(transformLine(batchLine, fileTypeId, filename))
    return true
  } else {
    return false
  }
}

module.exports = {
  readDPSFile
}

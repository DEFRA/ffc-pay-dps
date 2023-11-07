const { transformLine } = require('./transform-line')

const readDAXFile = async (readBatchLines, input, filename) => {
  return new Promise((resolve, reject) => {
    const batchLines = []
    readBatchLines.on('line', (line) => {
      const batchLine = line.split(',')
      !readLine(batchLines, batchLine, filename) &&
        reject(new Error('Invalid file - Unknown line'))
    })

    readBatchLines.on('close', () => {
      batchLines
        ? resolve({ securityRequests: batchLines })
        : reject(new Error('Invalid file'))
      readBatchLines.close()
      input.destroy()
    })
  })
}

const readLine = (batchLines, batchLine, filename) => {
  if (batchLine) {
    batchLines.push(transformLine(batchLine, filename))
    return true
  } else {
    return false
  }
}

module.exports = {
  readDAXFile
}

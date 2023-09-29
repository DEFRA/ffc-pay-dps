require('./insights').setup()
const polling = require('./polling')

module.exports = (async () => polling.start())()

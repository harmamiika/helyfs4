const cors = require('cors')

const config = require('./utils/config')
const logger = require('./utils/logger')

const app = require('./app')


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// edited


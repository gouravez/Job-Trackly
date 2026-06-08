import 'dotenv/config'
import app from './app.js'
import { ENV } from './config/env.js'
import { testConnection } from './lib/db.js'

async function start() {
  await testConnection()

  app.listen(ENV.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${ENV.PORT}`)
    console.log(`   Environment : ${ENV.NODE_ENV}`)
    console.log(`   CORS origin : ${ENV.CLIENT_URL}`)
  })
}

start()
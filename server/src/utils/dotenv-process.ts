/**
 * dotenv 处理 .evn* 环境变量
 */
import fs from 'fs'
import dotenv from 'dotenv'

const NODE_ENV = process.env.NODE_ENV || 'development'

if (fs.existsSync('.env')) {
  dotenv.config({ path: '.env' })
}

if (fs.existsSync(`.env.${NODE_ENV}`)) {
  dotenv.config({ path: `.env.${NODE_ENV}` })
}

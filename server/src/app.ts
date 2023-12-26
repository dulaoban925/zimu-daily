import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import './utils/dotenv-process'
import { setRouters } from './routes'
import './db'

const app = express()

// 设置启动端口
app.set('port', process.env.PROT || 3000)

// body 解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// 设置路由
setRouters(app)

// 静态文件
app.use(express.static(path.join(__dirname, 'public')))

export default app

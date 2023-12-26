import { Sequelize } from 'sequelize'
import dbConfig from './config/db-config'

const sequelize = new Sequelize({
  database: dbConfig.database, // 数据库名
  username: dbConfig.username, // 用户名
  password: dbConfig.password, // 密码
  host: dbConfig.host, // 数据库地址
  port: dbConfig.port, // 数据库启用端口
  dialect: 'mysql', // 数据库类型
  logging: console.log, // 日志打印方式
  // model 定义相关
  define: {
    timestamps: true, // 是否启用时间戳，启用时会自动获取 createdAt 和 updateAt
    createdAt: 'created', // 字段映射 createdAt -> created 后面是实际 model 字段
    updatedAt: 'updated', // 字段映射 updatedAt -> updated 后面是实际 model 字段
  },
})

sequelize
  .authenticate() // 数据库连接验证
  .then(() => {
    console.log('MySQL client connected')
  })
  .catch((e) => {
    console.error('Unable to connect to MySQL', e)
  })

export default sequelize

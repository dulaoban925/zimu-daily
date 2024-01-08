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
    timestamps: true, // 是否启用时间戳，启用时会自动获取 createdAt 和 updatedAt
    underscored: true, // 是否启用下划线命名法，启用后 model 的所有字段都会自动有”小驼峰“转为“添加下划线” 形式
    paranoid: true, // 启用软删除，启用后 deletedAt 字段会自动添加到 model 定义
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

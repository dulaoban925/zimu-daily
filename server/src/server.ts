import app from './app'
import ip from 'ip'

const listenPort = app.get('port')

/**
 * 启动服务
 */
app.listen(listenPort, () => {
  console.log(
    `  App is running at http://${ip.address()}:${app.get('port')} in
    ${app.get('env')} mode`
  )
  console.log('  Press CTRL-C to stop\n')
})

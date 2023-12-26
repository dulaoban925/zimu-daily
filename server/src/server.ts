import app from './app'

const listenPort = app.get('port')

/**
 * 启动服务
 */
app.listen(listenPort, () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  )
})

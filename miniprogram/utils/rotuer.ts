/**
 * 路由跳转相关工具
 */
interface RouterOptions {
  url: string
  events?: any
  routeType?: string
  data?: any
  success?: () => void
  fail?: () => void
  complete?: () => void
}

export function navigateTo(options: RouterOptions) {
  return new Promise((resolve, reject) => {
    const success = (res: { eventChannel: WechatMiniprogram.EventChannel}) => {
      /**
       * 当前页向被打开页传递数据
       * 被打开页在 onLoad 钩子中通过以下代码获取：
       * const eventChannel = this.getOpenerEventChannel()
       * eventChannel.on('acceptDataFormOpenerPage', function (data) {
       *  console.log(data)
       * })
       */
      if (options.data) {
        res.eventChannel.emit('acceptDataFormOpenerPage', options.data)
      }
      return resolve(true)
    }

    const fail = (e: any) => {
      return reject(e)
    }

    wx.navigateTo(Object.assign({}, options, {
      success,
      fail
    }))
  })
}
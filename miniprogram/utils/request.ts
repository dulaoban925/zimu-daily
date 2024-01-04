/**
 * 请求工具类
 */
// 基础路径
const baseUrl = 'http://10.181.51.176:3000'

export default function request(options: WechatMiniprogram.RequestOption): Promise<{
  code: number
  data: any
  total?: number
  totalPages?: number
  page?: number
  pageSize?: number
  message?: string
}> {
  if (!/^https?:\/\//i.test(options.url)) {
    options.url = `${baseUrl}${options.url.startsWith('/') ? options.url : `/${options.url}` }`
  }

  return new Promise((resolve, reject) => {

    const success: WechatMiniprogram.RequestSuccessCallback = (res: any) => {
      console.log('success')
      if (options.success) options.success(res)
      // 后端错误，非 200 即为报错
      if (res.data.code !== 200) return reject(res.data)
      return resolve(res.data)
    }

    const fail: WechatMiniprogram.RequestFailCallback = (err) => {
      console.log('err')
      if (options.fail) options.fail(err)
      return reject(err)
    }

    wx.request({
      ...options,
      success,
      fail
    })
  })
}
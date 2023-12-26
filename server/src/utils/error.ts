export class ZiMuError extends Error {
  name: string
  code: number
  message: string

  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.message = message
    this.name = 'ZiMuError'
  }
}

// 请求参数错误
export const REQUEST_PARAMS_ERROR_CODE = 40000

// 无权限访问
export const NO_AUTH_ERROR_CODE = 40100

// 访问被禁止
export const FORBIDDEN_ERROR_CODE = 40300

// 系统错误
export const SYSTEM_ERROR_CODE = 50000

// 找不到数据
export const NOT_FOUND_ERROR_CODE = 40400

// 第三方服务错误
export const THIRD_PART_SERVICE_ERROR_CODE = 50010

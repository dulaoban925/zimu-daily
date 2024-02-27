import dayjs from "dayjs"
import { ACCOUNT_BOOK_ITEM_TYPE_DESC, ACCOUNT_BOOK_ITEM_IE_SOURCE_DESC } from "../../constants/account-book"
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
import { navigateTo } from "../../utils/rotuer"
import { deleteById, queryAccountBookById } from "./api"
import { AccountBookInfo } from "./types"
import { AccountBookItem } from "../account-book-item/types"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * 账本详情数据
     * 数据结构：
     * {
     *    {...header}, // 头信息
     *    items: [
     *       {
     *          year: '', // 所属年份
     *          month: '', // 所属月份
     *          detail: [
     *            {
     *              id: '',
     *              type: '', // 收入 or 支出
     *              source: '', // 收入来源 or 支出用途
     *              amount: '',
     *              comment: '',
     *              transactionTime: '', // 交易时间
     *              parentId: '' // 目前行明细仅属于一条头信息，后续添加「共享」功能后，需设计中间表
     *            }
     *          ] // 明细行
     *       }
     *    ]
     * }
     */
    info: {} as AccountBookInfo,
    // 收支类型对象
    ieTypes: ACCOUNT_BOOK_ITEM_TYPE_DESC,
    // 收支用途描述汇总
    ieSources: ACCOUNT_BOOK_ITEM_IE_SOURCE_DESC
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query: {
    id?: string
  }) {
    console.log('onLoad')
    // 编辑状态，会在 query 中传递 id，以获取详情数据
    if (query.id) {
      // 查询账本详情
      this.setData({
        'info.id': query.id
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('onShow')
    this.data.info.id && this.queryInfo(this.data.info.id)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.queryInfo(this.data.info.id!)
      .then(() => {
        wx.stopPullDownRefresh()
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 查询账本详情
  async queryInfo(id: string) {
    console.log(id)
    const data = await queryAccountBookById(id)
    this.setData({
      info: this._formatItemInfo(data)
    })
  },

  // 格式化明细数据，将明细数据按照交易月份分组
  _formatItemInfo(data: any) {
    const result = {
      ...data
    }
    const transactionMap = new Map()
    // 按照交易日期降序排列
    result.items.sort((pre: AccountBookItem, next: AccountBookItem) => dayjs(pre.transactionTime).isBefore(next.transactionTime) ? 1 : -1)

    for (let item of result.items) {
      const mapKey = dayjs(item.transactionTime).format('YYYY-MM')
      if (!transactionMap.has(mapKey)) {
        transactionMap.set(mapKey, [])
      }
      const existMapItems = transactionMap.get(mapKey)
      existMapItems.push(item)
    }

    result.items = [...transactionMap.entries()].map(([key, value]) => {
      const [year, month] = key.split('-')
      return {
        year,
        month,
        detail: value
      }
    })
    return result
  },

  // 新增按钮
  handleAddClick() {
    navigateTo({
      url: `/pages/account-book-item/account-book-item?parentId=${this.data.info.id}`
    })
  },

  // 编辑
  handleEditDetailItem(e: WechatMiniprogram.BaseEvent) {
    const id = e.currentTarget.dataset.id
    navigateTo({
      url: `/pages/account-book-item/account-book-item?id=${id}&curAbId=${this.data.info.id}`
    })
  },

  // 删除明细
  handleDeleteDetailItem(e: WechatMiniprogram.BaseEvent) {
    Dialog.confirm({
      title: '警告',
      message: '确认删除该明细？',
    })
      .then(() => {
        const id = e.currentTarget.dataset.id
        deleteById(id)
          .then(() => {
            Notify({ type: 'success', message: '删除成功' })
            this.queryInfo(this.data.info.id!)
          })
          .catch(e => {
            Notify(`删除失败:${e.message}`)
          })
      })
  }
})
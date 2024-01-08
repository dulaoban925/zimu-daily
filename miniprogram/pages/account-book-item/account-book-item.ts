import { ACCOUNT_BOOK_ITEM_TYPES, ACCOUNT_BOOK_ITEM_INCOME_SOURCE, ACCOUNT_BOOK_ITEM_EXPONSE_SOURCE, ACCOUNT_BOOK_ITEM_INCOME_SOURCE_DESC, ACCOUNT_BOOK_ITEM_EXPONSE_SOURCE_DESC, ACCOUNT_BOOK_ITEM_IE_SOURCE_ICON, PAGE_OPERATION } from '../../constants/data'
import { insert, queryById, updateById } from './api'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
import { AccountBookItem } from './types'
import dayjs from 'dayjs'

// type 和 source 默认选中映射
const DefaultTypeSourceMap = {
  [ACCOUNT_BOOK_ITEM_TYPES.INCOME]: ACCOUNT_BOOK_ITEM_INCOME_SOURCE.INCOME_SALARY,
  [ACCOUNT_BOOK_ITEM_TYPES.EXPENSE]: ACCOUNT_BOOK_ITEM_EXPONSE_SOURCE.EXPENSE_RENT
}

// 明细用途相关汇总
const IncomeSourceArray = Object.entries(ACCOUNT_BOOK_ITEM_INCOME_SOURCE_DESC).map(([key, label]) => ({
  key,
  label,
  icon: ACCOUNT_BOOK_ITEM_IE_SOURCE_ICON[key]
}))

const ExpenseSourceArray = Object.entries(ACCOUNT_BOOK_ITEM_EXPONSE_SOURCE_DESC).map(([key, label]) => ({
  key,
  label,
  icon: ACCOUNT_BOOK_ITEM_IE_SOURCE_ICON[key]
}))

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 明细信息对象
    itemInfo: {
      type: ACCOUNT_BOOK_ITEM_TYPES.INCOME,
      source: ACCOUNT_BOOK_ITEM_INCOME_SOURCE.INCOME_SALARY,
      transactionTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    },
    // 收支类型
    itemTypes: ACCOUNT_BOOK_ITEM_TYPES,
    // 收入来源
    incomeSouces: ACCOUNT_BOOK_ITEM_INCOME_SOURCE_DESC,
    // 支出用途
    expenseSouces: ACCOUNT_BOOK_ITEM_EXPONSE_SOURCE_DESC,
    // 收入来源数组
    incomeSourceArray: IncomeSourceArray,
    // 支出用途数组
    expenseSourceArray: ExpenseSourceArray,
    // 当前操作
    operation: PAGE_OPERATION.NEW // 默认新建
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query) {
    // 新建明细，传递 parentId
    if (query.parentId) {
      this.setData({
        'itemInfo.parentId': query.parentId,
      })
    }
    // 编辑/查看明细，传递 id
    if (query.id) {
      this.setData({
        operation: PAGE_OPERATION.EDIT
      })
      this.queryAccountBookInfoItem(query.id)
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

  // 查询明细
  queryAccountBookInfoItem(id: string) {
    queryById(id)
      .then((data) => {
        this.setData({
          itemInfo: data
        })
      })
      .catch(e => {
        Notify(`数据获取失败:${e.message}`)
      })
  },

  // 输入金额
  handleInput(e: WechatMiniprogram.CustomEvent) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    console.log(field, value)
    this.setData({
      [`itemInfo.${field}`]: value
    })
  },

  // 切换类型
  handleTypeClick(e: WechatMiniprogram.BaseEvent) {
    const type = e.currentTarget.dataset.type
    if (this.data.itemInfo.type === type) return
    this.setData({
      'itemInfo.type': type,
      'itemInfo.source': DefaultTypeSourceMap[type]
    })
  },

  // 切换交易用途
  handleSourceClick(e: WechatMiniprogram.BaseEvent) {
    const source = e.currentTarget.dataset.source
    if (this.data.itemInfo.source === source) return
    this.setData({
      'itemInfo.source': source
    })
  },

  // 确认添加
  handleConfirmClick() {
    const fn = this.data.operation === PAGE_OPERATION.NEW ? insert : updateById
    fn(this.data.itemInfo as AccountBookItem)
      .then((data) => {
        Notify({ type: 'success', message: '添加成功'})
        this.setData({
          itemInfo: data
        })
      })
      .catch(e => {
        Notify(`添加失败:${e.message}`)
      })
  }
})
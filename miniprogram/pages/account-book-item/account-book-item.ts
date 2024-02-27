import { ACCOUNT_BOOK_ITEM_TYPES } from '../../constants/account-book'
import { DefaultTypeSourceMap, IncomeSourceArray, ExpenseSourceArray, InitItemInfo} from './constants'
import { PAGE_OPERATION } from '../../constants/data'
import { insert, queryById, updateById } from './api'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
import { AccountBookItem } from './types'
import dayjs from 'dayjs'
import { queryList } from '../account-book/apis'
import { AccountBook } from '../account-book/types'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 明细信息对象
    itemInfo: {
      ...InitItemInfo
    } as AccountBookItem,
    // 当前详情所处账本id，可能为创建时的账本id（与 parentId 相同）或共享账本id（与 parentId 不同, 通过 curAbId 参数传入）
    currentAbId: '',
    // 收支类型
    ACCOUNT_BOOK_ITEM_TYPES,
    // 收入来源数组
    IncomeSourceArray,
    // 支出用途数组
    ExpenseSourceArray,
    // 当前操作
    operation: PAGE_OPERATION.NEW, // 默认新建
    // 交易时间选择弹出层显隐标识
    showTransactionTimePicker: false,
    // 共享账本选择弹出层显隐
    showShareSelector: false,
    // 分享的账本
    shareAbs: [],
    // 分享账本弹出层加载状态
    sharePopupLoading: false,
    // 分享账本弹出层字段映射
    sharePopupFieldMap: {
      title: 'name'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query: {
    parentId?: string
    id?: string,
    curAbId?: string
  }) {
    // 新建明细，传递 parentId
    if (query.parentId) {
      this.setData({
        'itemInfo.parentId': query.parentId,
        currentAbId: query.parentId
      })
    }
    // 编辑/查看明细，传递 id
    if (query.id) {
      this.setData({
        'itemInfo.id': query.id,
        currentAbId: query.curAbId,
        operation: PAGE_OPERATION.EDIT
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
    this.data.itemInfo.id && this.queryAccountBookInfoItem(this.data.itemInfo.id)
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
    console.log(this.data.itemInfo.source, source)
    if (this.data.itemInfo.source === source) return
    this.setData({
      'itemInfo.source': source
    })
  },

  // 点击选择交易时间按钮
  handleSelectTransactionTimeClick() {
    this.setData({
      showTransactionTimePicker: true
    })
  },

  // 关闭选择交易时间弹出层
  handleDatePickerPopupClose() {
    this.setData({
      showTransactionTimePicker: false
    })
  },

  // 选择交易时间弹出层确认
  handleDatePickerPopupConfirm(e: WechatMiniprogram.CustomEvent) {
    const value = dayjs(e.detail as unknown as number).format('YYYY-MM-DD HH:mm:ss')
    this.setData({
      showTransactionTimePicker: false,
      'itemInfo.transactionTime': value
    })
  },

  // 点击共享账本按钮
  handleShareClick() {
    this.setData({
      sharePopupLoading: true
    })
    // 查询账本
    queryList()
      .then((res) => {
        this.setData({
          shareAbs: res.filter((r: AccountBook) => r.id !== this.data.currentAbId),
          showShareSelector: true
        })
      })
      .finally(() => {
        this.setData({
          sharePopupLoading: false
        })
      })
  },

  // 关闭共享账本
  handleShareSelectorClose() {
    this.setData({
      showShareSelector: false
    })
  },

  // 确认共享账本
  handleShareSelectorConfirm(e: WechatMiniprogram.CustomEvent) {
    const value = e.detail
    console.log(value)
    this.setData({
      'itemInfo.relatedIds': value
    })
    this.handleShareSelectorClose()
  },

  // 再记一笔
  handleAddMoreTap() {
    this.setData({
      itemInfo: {
        parentId: this.data.itemInfo.parentId,
        relatedIds: [],
        ...InitItemInfo
      },
      operation: PAGE_OPERATION.NEW
    })
  },

  // 确认添加
  handleConfirmClick() {
    const fn = this.data.operation === PAGE_OPERATION.NEW ? insert : updateById
    fn(this.data.itemInfo)
      .then(() => {
        Notify({ type: 'success', message: '添加成功'})
        wx.navigateBack()
      })
      .catch(e => {
        Notify(`添加失败:${e.message}`)
      })
  }
})
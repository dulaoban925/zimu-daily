import dayjs from "dayjs";
import { PAGE_OPERATION, Y_N } from "../../constants/data";
import { REMINDER_PRIORITY_DESC } from "../../constants/reminder";
import Notify from "../../miniprogram_npm/@vant/weapp/notify/notify";
import { insert, queryById, updateById } from "./api";
import { queryList as queryReminderList } from '../reminder/api'
import { ReminderItem } from "./types";
import { Reminder } from "../reminder/types";

// pages/reminder-item/reminder-item.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reminderItem: {} as ReminderItem,
    REMINDER_PRIORITY_DESC,
    // 选择优先级
    showPriorityAction: false,
    // 优先级选项
    priorityActions: Object.entries(REMINDER_PRIORITY_DESC).map(([value, label]) => ({
      value,
      name: label
    })),
    // 选择提醒时间
    showRemindTimeAction: false,
    // 页面操作
    _operation: 'new',
    // 是否展示列表选择弹出层
    showListSelector: false,
    // 列表选择弹出层展示的代办列表
    reminderList: [] as Reminder[],
    // 列表选择加载标识
    listSelectorLoading: false,
    // 列表选择弹出层字段映射
    listSelectorFieldMap: {
      title: 'name'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query: {
    id?: string
    parentId?: string
  }) {
    if (query.parentId) {
      this.setData({
        'reminderItem.parentId': query.parentId,
        _operation: PAGE_OPERATION.NEW
      })
    }
    if (query.id) this.init(query.id)
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
  async onPullDownRefresh() {
    const id = this.data.reminderItem.id
    if (id) await this.init(id)
    wx.stopPullDownRefresh()
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

  // 初始化
  init(id: string) {
    queryById(id)
      .then(data => {
        // 设置时间戳字段
        if (data.remindTime) data.remindTimeStamp = new Date(data.remindTime).getTime()
        this.setData({
          reminderItem: data,
          _operation: PAGE_OPERATION.EDIT
        })
      })
  },

  // 输入确认
  handleInputConfirm(e: WechatMiniprogram.CustomEvent) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`reminderItem.${field}`]: value
    })
  },

  // 切换是否提醒
  handleRemindFlagChange(e: WechatMiniprogram.CustomEvent) {
    const checked = e.detail
    this.setData({
      [`reminderItem.remindFlag`]: checked ? Y_N.Y : Y_N.N,
      'reminderItem.remindTimeStamp': checked ? Date.now() : '',
      'reminderItem.remindTime': checked ? this.formatRemindTime() : null,
    })
  },

  // 点击提醒时间
  handleRemindTimeClick() {
    this.setData({
      showRemindTimeAction: true
    })
  },

  // 选择提醒时间
  handleRemindTimeConfirm(e: WechatMiniprogram.CustomEvent) {
    console.log(e, this.formatRemindTime(e.detail as unknown as number))
    const value = e.detail
    this.setData({
      'reminderItem.remindTimeStamp': value,
      'reminderItem.remindTime': this.formatRemindTime(value as unknown as number ),
      showRemindTimeAction: false
    })
  },

  // 取消选择提醒时间
  handleRemindTimeCancel() {
    this.setData({
      showRemindTimeAction: false
    })
  },

  // 格式化提醒时间显示格式
  formatRemindTime(value?: number | string) { 
    console.log('value', value)
    return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
  },

  // 点击优先级
  handlePriorityClick() {
    this.setData({
      showPriorityAction: true
    })
  },

  // 选择优先级
  handlePriorityActionSelect(e: WechatMiniprogram.CustomEvent) {
    const selected = e.detail
    this.setData({
      'reminderItem.priority': selected.value,
      showPriorityAction: false
    })
  },

  // 打开选择列表弹出层
  handleListSelectorClick() {
    this.setData({
      showListSelector: true,
      listSelectorLoading: true
    })
    queryReminderList()
      .then((data) => {
        this.setData({
          reminderList: [...data]
        })
      })
      .finally(() => {
        this.setData({
          listSelectorLoading: false
        })
      })
  },

  // 关闭选择列表弹出层
  handleListSelectorClose() {
    this.setData({
      showListSelector: false
    })
  },

  // 确认选择列表
  handleListSelectorConfirm(e: WechatMiniprogram.CustomEvent) {
    const selected = e.detail
    this.setData({
      'reminderItem.parentId': selected
    })
    this.handleListSelectorClose()
  },

  // 再记一项
  handleAddMoreClick() {
    this.setData({
      _operation: PAGE_OPERATION.NEW,
      reminderItem: {
        parentId: this.data.reminderItem.parentId
      }
    })
  },

  // 确认
  handleConfirmClick() {
    wx.showLoading({ title: '保存中...'})
    const fn = this.data._operation === PAGE_OPERATION.NEW ? insert : updateById
    fn(this.data.reminderItem)
      .then(() => {
        Notify({ type: 'success', message: '保存成功'})
        wx.navigateBack()
      })
      .catch(e => {
        Notify(`保存失败:${e.message}`)
      })
      .finally(() => {
        wx.hideLoading()
      })
  }
})
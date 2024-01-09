import { PAGE_OPERATION, Y_N } from "../../constants/data";
import Notify from "../../miniprogram_npm/@vant/weapp/notify/notify";
import { insert, queryById, updateById } from "./api";
import { ReminderItem } from "./types";

// pages/reminder-item/reminder-item.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reminderItem: {} as ReminderItem,
    // 页面操作
    _operation: 'new'
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

  // 初始化
  init(id: string) {
    wx.showLoading({ title: '加载中...' })
    queryById(id)
      .then(data => {
        this.setData({
          reminderItem: data,
          _operation: PAGE_OPERATION.NEW
        })
      })
      .finally(wx.hideLoading)
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
      [`reminderItem.remindFlag`]: checked ? Y_N.Y : Y_N.N
    })
  },

  // 再记一项
  handleAddMoreClick() {},

  // 确认
  handleConfirmClick() {
    wx.showLoading({ title: '保存中...'})
    const fn = this.data._operation === PAGE_OPERATION.NEW ? insert : updateById
    fn(this.data.reminderItem)
      .then((data) => {
        Notify({ type: 'success', message: '保存成功'})
        this.init(data.id)
      })
      .catch(e => {
        Notify(`保存失败:${e.message}`)
      })
      .finally(() => {
        wx.hideLoading()
      })
  }
})
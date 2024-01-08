import {REMINDER_CATEGORY_DESC} from '../../constants/data'
import { deleteById, queryByPage } from './api'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
import { Reminder } from '../reminder/types'
import { navigateTo } from '../../utils/rotuer'
import { ReminderItem } from './types'
import { queryById as queryReminderById } from '../reminder/api'

Page({
  options: {
    pureDataPattern: /^_/
  },

  /**
   * 页面的初始数据
   */
  data: {
    reminderHeader: {} as Reminder,
    reminderItems: [] as ReminderItem[],
    // 从分类统计跳转，
    fromCategory: '',
    // 下拉刷新触发
    refresherTriggered: false,
    // 列表初始化查询参数
    _initFilter: {
      byCategory: false,
      filter: ''
    },
    _page: 1, // 当前页
    _pageSize: 50 // 每页数据量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query: {
    id?: string
    from?: string
  }) {
    if (query.from) {
      this.setData({
        reminderTitle: REMINDER_CATEGORY_DESC[query.from]
      })
      this.setData({
        _initFilter: {
          byCategory: true,
          filter: query.from
        }
      })
      this.queryReminderInfo()
    }
    if (query.id) {
      this.setData({
        _initFilter: {
          byCategory: false,
          filter: query.id
        }
      })
      this.queryReminderInfo()
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

  // 查询提醒事项信息
  async queryReminderInfo(page?: number, pageSize?: number) {
    const { _page, _pageSize } = this.data
    page = page || _page
    pageSize = pageSize || _pageSize
    const {byCategory} = this.data._initFilter

    byCategory ?
      this.queryReminderInfoByCategory(page, pageSize)
      : this.queryReminderInfoById(page, pageSize)
  },

  async queryReminderInfoByCategory(page: number, pageSize: number) {
    const {filter} = this.data._initFilter

    const reminderHeader = {
      id: filter,
      name: REMINDER_CATEGORY_DESC[filter]
    }
    const data = await queryByPage(page, pageSize, {category: filter})

    this.setData({
      reminderHeader,
      reminderItems: data
    })
  },

  async queryReminderInfoById(page: number, pageSize: number) {
    const {filter: id} = this.data._initFilter
    const reminderHeader = await queryReminderById(id)
    const data = await queryByPage(page, pageSize, {parentId: id})

    this.setData({
      reminderHeader,
      reminderItems: data
    })
  },

  // 新增事项
  handleAddTap() {
    navigateTo({
      url: `/pages/reminder-item/reminder-item?parentId=${this.data.reminderHeader.id}`
    })
  },

  // 下拉刷新
  handleRefresherRefresh() {},

  // 触底
  handleScrollToLower() {},

  // 完成
  onFinishedChange(e: WechatMiniprogram.CustomEvent) {
    const reminderItemId = e.currentTarget.dataset.id
    const value = e.detail

    const index = this.data.reminderItems.findIndex(rdi => rdi.id === reminderItemId)
    this.setData({
      [`reminderItems[${index}].finished`]: value
    })
  },

  // 删除
  handleDelete(e: WechatMiniprogram.CustomEvent) {
    const id = e.currentTarget.dataset.id
    deleteById(id)
      .then(() => {
        Notify({ type: 'success', message: '删除成功' })
        this.queryReminderInfo()
      })
      .catch(e => {
        Notify(`删除失败:${e.message}`)
      })
  }
})
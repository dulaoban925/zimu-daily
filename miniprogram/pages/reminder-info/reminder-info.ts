import {REMINDER_CATEGORY_DESC, REMINDER_PRIORITY_MARK, REMINDER_PRIORITY_MARK_COLOR} from '../../constants/reminder'
import {Y_N} from '../../constants/data'
import { deleteById, queryByPage, updateById } from '../reminder-item/api'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
import { Reminder } from '../reminder/types'
import { navigateTo } from '../../utils/rotuer'
import { ReminderItem } from '../reminder-item/types'
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
    REMINDER_PRIORITY_MARK,
    REMINDER_PRIORITY_MARK_COLOR,
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
    category?: string
  }) {
    const isFromCategory = !!query.category

    this.setData({
      _initFilter: {
        byCategory: isFromCategory,
        filter: isFromCategory ? query.category! : query.id!
      }
    })
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
    this.queryReminderInfo()
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
    this.queryReminderHeader()
    this.queryReminderItems(page, pageSize)
  },

  async queryReminderHeader() {
    const { byCategory, filter} = this.data._initFilter

    let reminderHeader: Reminder = {}

    if (byCategory) {
      reminderHeader = {
        id: filter,
        name: REMINDER_CATEGORY_DESC[filter]
      }
    } else {
      reminderHeader = await queryReminderById(filter)
    }

    this.setData({
      reminderHeader,
    })
  },

  async queryReminderItems(page?: number, pageSize?: number) {
    const { _page, _pageSize,  _initFilter: {byCategory, filter} } = this.data
    page = page || _page
    pageSize = pageSize || _pageSize

    const params = byCategory ? 
      {
        category: filter
      } :
      {
        parentId: filter
      }
    const data = await queryByPage(page, pageSize, params)

    // 若是第一页，则直接赋值，否则拼接到原列表
    const reminderItems = page === 1 ? data : this.data.reminderItems.concat(data)
    // 仅 page === 1(重置页数) 或当前页数据量不为空时，更新当前页
    const needUpdPage = page === 1 || data.length > 0

    this.setData({
      _page: needUpdPage ? page : _page,
      reminderItems
    })
  },

  // 新增事项
  handleAddTap() {
    navigateTo({
      url: `/pages/reminder-item/reminder-item?parentId=${this.data.reminderHeader.id}`
    })
  },

  // 下拉刷新
  handleRefresherRefresh() {
    const {_page, _pageSize} = this.data
    this.queryReminderItems(_page, _pageSize)
      .finally(() => {
        this.setData({
          refresherTriggered: false
        })
      })
  },

  // 触底
  handleScrollToLower() {
    this.queryReminderItems(this.data._page + 1)
  },

  // 完成
  onFinishedChange(e: WechatMiniprogram.CustomEvent) {
    const reminderItemId = e.currentTarget.dataset.id
    const value = e.detail

    console.log('value', value)

    const index = this.data.reminderItems.findIndex(rdi => rdi.id === reminderItemId)
    this.setData({
      [`reminderItems[${index}].finished`]: value ? Y_N.Y : Y_N.N
    })
    updateById(this.data.reminderItems[index])
      .then((data) => {
        this.setData({
          [`reminderItems[${index}`]: data
        })
      })
      .catch(() => {
        Notify({type: 'danger', message: '出错啦...'})
      })
  },

  // 删除
  handleDelete(e: WechatMiniprogram.CustomEvent) {
    const id = e.currentTarget.dataset.id
    deleteById(id)
      .then(() => {
        Notify({ type: 'success', message: '删除成功' })
        const {_page, _pageSize} = this.data
        this.queryReminderItems(_page, _pageSize)
      })
      .catch(e => {
        Notify(`删除失败:${e.message}`)
      })
  }
})
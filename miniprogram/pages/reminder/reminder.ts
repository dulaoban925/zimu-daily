import { queryByPage, insert, deleteById, batchDelete } from "./api"
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import { querySummaryByCategory } from "./api"
import { navigateTo } from "../../utils/rotuer"

// 分页相关默认值
const defaultPage = 1
const defaultPageSize = 50

Page({
  options: {
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
  /**
   * 页面的初始数据
   */
  data: {
    summaries: {
      today: 0,
      plan: 0,
      all: 0
    },
    reminders: [],
    // 新增列表弹窗表示
    showAddListDialog: false,
    // 列表数据框默认名称，用于每次开启后重置显示
    initNewListName: '',
    // 列表触发刷新
    refresherTriggered: false,
    // 是否正在刷新，用于避免重复刷新
    _freshing: false,
    _page: defaultPage, // 当前页
    _pageSize: defaultPageSize, // 每页数据量
    // 列表是否处于可选择状态
    selectable: false,
    // 已选择的事项列表
    selectedReminders: [] as string[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    
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
    this.init()
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
  async init() {
    // 获取统计数据
    this.querySummaries()
    // 获取列表
    this.queryReminders()
  },

  async querySummaries() {
    const data = await querySummaryByCategory()
    this.setData({
      summaries: data
    })
  },

  async queryReminders(page?: number, pageSize?: number) {
    const { _page, _pageSize } = this.data
    page = page || _page
    pageSize = pageSize || _pageSize
    const data = await queryByPage(page, pageSize)
    const reminders = page === 1 ? data : this.data.reminders.concat(data)
    // 若最新列表数据小于原页数 * 页数据量，说明最新页没有获取到数据，不需要更新当前页
    const needIncPage = page === 1 || reminders.length > _page * _pageSize
    this.setData({
      _page: needIncPage ? page : _page,
      reminders
    })
  },

  // 点击新增列表按钮
  handleAddTap() {
    this.setData({
      showAddListDialog: true
    })
  },

  // 确认添加列表
  handleAddListConfirm(e: WechatMiniprogram.CustomEvent) {
    const value = e.detail.value
    insert({name: value})
      .then(async () => {
        Notify({type: 'success', message: '保存成功'})
        // 刷新列表
        await this.init()
        this.setData({
          showAddListDialog: false,
          initNewListName: ''
        })
      })
      .catch(e => {
        console.log(e, 'err')
        Notify(`保存失败：${e.message || e.errMsg || ''}`)
      })
  },

  // 列表下拉刷新
  handleRefresherRefresh() {
    if (this.data._freshing) return
    this.data._freshing = true
    this.queryReminders()
      .finally(() => {
        this.setData({
          refresherTriggered: false
        })
        this.data._freshing = false
      })
  },

  // 点击汇总块
  handleSummaryTap(e: WechatMiniprogram.CustomEvent) {
    const category = e.currentTarget.dataset.category
    navigateTo({
      url: `/pages/reminder-info/reminder-info?category=${category}`
    })
  },

  // 滚动触底
  handleScrollToLower() {
    const { reminders, _page, _pageSize } = this.data
    const nextPage = _page + 1
    this.queryReminders(nextPage)
      .then(() => {
        // 若最新列表数据小于原页数 * 页数据量，说明最新页没有获取到数据，不需要更新当前页
        console.log(reminders.length, _page * _pageSize)
        if (reminders.length <= _page * _pageSize) return
        this.setData({
          _page: nextPage
        })
      })
  },

  // 删除列表
  handleDelete(e: WechatMiniprogram.BaseEvent) {
    Dialog.confirm({
      title: '警告',
      message: '删除列表将同步删除列表中的代办事项，是否确认？',
    })
      .then(async () => {
        const id = e.currentTarget.dataset.id
        deleteById(id)
          .then(() => {
            Notify({ type: 'success', message: '删除成功' })
            this.queryReminders(this.data._page)
          })
          .catch((e: any) => {
            Notify(`删除失败：${e.message}`)
          })
      })
  },

  // 选择按钮点击
  handleSelectableClick() {
    this.setData({
      selectable: !this.data.selectable,
      selectedReminders: []
    })
  },

  // 切换事项 checkbox 勾选
  toggleItemCheckd(id: string) {
    const checkbox = this.selectComponent(`.checkbox-${id}`)
    checkbox.toggle()
  },

  // 选择事项变更
  handleItemCellClick(e: WechatMiniprogram.CustomEvent) {
    const id = e.currentTarget.dataset.id

    if (this.data.selectable) {
      this.toggleItemCheckd(id)
    } else {
      navigateTo({
        url: `/pages/reminder-info/reminder-info?id=${id}`
      })
    }
  },

  handleItemCheckboxChange(e: WechatMiniprogram.CustomEvent) {
    const id = e.currentTarget.dataset.id
    const selectedReminders = this.data.selectedReminders

    const index = selectedReminders.indexOf(id)

    if (index > -1) {
      selectedReminders.splice(index, 1)
    } else {
      selectedReminders.push(id)
    }

    this.setData({
      selectedReminders: selectedReminders
    })
  },

  // 批量删除处理函数
  batchDelHandler() {
    batchDelete(this.data.selectedReminders)
    .then(() => {
      Notify({ type: 'success', message: '删除成功' })
      this.init()
      this.setData({
        selectable: false,
        selectedReminders: []
      })
    })
    .catch((e: any) => {
      Notify(`删除失败：${e.message}`)
    })
  },

  // 批量删除
  handleBatchDelClick() {
    Dialog.confirm({
      title: '警告',
      message: '删除列表将同步删除列表中的代办事项，是否确认？',
    })
      .then(async () => {
        this.batchDelHandler()
      })
  }
})
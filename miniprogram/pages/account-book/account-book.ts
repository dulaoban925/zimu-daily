import { ACCOUNT_BOOK_TYPES } from "../../constants/data"
import { navigateTo } from "../../utils/rotuer"
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
import { AccountBook } from "./types"
import { deleteById, insert, queryByPage } from "./apis"

Page({
  options: {
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },

  /**
   * 页面的初始数据
   */
  data: {
    // 账本列表
    accountBooks: [] as AccountBook[],
    // 账本类型
    accountBookTypes: [
      {
        key: ACCOUNT_BOOK_TYPES.CUSTOM,
        label: '自定义',
        image: 'https://pic.52112.com/180406/180406_191/yWco75ssT5_small.jpg'
      }
    ],
    // 新建账本
    showAddTypes: false,
    // 新建账本-填写名称，在选择账本类型后触发
    showAbNameDialog: false,
    _newAbTemp: {} as AccountBook,
    _page: 1, // 当前页
    _pageSize: 10 // 每页数据量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.queryAccountBooks(1, 10)
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
    this.queryAccountBooks(this.data._page)
      .then(() => {
        wx.stopPullDownRefresh()
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    const {accountBooks, _page, _pageSize} = this.data
    if (accountBooks.length < _pageSize) return

    const nextPage = _page + 1
    this.queryAccountBooks(nextPage)
    this.setData({
      _page: nextPage
    })
  },

  // 查询账本列表
  queryAccountBooks: async function (page?: number, pageSize?: number) {
    const { _page, _pageSize } = this.data
    page = page || _page
    pageSize = pageSize || _pageSize
    const data = await queryByPage(page, pageSize)
    // 若是第一页，则直接赋值，否则拼接到原列表
    const accountBooks = page === 1 ? data : this.data.accountBooks.concat(data)
    // 若最新列表数据小于原页数 * 页数据量，说明最新页没有获取到数据，不需要更新当前页
    const needIncPage = page === 1 || accountBooks.length > _page * _pageSize
    this.setData({
      _page: needIncPage ? page : _page,
      accountBooks
    })
  },

  // 新增账本
  handleAddClick: function () {
    this.setData({
      showAddTypes: true
    })
  },

  // 点击新增按钮
  handleEditClick: function (e: WechatMiniprogram.BaseEvent) {
    const id = e.currentTarget.dataset.id
    // 跳转账本详情表单页面
    navigateTo({
      url: `/pages/account-book-info/account-book-info?id=${id}`
    })
  },

  // 选择账本类型
  handleAccountBookTypeTap: function (e: WechatMiniprogram.BaseEvent) {
    const abType = e.currentTarget.dataset.type
    const newItem = {
      name: abType.label,
      type: abType.key,
      image: abType.image, // 缩略图
    }
    this.setData({
      _newAbTemp: newItem,
      showAddTypes: false,
      showAbNameDialog: true
    })
  },

  // 填写账本名称
  handleAbNameConfirm: async function (e: WechatMiniprogram.CustomEvent) {
    const value = e.detail.value
    this.data._newAbTemp.name = value
    insert(this.data._newAbTemp)
      .then(async () => {
        Notify({type: 'success', message: '保存成功'})
        // 刷新列表
        await this.queryAccountBooks(this.data._page)

        this.setData({
          _newAbTemp: {}  as AccountBook,
          showAbNameDialog: false
        })
      })
      .catch(e => {
        Notify(`保存失败：${e.message}`)
      })
  },

  // 关闭新建账本类型
  handleActionSheetClose: function () {
    this.setData({
      showAddTypes: false
    })
  },

  // 删除
  handleDelete: function (e: WechatMiniprogram.BaseEvent) {
    Dialog.confirm({
      title: '警告',
      message: '确认删除该账本？',
    })
      .then(async () => {
        const id = e.currentTarget.dataset.id
        deleteById(id)
          .then(() => {
            Notify({ type: 'success', message: '删除成功' })
            this.queryAccountBooks(this.data._page)
          })
          .catch(e => {
            Notify(`删除失败：${e.message}`)
          })
      })
  }
})
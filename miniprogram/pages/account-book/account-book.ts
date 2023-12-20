import { ACCOUNT_BOOK_TYPES } from "../../constants/data"
import { navigateTo } from "../../utils/rotuer"
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'

interface AccountBook {
  id: string
  name: string
  type: string // 账本类别
  incomes: number
  expenses: number
  thumbnail: string
  created: string
  cratedBy: string
}

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
    _newAbTemp: {} as AccountBook
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  // 查询账本列表
  queryAccountBooks: function (page = 1, pageSize = 10) {
    console.log(page, pageSize)
    // this.setData({
    //   accountBooks: [{
    //     id: '1',
    //     name: '账本1', // 账本名称
    //     type: 'custom', // 账本类别
    //     incomes: 20000, // 收入
    //     expenses: 10000, // 支出
    //     thumbnail: 'https://pic.52112.com/180406/180406_191/yWco75ssT5_small.jpg', // 缩略图
    //     created: '2023-12-15', // 创建时间
    //     cratedBy: '李莹' // 创建人
    //   }, {
    //     id: '2',
    //     name: '账本2', // 账本名称
    //     type: 'custom', // 账本类别
    //     incomes: 30000, // 收入
    //     expenses: 20000, // 支出
    //     thumbnail: 'https://pic.52112.com/180406/180406_191/yWco75ssT5_small.jpg', // 缩略图
    //     created: '2023-12-15', // 创建时间
    //     cratedBy: '李莹' // 创建人
    //   }]
    // })
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
    const id = this.data.accountBooks.length === 0 ? '0' : (parseInt(this.data.accountBooks[this.data.accountBooks.length - 1].id) + 1).toString()
    const newItem = {
      id,
      name: abType.label,
      type: abType.key,
      incomes: 0, // 收入
      expenses: 0, // 支出
      thumbnail: abType.image, // 缩略图
      created: '2023-12-15', // 创建时间
      cratedBy: '李莹' // 创建人
    }
    this.setData({
      _newAbTemp: newItem,
      showAddTypes: false,
      showAbNameDialog: true
    })
  },

  // 填写账本名称
  handleAbNameConfirm: function (e: WechatMiniprogram.CustomEvent) {
    const value = e.detail.value
    this.data._newAbTemp.name = value
    this.data.accountBooks.unshift(this.data._newAbTemp)
    this.setData({
      accountBooks: this.data.accountBooks,
      _newAbTemp: {}  as AccountBook,
      showAbNameDialog: false
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
      .then(() => {
        const id = e.currentTarget.dataset.id
        const index = this.data.accountBooks.findIndex(ab => ab.id === id)
        if (index > -1) {
          this.data.accountBooks.splice(index, 1)
          this.setData({
            accountBooks: this.data.accountBooks
          })
        }
      })
  }
})
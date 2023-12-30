Page({
  data: {
    // 轮播图
    swiperList: [
      {src: 'http://192.168.93.105:3000/banner1.jpg'},
      {src: 'http://192.168.93.105:3000/banner2.jpg'},
    ],
    // 菜单
    menus: [
      {
        code: 'accountBook',
        text: '账本',
        icon: 'balance-list-o',
        url: '/pages/account-book/account-book'
      }
    ]
  }
})

Page({
  data: {
    // 轮播图
    swiperList: [
      {src: 'http://localhost:3000/banner1.jpg'},
      {src: 'http://localhost:3000/banner2.jpg'},
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

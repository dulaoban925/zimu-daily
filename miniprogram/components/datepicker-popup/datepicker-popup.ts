Component({
  properties: {
    /** 弹出层属性 start */
    // 是否展示
    show: Boolean,
    // 弹出层层级
    zIndex: {
      type: Number,
      value: 100
    },
    // 是否遮罩
    overlay: {
      type: Boolean,
      value: true
    },
    // 弹出位置
    position: {
      type: String,
      value: 'bottom'
    },
    // 是否圆角
    round: {
      type: Boolean,
      value: true
    },
    // 弹出层自定义样式
    popupCustomStyle: String,
    // 弹出层遮罩自定义样式
    popupOverlayStyle: String,
    // 是否在点击遮罩层后关闭
    closeOnClickOverlay: {
      type: Boolean,
      value: true
    },
    /** 弹出层属性 end */
    /** time picker 属性 start */
    // 当前选中值
    value: {
      type: [String, Number],
      value: new Date().getTime()
    },
    // 日期类型
    type: {
      type: String,
      value: 'datetime'
    }
    /** time picker 属性 end */
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    // 关闭弹出层
    onClose() {
      this.triggerEvent('close')
    },

    // 确认选择
    onConfirm(e: WechatMiniprogram.CustomEvent) {
      const value = e.detail
      console.log(value)
      this.triggerEvent('confirm', value)
    },

    // 取消选择
    onCancel() {
      this.onClose()
    }
  }
})
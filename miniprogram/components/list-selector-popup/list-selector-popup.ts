// 默认的字段映射
const INIT_FIELD_MAP = {
  // 左上方展示的内容
  title: 'title',
  // 右侧展示的内容
  value: 'value',
  // 左下方展示的内容
  label: 'label'
}

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
    /** 列表属性 start */
    // 列表数据
    data: {
      type: Array,
      value: []
    },
    // 是否多选
    multible: {
      type: Boolean,
      value: false
    },
    // 列表数据字段配置
    fieldMap: {
      type: Object,
      value: {}
    },
    selected: {
      type: Array,
      value: []
    }
    /** 列表属性 end */
  },
  data: {
    customFieldMap: INIT_FIELD_MAP,
    actualSelected: []
  },
  methods: {
    /**
     * 关闭弹出层
     */
    onClose() {
      this.triggerEvent('close')
    },
    /**
     * 确定
     */
    onConfirm() {
      const { multible, actualSelected } = this.data
      const confirmValue = multible ? actualSelected : actualSelected[0]

      this.triggerEvent('confirm', confirmValue)
    },

    /**
     * 行点击事件
     */
    onRowClick(e: WechatMiniprogram.BaseEvent) {
      const rowId = e.currentTarget.dataset.id
      const { multible, actualSelected } = this.data
      
      // 是否已经存在 id
      const existId = actualSelected.length > 0 && actualSelected.includes(rowId)

      if (multible && existId) {
        // 若为多选，且已存在，则删除
        const index = actualSelected.indexOf(rowId)
        actualSelected.splice(index, 1)
        this.setData({
          actualSelected: actualSelected
        })
      } else if (multible && !existId) {
        // 若为多选，且不存在，则新增
        actualSelected.push(rowId)
        this.setData({
          actualSelected: actualSelected
        })
      } else if (!multible && !existId) {
        // 若为单选，且不存在，则触发确定事件
        this.setData({
          actualSelected: [rowId]
        })
        this.onConfirm()
      }
    }
  },
  observers: {
    show: function (value: boolean) {
      if (!value) return
      const {customFieldMap, fieldMap, selected} = this.data
      // 合并 fieldMap
      this.setData({
        customFieldMap: Object.assign({}, customFieldMap, fieldMap),
        actualSelected: [...selected]
      })
      console.log(this.data)
    }
  }
})
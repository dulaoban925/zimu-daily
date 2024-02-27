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
    customFieldMap: INIT_FIELD_MAP
  },
  lifetimes: {
    attached() {
      console.log(this.data)
      const {customFieldMap, fieldMap} = this.data
      // 合并 fieldMap
      this.setData({
        customFieldMap: Object.assign(customFieldMap, fieldMap)
      })
    }
  },
  methods: {
    /**
     * 关闭弹出层
     */
    onClose() {
      // 关闭前重置选中的数据，以上层使用传入的 selected 为准
      this.setData({
        selected: []
      })
      console.log('onClose', this.data.selected)
      this.triggerEvent('close')
    },
    /**
     * 确定
     */
    onConfirm() {
      const { multible, selected } = this.data
      const confirmValue = multible ? selected : selected[0]

      this.triggerEvent('confirm', confirmValue)
    },

    /**
     * 行点击事件
     */
    onRowClick(e: WechatMiniprogram.BaseEvent) {
      const rowId = e.currentTarget.dataset.id
      const { multible, selected } = this.data
      
      // 是否已经存在 id
      const existId = selected.length > 0 && selected.includes(rowId)

      if (multible && existId) {
        // 若为多选，且已存在，则删除
        const index = selected.indexOf(rowId)
        selected.splice(index, 1)
        this.setData({
          selected: selected
        })
      } else if (multible && !existId) {
        // 若为多选，且不存在，则新增
        selected.push(rowId)
        this.setData({
          selected: selected
        })
      } else if (!multible && !existId) {
        // 若为单选，且不存在，则触发确定事件
        this.setData({
          selected: [rowId]
        })
        this.onConfirm()
      }
    }
  }
})
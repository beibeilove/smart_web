import T from 'ant-design-vue/es/table/Table'
import get from 'lodash.get'
export default {
  data() {
    return {
      needTotalList: [],

      selectedRows: [],
      selectedRowKeys: [],

      localLoading: false,
      localDataSource: [],
      localPagination: Object.assign({}, T.props.pagination)
    }
  },
  props: Object.assign({}, T.props, {
    rowKey: {
      type: [String, Function],
      default: 'id'
    },
    data: {
      type: Function,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    },
    alert: {
      type: Object,
      default: null
    },
    /** @Deprecated */
    showAlertInfo: {
      type: Boolean,
      default: false
    },
    showPagination: {
      default: 'auto'
    }
  }),
  watch: {
    'localPagination.current'(val) {
      this.$router.push({
        name: this.$route.name,
        params: Object.assign({}, this.$route.params, {
          pageNo: val
        }),
        query: this.$route.query
      })
    },
    pageNum(val) {
      Object.assign(this.localPagination, {
        current: val
      })
    },
    pageSize(val) {
      Object.assign(this.localPagination, {
        pageSize: val
      })
    },
    showSizeChanger(val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      })
    }
  },
  created() {
    this.localPagination = ['auto', true].includes(this.showPagination) && Object.assign({}, this.localPagination, {
      current: this.pageNum,
      pageSize: this.pageSize,
      showSizeChanger: this.showSizeChanger
    })
    this.needTotalList = this.initTotalList(this.columns)
    this.loadData()
  },
  methods: {
    refresh() {
      this.loadData()
    },
    loadData(pagination, filters, sorter) {

      this.localLoading = true
      var result = this.data(
        Object.assign({
            pageNo: (pagination && pagination.current) ||
              this.localPagination.current,
            pageSize: (pagination && pagination.pageSize) ||
              this.localPagination.pageSize
          },
          (sorter && sorter.field && {
            sortField: sorter.field
          }) || {},
          (sorter && sorter.order && {
            sortOrder: sorter.order
          }) || {}, {
            ...filters
          }
        )
      )

      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
      if (result instanceof Promise) {
        result.then(r => {
          this.localPagination = Object.assign({}, this.localPagination, {
            current: r.pageNo ? r.pageNo : 1,  // 返回结果中的当前分页数
            total: r.totalCount ? r.totalCount : 0, // 返回结果中的总记录数
            showSizeChanger: this.showSizeChanger,
            pageSize: (pagination && pagination.pageSize) ||
              this.localPagination.pageSize
          })

          // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
          if (r.data.length == 0 && this.localPagination.current != 1) {
            if (this.localPagination.current > 0) {
              this.localPagination.current--
            } else {
              this.localPagination.current = 0
            }
            this.loadData()
            return
          }

          // 这里用于判断接口是否有返回 r.totalCount 或 this.showPagination = false
          // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
          !r.totalCount && ['auto', false].includes(this.showPagination) && (this.localPagination = false)
          this.localDataSource = r.data // 返回结果中的数组数据
          this.localLoading = false
        })
      }
    },
    initTotalList(columns) {
      const totalList = []
      columns && columns instanceof Array && columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({ ...column,
            total: 0
          })
        }
      })
      return totalList
    },
    updateSelect(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      const list = this.needTotalList
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            const total = sum + get(val, item.dataIndex)
            return isNaN(total) ? 0 : total
          }, 0)
        }
      })
      // this.$emit('change', selectedRowKeys, selectedRows)
    },
    updateEdit() {
      this.selectedRows = []
    },
    onClearSelected() {
      this.selectedRowKeys = []
      this.updateSelect([], [])
    },
    renderMsg(h) {
      const _vm = this
      const d = []
      // 构建 已选择
      d.push(
        h('span', {
          style: {
            marginRight: '12px'
          }
        }, ['已选择 ', h('a', {
          style: {
            fontWeight: 600
          }
        }, this.selectedRows.length)])
      )

      // 构建 列统计
      this.needTotalList.map(item => {
        d.push(h('span', {
            style: {
              marginRight: '12px'
            }
          },
          [
            `${ item.title }总计 `,
            h('a', {
              style: {
                fontWeight: 600
              }
            }, `${ !item.customRender ? item.total : item.customRender(item.total) }`)
          ]))
      })

      // 构建 清空选择
      d.push(h('a', {
        style: {
          marginLeft: '24px'
        },
        on: {
          click: _vm.onClearSelected
        }
      }, '清空'))

      return d
    },
    renderAlert(h) {
      return h('span', {
        slot: 'message'
      }, this.renderMsg(h))
    },
  },

  render(h) {
    const _vm = this

    const props = {},
      localKeys = Object.keys(this.$data)

    Object.keys(T.props).forEach(k => {
      const localKey = `local${k.substring(0,1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        return props[k] = _vm[localKey]
      }
      return props[k] = _vm[k]
    })


    // 显示信息提示
    if (this.showAlertInfo) {

      props.rowSelection = {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          _vm.updateSelect(selectedRowKeys, selectedRows)
          _vm.$emit('onSelect', { selectedRowKeys: selectedRowKeys, selectedRows: selectedRows })
        }
      }

      return h('div', {}, [
        h('a-alert', {
          style: {
            marginBottom: '16px'
          },
          props: {
            type: 'info',
            showIcon: true
          }
        }, [_vm.renderAlert(h)]),
        h('a-table', {
          tag: 'component',
          attrs: props,
          on: {
            change: _vm.loadData
          },
          scopedSlots: this.$scopedSlots
        }, this.$slots.default)
      ])

    }

    return h('a-table', {
      tag: 'component',
      attrs: props,
      on: {
        change: _vm.loadData
      },
      scopedSlots: this.$scopedSlots
    }, this.$slots.default)

  }
}
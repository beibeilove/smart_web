<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="4S店名称">
              <a-select v-model="queryParam.uid" placeholder="请选择">
                <a-select-option :value="item.id" :key="item.id" v-for="item in dealerList">{{ item.dealer_name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <span class="table-page-search-submitButtons" :style="{ float: 'right', overflow: 'hidden' }">
              <a-button type="primary" @click="$refs.table.refresh()">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
        </template>
      </span>
    </s-table>

    <a-modal
      title="编辑设备"
      :width="800"
      v-model="addVisible"
      destroyOnClose
      @ok="handleOk"
    >
      <a-form :form="form">
        <a-form-item
          label="关联4S店"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-select v-model="addList.dealer_code" placeholder="请选择所属4S店" :rows="8" >
            <a-select-option :value="item.id" :key="item.id" v-for="item in dealerList">{{ item.dealer_name }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
  import STable from '@/components/table/'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import AInput from 'ant-design-vue/es/input/Input'
  import pick from 'lodash.pick'
  import { dateFormate } from '@/utils/util'

  import { getEquipmentList, updateEquipment, getDealerList } from '@/api/base'

  export default {
    name: 'TableList',
    components: {
      AInput,
      ATextarea,
      STable
    },
    data () {
      return {
        form: this.$form.createForm(this),
        addVisible: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        addList: {
          dealer_code: '',
          uid: ''
        },
        // 经销商列表
        dealerList: [],
        // 分页参数
        listQuery: {
          size: 10,
          start: 0
        },
        // 查询参数
        queryParam: {
          // uid: ''
        },
        // 表头
        columns: [
          {
            title: '设备编号',
            dataIndex: 'uid',
          },
          {
            title: '所属4s店',
            dataIndex: 'dealer_name'
          },
          {
            title: '更新时间',
            dataIndex: 'updated',
            customRender: function(text){
              return dateFormate(text, 'time')
            }
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: { customRender: 'action' },
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.listQuery.size = parameter.pageSize ? parameter.pageSize : 10
          this.listQuery.start = parameter.pageNo ? parameter.pageNo : 1
          return getEquipmentList(Object.assign({}, this.queryParam, this.listQuery))
            .then(res => {
              const obj = {
                data: res.retData,
                pageNo: parameter.pageNo,
                pageSize: parameter.pageSize,
                totalCount: parseInt(res.totalCount),
                totalPage: Math.ceil(parseInt(res.totalCount)/parameter.pageSize)
                // res.total ? res.total :
              }
              return obj
            })
        },
      }
    },
    mounted(){
      this.initData()
    },
    methods: {
      initData(){
        getDealerList({start: 0, size: 0}).then(res => {
          this.dealerList = res.retData
        })
      },
      handleEdit (record) {
        this.addVisible = true
        this.addList = record
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(Object.assign({}, record), 'uid', 'dealer_code'))
        })
      },
      handleOk (e) {
        e.preventDefault()
        const _this = this
        _this.form.validateFields((err, values) => {
          if (!err) {
            const obj = {
              uid: this.addList.uid,
              dealercode: this.addList.dealer_code
            }
            updateEquipment(Object.assign({},obj,values)).then(() => {
              _this.$message.success('设备信息更新成功', 3)
              _this.addVisible = false
              _this.form.resetFields()
              this.addList = []
              _this.$refs.table.refresh()
            })
          }
        })
      },
      resetSearchForm () {
        this.queryParam = {}
        this.$refs.table.refresh()
      }
    }
  }
</script>
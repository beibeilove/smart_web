<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="欢迎语">
              <a-input v-model="queryParam.greet" placeholder="请输入欢迎语"/>
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

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
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
          <a-divider type="vertical" />
        </template>
        <template>
          <a @click="handleDelete(record)">删除</a>
        </template>
      </span>
    </s-table>

    <a-modal
      :title="title"
      :width="800"
      v-model="addVisible"
      destroyOnClose
      @ok="handleOk"
    >
      <a-form :form="form">
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="欢迎语描述"
          hasFeedback
        >
          <a-textarea :value="addList.greeting" :rows="5" placeholder="请输入至少五个字符" v-decorator="[ 'greeting', { rules: [{ required: true, message: '请输入欢迎语描述' },{ min: 5, message: '请输入至少五个字符'}] } ]" />
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

  import { getGreetList, addGreet, deleteGreet, updateGreet } from '@/api/base'

  export default {
    name: 'TableList',
    components: {
      AInput,
      ATextarea,
      STable
    },
    data () {
      return {
        title: '',
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
          greeting: ''
        },
        // 分页参数
        listQuery: {
          size: 10,
          start: 1
        },
        // 查询参数
        queryParam: {
          greet: ''
        },
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: 'no',
            customRender: function(text, record, index){
              return index+1
            }
          },
          {
            title: '欢迎语',
            dataIndex: 'greeting'
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
          return getGreetList(Object.assign({}, this.queryParam, this.listQuery))
            .then(res => {
              const obj = {
                data: res.retData,
                pageNo: parameter.pageNo,
                pageSize: parameter.pageSize,
                totalCount: parseInt(res.totalCount),
                totalPage: Math.ceil(parseInt(res.totalCount)/parameter.pageSize)
              }
              return obj
            })
        },
      }
    },
    methods: {
      handleAdd() {
        this.title = '新增欢迎语'
        this.addVisible = true
      },
      handleEdit (record) {
        this.title = '编辑欢迎语'
        this.addVisible = true
        this.addList = record
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(Object.assign({}, record), 'greeting'))
        })
      },
      handleOk (e) {
        e.preventDefault()
        const _this = this
        _this.form.validateFields((err, values) => {
          if (!err) {
            if (this.addList.id) {
              const obj = {
                id: this.addList.id,
              }
              updateGreet(Object.assign({},obj,values)).then(() => {
                _this.$message.success('问候语更新成功', 3)
                _this.addVisible = false
                _this.form.resetFields()
                this.addList = []
                _this.$refs.table.refresh()
              })
            } else {
              addGreet(values).then(() => {
                _this.$message.success('问候语新增成功', 3)
                _this.addVisible = false
                _this.form.resetFields()
                this.addList = []
                _this.$refs.table.refresh()
              })
            }
          }
        })
      },
      handleDelete(record) {
        const _this = this
        this.$confirm({
          title: '提示',
          content: '确认删除吗？',
          onOk() {
            deleteGreet(record.id).then(() => {
              _this.$message.success('问候语删除成功', 3)
              _this.$refs.table.refresh()
            })
          },
          onCancel() {},
        })
      },
      resetSearchForm () {
        this.queryParam = {
          greet: ''
        }
        this.$refs.table.refresh()
      }
    }
  }
</script>
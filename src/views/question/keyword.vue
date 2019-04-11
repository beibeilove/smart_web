<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :lg="8" :md="12" :sm="24">
            <a-form-item label="关键字">
              <a-input v-model="queryParam.Keyword" placeholder="请输入关键字"/>
            </a-form-item>
          </a-col>
          <a-col :lg='4' :md="8" :sm="24">
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
      <span slot="actived" slot-scope="text, record">
        <template>
          <ul class="zz_status">
            <li class="enable" v-if="record.actived == 1"><i></i><span>启用</span></li>
            <li class="disabled" v-if="record.actived == 0 || !record.actived"><i></i><span>未启用</span></li>
          </ul>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
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
          label="关键字"
          hasFeedback
        >
          <a-input :value="addList.keyword" :rows="5" placeholder="请输入，最多15字" v-decorator="[ 'keyword', { rules: [{ required: true, message: '请输入关键字' },{ max: 15, message: '请输入，最多15字'}] } ]" />
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

  import { getKeywordList, addKeyword, deleteKeyword } from '@/api/base'

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
          Keyword: ''
        },
        // 分页参数
        listQuery: {
          size: 10,
          start: 1
        },
        // 查询参数
        queryParam: {
          keyword: ''
        },
        // 表头
        columns: [
          {
            title: '关键字',
            dataIndex: 'keyword'
          },
          {
            title: '状态',
            dataIndex: 'actived',
            width:'90px',
            scopedSlots: { customRender: 'actived' },
          },
          {
            title: '创建时间',
            dataIndex: 'created',
            width:'150px',
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
          return getKeywordList(Object.assign({}, this.queryParam, this.listQuery))
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
        this.title = '新增关键字'
        this.addVisible = true
      },
      handleEdit (record) {
        this.title = '编辑关键字'
        this.addVisible = true
        this.addList = record
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(Object.assign({}, record), 'Keyword'))
        })
      },
      handleOk (e) {
        e.preventDefault()
        const _this = this
        _this.form.validateFields((err, values) => {
          if (!err) {
            addKeyword(values).then(() => {
              _this.$message.success('关键字新增成功', 3)
              _this.addVisible = false
              _this.form.resetFields()
              this.addList = []
              _this.$refs.table.refresh()
            })
          }
        })
      },
      handleDelete(record) {
        const _this = this
        if (!record.actived) {
          this.$confirm({
            title: '删除关键字',
            content: '确认删除吗？',
            okText: '继续',
            onOk() {
              deleteKeyword(record.id).then(() => {
                _this.$message.success('关键字删除成功', 3)
                _this.$refs.table.refresh()
              })
            },
            onCancel() {
            },
          })
        } else {
          this.$error({
            title: '删除关键字',
            content: '已启用关键字无法删除',
          })
        }
      },
      resetSearchForm () {
        this.queryParam = {
          Keyword: ''
        }
        this.$refs.table.refresh()
      }
    }
  }
</script>

<style type="text/less">
  .zz_status{
    padding: 0;
    margin: 0;
  }
  .zz_status li{
    vertical-align: middle;
  }
  .zz_status li span{
    vertical-align: middle;
  }
  .zz_status .enable i{
    width: 8px;height: 8px;border-radius: 50%;background: #00A854;display: inline-block;vertical-align: middle;margin-right: 6px;
  }
  .zz_status .disabled i{
    width: 8px;height: 8px;border-radius: 50%;background: #F04134;display: inline-block;vertical-align: middle;margin-right: 6px;
  }
</style>
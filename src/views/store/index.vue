<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="4S店名称">
              <a-input v-model="queryParam.dealer" placeholder="请输入4S店名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="区域">
              <a-select v-model="queryParam.regionid" placeholder="请选择区域">
                <a-select-option :value="item.id" :key="item.id" v-for="item in areaList">{{ item.name }}</a-select-option>
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
          label="经销商名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input v-model="addList.dealer_name" placeholder="请输入，最多15个字" v-decorator="['dealer_name', { rules: [{ required: true, message: '请输入经销商名称' },{ max: 15, message: '请输入至多15个字符'}] }]"/>
        </a-form-item>
        <a-form-item
          label="经销商代码"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input v-model="addList.id" placeholder="请输入，最多15个字" v-decorator="['id', { rules: [{ required: true, message: '请输入经销商代码' },{ max: 15, message: '请输入至多15个字符'}] }]" :disabled="type"/>
        </a-form-item>
        <a-form-item
          label="负责人名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input v-model="addList.dealer" placeholder="请输入，最多15个字" v-decorator="['dealer', { rules: [{ required: true, message: '请输入负责人名称' },{ max: 15, message: '请输入至多15个字符'}] }]"/>
        </a-form-item>
        <a-form-item
          label="负责人手机号"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-input type="phone" v-model="addList.dealer_phone" placeholder="请输入，最多15个字" v-decorator="['dealer_phone', { rules: [{ required: true, message: '请输入负责人手机号' },{ max: 15, message: '请输入至多15个字符'}] }]"/>
        </a-form-item>
        <a-form-item
          label="所在区域"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          hasFeedback
        >
          <a-select v-model="addList.region_id" placeholder="请选择" v-decorator="['region_id', { rules: [{ required: true, message: '请选择所在区域' }] }]">
            <a-select-option :value="item.id" :key="item.id" v-for="item in areaList">{{ item.name }}</a-select-option>
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

  import { getDealerList, addDealer, deleteDealer, updateDealer, getAreaList } from '@/api/base'

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
        addList: {},
        // 区域列表
        areaList: [],
        // 分页参数
        listQuery: {
          size: 10,
          start: 1
        },
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '经销商名称',
            dataIndex: 'dealer_name'
          },
          {
            title: '负责人姓名',
            dataIndex: 'dealer'
          },
          {
            title: '负责人联系方式',
            dataIndex: 'dealer_phone'
          },
          {
            title: '所属区域',
            dataIndex: 'name'
          },
          {
            title: '关联设备数',
            dataIndex: 'num',
            customRender: function(text){
              return text ? text : 0
            }
          },
          {
            title: '新建/更新时间',
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
          return getDealerList(Object.assign({},parameter, this.queryParam, this.listQuery))
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
        type: false // 新增 false  编辑 true
      }
    },
    mounted(){
      this.initData()
    },
    methods: {
      initData(){
        getAreaList({start: 0, size: 0}).then(res => {
          this.areaList = res.retData
        })
      },
      handleAdd() {
        this.title = '新增经销商'
        this.addVisible = true
        this.type = false
      },
      handleEdit (record) {
        this.title = '编辑经销商'
        this.addVisible = true
        this.addList = record
        this.type = true
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(Object.assign({}, record), 'dealer', 'dealer_name', 'dealer_phone', 'region_id', 'id', ''))
        })
      },
      handleOk (e) {
        e.preventDefault()
        const _this = this
        _this.form.validateFields((err, values) => {
          if (!err) {
            if (this.type) {
              const obj = {
                id: this.addList.id,
              }
              updateDealer(Object.assign({},obj,values)).then(() => {
                _this.$message.success('4s店管理字段更新成功', 3)
                _this.addVisible = false
                _this.form.resetFields()
                this.addList = []
                _this.$refs.table.refresh()
              })
            } else {
              addDealer(values).then(() => {
                _this.$message.success('4s店管理字段新增成功', 3)
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
        if (record.num > 0) {
          this.$error({
            title: '提示',
            content: '该家经销商已经关联设备，无法删除'
          })
        } else {
          this.$confirm({
            title: '提示',
            content: '确认删除吗？',
            onOk() {
              deleteDealer(record.id).then(() => {
                _this.$message.success('4s店管理字段删除成功', 3)
                _this.$refs.table.refresh()
              })
            },
            onCancel() {
            },
          })
        }
      },
      resetSearchForm () {
        this.queryParam = {}
        this.$refs.table.refresh()
      }
    }
  }
</script>
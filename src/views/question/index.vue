<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :lg="7" :md="12" :sm="24">
            <a-form-item label="关键字">
              <a-input v-model="queryParam.Keyword" placeholder="请输入关键字"/>
            </a-form-item>
          </a-col>
          <a-col :lg="7" :md="12" :sm="24">
            <a-form-item label="问题描述">
              <a-input v-model="queryParam.question" placeholder="请输入问题描述"/>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24">
            <a-form-item label="状态">
              <a-select v-model="queryParam.action" placeholder="请选择状态">
                <a-select-option :value="item.id" :key="item.id" v-for="item in statusList">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="4" :md="8" :sm="24">
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
            <li class="disabled" v-if="record.actived == 0 || !record.actived"><i></i><span>禁用</span></li>
          </ul>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
        </template>
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-if="record.actived == 1">
              <a @click="handleDisabled(record, 1)">禁用</a>
            </a-menu-item>
            <a-menu-item v-if="record.actived == 0 || !record.actived">
              <a @click="handleDisabled(record, 0)">启用</a>
            </a-menu-item>
            <a-menu-item v-if="record.actived == 0 || !record.actived">
              <a @click="handleDelete(record)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>
  </a-card>
</template>

<script>
  import STable from '@/components/table/'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import AInput from 'ant-design-vue/es/input/Input'
  import { dateFormate } from '@/utils/util'

  import { getQuestionList, addQuestion, deleteQuestion, updateQuestion } from '@/api/base'

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
          Keyword: ''
        },
        statusList: [
          {
            id: 0,
            name: '禁用'
          },
          {
            id: 1,
            name: '启用'
          }
        ],
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
            title: '序列号',
            dataIndex: 'id',
            width: '90px',
            customRender: function(text, record, index){
              return index+1
            }
          },
          {
            title: '关键字',
            dataIndex: 'selectkeyname',
            customRender: function(text) {
              return text && text.indexOf(',') > -1 ? text.replace(/,/g, '、') : text
            }
          },
          {
            title: '问题描述',
            width: '150px',
            dataIndex: 'question'
          },
          {
            title: '更多关键字',
            dataIndex: 'nextkeyname',
            customRender: function(text) {
              return text && text.indexOf(',') > -1 ? text.replace(/,/g, '、') : text
            }
          },
          {
            title: '状态',
            dataIndex: 'actived',
            width: '90px',
            scopedSlots: { customRender: 'actived' },
          },
          {
            title: '修改时间',
            dataIndex: 'updated',
            width: '150px',
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
          return getQuestionList(Object.assign({}, this.queryParam, this.listQuery))
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
        this.$router.push({name: 'questionAdd'})
      },
      handleEdit (record) {
        this.$router.push({name: 'questionAdd', query: { id: record.id }})
        // this.addList = record
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
              updateQuestion(Object.assign({},obj,values)).then(() => {
                _this.$message.success('关键字更新成功', 3)
                _this.addVisible = false
                _this.form.resetFields()
                this.addList = []
                _this.$refs.table.refresh()
              })
            } else {
            addQuestion(values).then(() => {
              _this.$message.success('关键字新增成功', 3)
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
            deleteQuestion(record.id).then(() => {
              _this.$message.success('关键字删除成功', 3)
              _this.$refs.table.refresh()
            })
          },
          onCancel() {},
        })
      },
      resetSearchForm () {
        this.queryParam = {}
        this.$refs.table.refresh()
      },
      handleDisabled(record) {
        record.actived = !record.actived ? 1 : 0
        console.log(record)
        updateQuestion(record).then(res => {
          console.log(res)
        })
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
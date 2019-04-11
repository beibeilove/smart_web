<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="答案概述">
              <a-input v-model="queryParam.answer" placeholder="请输入答案概述"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="语音描述">
              <a-input v-model="queryParam.voicetext" placeholder="请输入语音描述"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="播放方式">
              <a-select v-model="queryParam.playtype" placeholder="请选择播放方式">
                <a-select-option :value="item.id" :key="item.id" v-for="item in playWayList">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态">
              <a-select v-model="queryParam.type" placeholder="请选择状态">
                <a-select-option :value="item.id" :key="item.id" v-for="item in statusList">{{ item.name }}</a-select-option>
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
      <span slot="actived" slot-scope="text, record">
        <template>
          <ul class="zz_status">
            <li class="enable" v-if="record.actived"><i></i><span>被引用</span></li>
            <li class="warning" v-if="record.actived === 0 || !record.actived"><i></i><span>未引用</span></li>
          </ul>
        </template>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record)">删除</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
  import STable from '@/components/table/'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import AInput from 'ant-design-vue/es/input/Input'
  import { dateFormate } from '@/utils/util'

  import { getAnswerList, deleteAnswer } from '@/api/base'

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
            name: '未引用'
          },
          {
            id: 1,
            name: '被引用'
          }
        ],
        playWayList: [
          {
            id: 1,
            name: 'h5播放'
          },
          {
            id: 0,
            name: '图片'
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
            title: '答案概述',
            dataIndex: 'answer',
            width: '150px'
          },
          {
            title: '语音描述',
            dataIndex: 'voicetext'
          },
          {
            title: '播放方式',
            dataIndex: 'playtype',
            width: '100px',
            customRender: function(text) {
              if (!text || text === 0) {
                return '图片播放'
              } else if (text === 1) {
                return 'h5播放'
              }
            }
          },
          {
            title: '状态',
            dataIndex: 'actived',
            width: '90px',
            scopedSlots: { customRender: 'actived' },
          },
          {
            title: '创建时间',
            width: '150px',
            dataIndex: 'created',
            customRender: function(text){
              return dateFormate(text, 'time')
            }
          },
          {
            title: '修改时间',
            width: '150px',
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
          return getAnswerList(Object.assign({}, this.queryParam, this.listQuery))
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
        this.$router.push({name: 'answerAdd'})
      },
      handleEdit (record) {
        this.$router.push({name: 'answerAdd', query: { id: record.id }})
      },
      handleDelete(record) {
        const _this = this
        if (!record.actived || record.actived === 0) {
          this.$confirm({
            title: '删除答案',
            content: '确认要删除该答案吗？',
            okText: '继续',
            onOk() {
              deleteAnswer(record.id).then(() => {
                _this.$message.success('答案删除成功', 3)
                _this.$refs.table.refresh()
              })
            },
            onCancel() {
            },
          })
        } else {
          this.$error({
            title: '删除答案',
            content: '该答案正在被引用，不能直接删除，请先解绑。',
            onOk() {

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
  .zz_status i{
    width: 8px;height: 8px;border-radius: 50%;display: inline-block;vertical-align: middle;margin-right: 6px;
  }
  .zz_status .enable i{
    background: #52C41A;
  }
  .zz_status .warning i{
   background: #FAAD14;
  }
</style>
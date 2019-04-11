<template>
  <div>
    <a-form @submit="handleSubmit" :form="form">
      <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
        <a-row>
          <a-col :md="16" :sm="20">
            <a-form-item
              label="问题"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-input
                :value="addList.question"
                v-decorator="['question',{rules: [{ required: true, message: '给目标起个名字' }]}]"
                name="question"
                placeholder="给目标起个名字" />
            </a-form-item>
            <a-form-item
              label="关键字"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-select
                showSearch
                mode="multiple"
                :default-value="addList.selectkeys"
                v-decorator="['selectkeys',{rules: [{ required: true, message: '请选择关键字' }]}]"
                :value="addList.selectkeys"
                name="selectkeys"
                optionFilterProp="children"
                :filterOption="filterOption"
                style="width: 100%"
                @change="handleChange"
                placeholder="请选择关键字">
                <a-select-option v-for="item in keywordList" :key="item.id" :value="item.id">{{ item.keyword }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="更多关键字"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-select
                showSearch
                mode="multiple"
                :default-value="addList.nextkeys"
                :value="addList.nextkeys"
                v-decorator="['nextkeys']"
                name="nextkeys"
                optionFilterProp="children"
                :filterOption="filterOption"
                style="width: 100%"
                @change="handleChangeMore"
                placeholder="请选择关键字">
                <a-select-option v-for="item in keywordList" :key="item.id" :value="item.id">{{ item.keyword }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-card>
      <div style="height: 40px;"></div>
      <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
        <h3 style="font-weight: bold;">关联答案</h3>
        <a-divider />
        <a-row>
          <a-col :md="16" :sm="20">
            <a-form-item
              label="答案搜索"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-input
                v-model="queryParam.answer"
                name="answer"
                style="width: 80%; margin-right: 2%;"
                placeholder="请输入答案概述" />
              <a-button type="primary" @click="searchAnswer">搜索</a-button>
            </a-form-item>
          </a-col>
        </a-row>
        <a-list itemLayout="horizontal" :dataSource="data" style="margin-left:5%;margin-right: 8%;">
          <a-list-item slot="renderItem" slot-scope="item, index">
            <a-list-item-meta :description="item.answer">
              <a-avatar slot="avatar" :src="deletePic" style="width: 20px;height: 20px;cursor: pointer;" @click="deleteAnswer(item.id)"/>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
        <a-button type="primary" htmlType="submit" style="margin-left:4%;margin-top: 20px;">保存</a-button>
      </a-card>
    </a-form>
    <a-modal
      :title="title"
      :width="800"
      v-model="addVisible"
      destroyOnClose
      @ok="handleOk"
    >
      <s-table
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      >
      </s-table>
    </a-modal>
  </div>
</template>

<script>
  import { dateFormate } from '@/utils/util'
  import STable from '@/components/table/'
  import pick from 'lodash.pick'
  import deletePic from '@/assets/delete.png'
  import { addQuestion, updateQuestion, boundAnswer, getKeywordList, getAnswerList, getQuestionDetail } from '@/api/base'
  export default {
    name: 'BaseForm',
    data () {
      return {
        title: '关联答案',
        addVisible: false,
        deletePic: deletePic,
        columns: [
          {
            title: '答案概述',
            width: '150px',
            dataIndex: 'answer'
          },
          {
            title: '语音描述',
            dataIndex: 'voicetext',
          },
          {
            title: '创建时间',
            dataIndex: 'created',
            width: '150px',
            customRender: function(text){
              return dateFormate(text, 'time')
            }
          },
          {
            title: '修改时间',
            dataIndex: 'updated',
            width: '150px',
            customRender: function(text){
              return dateFormate(text, 'time')
            }
          }
        ],
        // 分页参数
        listQuery: {
          size: 10,
          start: 0
        },
        // 查询参数
        queryParam: {},
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.listQuery.size = parameter.pageSize ? parameter.pageSize : 10
          this.listQuery.start = parameter.pageNo ? parameter.pageNo : 1
          return getAnswerList(Object.assign({}, this.queryParam, this.listQuery))
            .then(res => {
              const obj = {
                data: res.retData ? res.retData : [],
                pageNo: parameter.pageNo,
                pageSize: parameter.pageSize,
                totalCount: parseInt(res.totalCount),
                totalPage: Math.ceil(parseInt(res.totalCount)/parameter.pageSize)
              }
              return obj
            })
        },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        // form
        form: this.$form.createForm(this),
        keywordList: [],
        addList: {
          question: '123'
        },
        selectedRowKeys: [],
        selectedRows: [],
        data: []
      }
    },
    components: {
      STable
    },
    mounted() {
      this.getKeyword()
      if (this.$route.query.id) {
        this.initData()
      }
    },
    methods: {
      initData() {
        getQuestionDetail(this.$route.query.id).then(res => {
          if (res.retData) {
            const selectkeys = (res.retData[0].selectkey && res.retData[0].selectkey.indexOf(',')) ? this.stringToNumber(res.retData[0].selectkey.split(',')) : parseInt(res.retData[0].selectkey)
            const nextkey = res.retData[0].nextkey ? res.retData[0].nextkey : []
            var nextkeys = ''
            if (nextkey && nextkey.indexOf(',') > -1) {
              nextkeys = this.stringToNumber(nextkey.split(','))
            } else if (!nextkey) {
              nextkeys = parseInt(nextkey)
            } else if (nextkey.indexOf(',') <= -1) {
              nextkeys = []
            }
            this.$nextTick(() => {
              this.form.setFieldsValue(pick(Object.assign({},{
                selectkeys: selectkeys,
                nextkeys: nextkeys
              }, res.retData[0]), 'question', 'selectkeys', 'nextkeys', 'id', 'actived'))
            })
            this.addList = res.retData[0]
            // if (this.addList.nextkeys === undefined) {
            //   this.addList.nextkeys = []
            // }
            // this.addList.nextKeys = nextkeys

            // 问题答案列表
            if (res.retData[0].answerid) {
              const answerList = (res.retData[0].answerid && res.retData[0].answerid.indexOf(',')) ? res.retData[0].answerid.split(',') : res.retData[0].answerid
              this.selectedRowKeys = this.stringToNumber(answerList)
              getAnswerList(Object.assign({},{ size: 0, start: 0 })).then(res => {
                answerList.map(item => {
                  res.retData.map(item1 => {
                    if (item == item1.id) {
                      this.data.push(item1)
                    }
                  })
                })
              })
            }
            this.$forceUpdate()
          }
        })
      },
      stringToNumber(data) {
        var arr = []
        if (data) {
          data.map((item) => {
            arr.push(parseInt(item))
          })
        }
        return arr
      },
      getKeyword() {
        const query = {
          size: 0,
          start: 0,
          keyword: ''
        }
        getKeywordList(query).then(res => {
          this.keywordList = res.retData
        })
      },
      searchAnswer() {
        this.addVisible = true
      },
      deleteAnswer(id) {
        console.log(id)
        var arr = []
        var arrId = []
        this.data.map(item => {
          if (item.id !== id) {
            arr.push(item)
            arrId.push(item.id)
          }
        })
        this.data = arr
        this.selectedRows = arr
        this.selectedRowKeys = arrId
        console.log(arr, arrId)
      },
      handleChange (value) {
        console.log(value)
      },
      handleChangeMore (value) {
        console.log(value, this.addList.selectkey)
      },
      filterOption(input, option) {
        console.log(input, option)
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      },
      handleSubmit (e) {
        e.preventDefault()
        this.form.validateFields((err, values) => {
          if (!err) {
            if (this.$route.query.id) {
              updateQuestion(Object.assign({},{ selectkey: values.selectkeys.toString(), nextkey: values.nextkeys ? values.nextkeys.toString() : '', id: this.$route.query.id, actived: this.addList.actived },values)).then(res => {
                this.$router.push({ path: '/question/index' })
                this.boundAnswerInface({id: this.addList.id, answerid: this.selectedRowKeys.toString()})
                console.log(res, 'update')
              })
            } else {
              addQuestion(Object.assign({},{ selectkey: values.selectkeys.toString(), nextkey: values.nextkeys ? values.nextkeys.toString() : '', actived: this.addList.actived },values)).then(res => {
                this.$router.push({ path: '/question/index' })
                this.boundAnswerInface({id: res.retData, answerid: this.selectedRowKeys.toString()})
                console.log(res, 'add')
              })
            }
            // eslint-disable-next-line no-console
            console.log('Received values of form: ', values)
          }
        })
      },
      boundAnswerInface(obj) {
        boundAnswer(obj).then(res => {
          console.log(res)
        })
      },
      onSelectChange(selectedRowKeys, selectedRows)   {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
        console.log(selectedRowKeys, selectedRows)
      },
      handleOk() {
        var arr = []
        getAnswerList(Object.assign({},{ size: 0, start: 0 })).then(res => {
          this.selectedRowKeys.map(item => {
            res.retData.map(item1 => {
              if (item == item1.id) {
                arr.push(item1)
              }
            })
          })
        })
        this.data = arr
        this.addVisible = false
      }
    }
  }
</script>
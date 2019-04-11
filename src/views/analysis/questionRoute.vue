<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :lg="7" :md="12" :sm="24">
            <a-form-item label="所属区域">
              <a-select v-model="queryParam.regionid" placeholder="请选择区域">
                <a-select-option :value="item.id" :key="item.id" v-for="item in areaList">{{ item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :lg="9" :md="12" :sm="24">
            <a-form-item label="起止时间">
              <a-range-picker
                v-model="dateRange"
                :format="dateFormat"
                :disabledDate="disabledDate"
                @change="dateRangeSelected">
              </a-range-picker>
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
      <a-button type="primary" icon="plus" @click="handleAdd" :loading="downloadLoading">导出Excel</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
    >
    </s-table>
  </a-card>
</template>

<script>
  import STable from '@/components/table/'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import AInput from 'ant-design-vue/es/input/Input'
  import { dateFormate } from '@/utils/util'
  import moment from 'moment'

  import { getAnswerRouteList, getAreaList } from '@/api/base'

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
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
        // 分页参数
        listQuery: {
          size: 10,
          start: 0
        },
        // 查询参数
        queryParam: {
          startdate: dateFormate(new Date(new Date().getTime()-30*1000*3600*24), 'date', '/'),
          enddate: dateFormate(new Date(), 'date', '/')
        },
        // 表头
        columns: [
          {
            title: '排名',
            dataIndex: 'id',
            width:'90px',
            customRender: function(text, record, index){
              return index+1
            }
          },
          {
            title: '路线',
            dataIndex: 'firest',
            customRender: function(text){
              return text.indexOf(',') ? text.replace(/,/g,' - ') : text
            }
          },
          {
            title: '数量',
            width:'90px',
            dataIndex: 'count'
          }
        ],
        loadDataArr:[],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.listQuery.size = parameter.pageSize ? parameter.pageSize : 10
          this.listQuery.start = parameter.pageNo ? parameter.pageNo : 1
          return getAnswerRouteList(Object.assign({}, this.queryParam, this.listQuery))
            .then(res => {
              this.loadDataArr = res.retData
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
        // 时间插件
        dateFormat: 'YYYY/MM/DD',
        areaList: [],
        dateRange: [moment(dateFormate(new Date(new Date().getTime()-30*1000*3600*24), 'date', '/'), this.dateFormat), moment(dateFormate(new Date(), 'date', '/'), this.dateFormat)],
        downloadLoading: false
      }
    },
    mounted() {
      this.initData()
    },
    methods: {
      moment,
      initData(){
        getAreaList({start: 0, size: 0}).then(res => {
          this.areaList = res.retData
        })
      },
      disabledDate(current) {
        return (current >= moment().endOf('day')) || (current < moment().endOf('day') - 90 * 24 * 3600 * 1000)
      },
      dateRangeSelected(dates,dateStrings) {
        console.log(dates,dateStrings)
        this.queryParam.startdate = dateStrings[0]
        this.queryParam.enddate = dateStrings[1]
      },
      handleAdd() {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['排名', '路线', '数量']
          const filterVal = ['id', 'firest', 'count']
          const list = this.loadDataArr
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '问题线路统计'+this.queryParam.startdate + '~' + this.queryParam.enddate )
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map((v,i) => {
          return filterVal.map(j => {
            if (j === 'created') {
              v[j] = dateFormate(v[j], 'time')
            }
            if (j === 'id') {
              v[j] = i+1
            }
            if (v[j]) {
              return v[j]
            }
          })
        })
      },
      resetSearchForm () {
        this.queryParam = {}
        this.queryParam.startdate = dateFormate(new Date(new Date().getTime()-30*1000*3600*24), 'date', '/')
        this.queryParam.enddate = dateFormate(new Date(), 'date', '/')
        this.dateRange = [moment(dateFormate(new Date(new Date().getTime()-30*1000*3600*24), 'date', '/'), this.dateFormat), moment(dateFormate(new Date(), 'date', '/'), this.dateFormat)]
        this.$refs.table.refresh()
      },
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
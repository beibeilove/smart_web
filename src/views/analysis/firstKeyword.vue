<template>
  <div class="analysis">
    <a-card>
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
              <a-button type="primary" @click="searchForm">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
            </span>
            </a-col>
          </a-row>
        </a-form>
        <div class="table-operator">
          <a-button type="primary" icon="plus" @click="handleExport" :loading="downloadLoading">导出Excel</a-button>
        </div>
      </div>
    </a-card>
    <a-card>
      <a-row>
        <a-col>
          <div style="display: flex;justify-content: space-between;">
            <h3 style="font-weight: 700;margin-left: 50px;font-size: 20px;">数量统计</h3>
            <div>
              <span>显示：</span>
              <a-select v-model="listQuery.start" @change="getData">
                <a-select-option v-for="item in pageSize" :key="item.value" :value="item.value">{{ item.name }}</a-select-option>
              </a-select>
              <span>项，共{{ pageSize.length }}页</span>
            </div>
          </div>
          <v-charts :options="barData" :autoresize="autoresize"></v-charts>
        </a-col>
      </a-row>
    </a-card>
    <a-card>
      <a-row>
        <a-col>
          <table id="keyWordTable">
            <tr id="keyword">
              <th>关键词</th>
              <th v-for="(item, index) in keyData" :key="index">{{ item.name }}</th>
            </tr>
            <tr id="num">
              <td>次数</td>
              <td v-for="(item, index) in keyData" :key="index">{{ item.value }}</td>
            </tr>
          </table>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/component/tooltip'
  import STable from '@/components/table/'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import AInput from 'ant-design-vue/es/input/Input'
  import { dateFormate } from '@/utils/util'
  import moment from 'moment'

  import { getFirstQuestionAnalysis, getAreaList } from '@/api/base'

  export default {
    data() {
      return {
        barData: {},
        autoresize: true,
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
          start: 1
        },
        // 查询参数
        queryParam: {
          startDate: dateFormate(new Date(new Date().getTime()-30*1000*3600*24), 'date', '/'),
          endDate: dateFormate(new Date(), 'date', '/')
        },
        // 时间插件
        dateFormat: 'YYYY/MM/DD',
        areaList: [],
        dateRange: [moment(dateFormate(new Date(new Date().getTime()-30*1000*3600*24), 'date', '/'), this.dateFormat), moment(dateFormate(new Date(), 'date', '/'), this.dateFormat)],
        downloadLoading: false,
        pageSize: [],
        keyData: [] // 数据源
      }
    },
    created() {
      this.initData()
    },
    components: {
      'v-charts': ECharts,
      AInput,
      ATextarea,
      STable
    },
    methods: {
      moment,
      initData() {
        getAreaList({start: 0, size: 0}).then(res => {
          this.areaList = res.retData
        })
        this.getData()
      },
      getData() {
        getFirstQuestionAnalysis(Object.assign({},this.listQuery, this.queryParam)).then(res => {
          var data = [] // value
          var name = [] // name
          var collect = [] // name， value
          res.retData.map(item => {
            collect.push({name: item.firest, value: item.count})
            data.push(item.count)
            name.push(item.firest)
          })
          this.keyData = collect
          // 分页配置
          var i = res.totalCount !== '0' ? Math.ceil(parseInt(res.totalCount) / this.listQuery.size) : 0
          var arr = []
          for (var j=0; j<i; j++) {
            var pageObj = {
              name: '',
              value: null
            }
            pageObj.name = '第'+ (1+j*this.listQuery.size) + '-' + (j+1)*this.listQuery.size
            pageObj.value = j+1
            arr.push(pageObj)
          }
          if (i) {
            this.pageSize = arr
          } else {
            this.pageSize = []
          }
          // 柱状图配置
          this.barData = {
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                axisTick: {
                  alignWithLabel: true
                },
                axisLabel: {
                  rotate: 20
                },
                data: name
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '次数',
                type: 'bar',
                barWidth: '50%',
                data: data
              }
            ]
          }
          this.$forceUpdate()
        })
      },
      searchForm() {
        this.listQuery.start = 1
        this.getData()
      },
      disabledDate(current) {
        return (current >= moment().endOf('day')) || (current < moment().endOf('day') - 90 * 24 * 3600 * 1000)
      },
      dateRangeSelected(dates,dateStrings) {
        this.queryParam.startDate = dateStrings[0]
        this.queryParam.endDate = dateStrings[1]
      },
      handleExport() {
        this.downloadLoading = true
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/vendor/Export2Excel')
          const tHeader = ['排名', '关键字', '次数']
          const filterVal = ['index', 'name', 'value']
          const list = this.keyData
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '首次关键字统计'+this.queryParam.startDate + '~' + this.queryParam.endDate)
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map((v, i) => {
          return filterVal.map(j => {
            if (v['index'] === undefined) {
              v['index'] = ''
            }
            v['index'] = i+1
            if (j === 'created') {
              v[j] = dateFormate(v[j], 'time')
            }
            if (v[j]) {
              return v[j]
            }
          })
        })
      },
      resetSearchForm () {
        this.listQuery.start = 1
        this.queryParam = {}
        this.queryParam.startDate = dateFormate(new Date(new Date().getTime()-30*1000*3600*24), 'date', '/')
        this.queryParam.endDate = dateFormate(new Date(), 'date', '/')
        this.dateRange = [moment(dateFormate(new Date(new Date().getTime()-30*1000*3600*24), 'date', '/'), this.dateFormat), moment(dateFormate(new Date(), 'date', '/'), this.dateFormat)]
        this.initData()
      },
    }
  }
</script>
<style>
  .analysis canvas, .analysis .echarts{
    width: 100% !important;
  }
  .analysis .ant-card{
    margin-top: 10px;
  }
</style>
<style scoped>
  #keyWordTable {
    border-collapse: collapse;
    width: 98.5%;
    text-align: center;
    margin-left: 10px;
    margin-right: 10px;
  }
  #keyWordTable tr{
    height: 54px;
    line-height: 54px;
    border-top: solid 1px rgb(232, 232, 232);
    border-bottom: solid 1px rgb(232, 232, 232);
  }
  #keyWordTable #keyword{
    background: rgb(250, 250, 250);
  }
</style>
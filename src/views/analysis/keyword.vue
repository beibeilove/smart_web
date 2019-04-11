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
            <div v-if="pageSize.length > 0">
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
    <a-card>
      <a-row>
        <a-col :span="12">
          <v-charts :options="pieData" :autoresize="autoresize"></v-charts>
        </a-col>
        <a-col :span="12">
          <div style="display: flex;flex-direction: column;justify-content: center;height: 400px;">
            <ul id="pieTable" style="width: 50%;min-width: 450px;" v-html="legendCon"></ul>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/title'
  import STable from '@/components/table/'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  import AInput from 'ant-design-vue/es/input/Input'
  import { dateFormate } from '@/utils/util'
  import moment from 'moment'

  import { getQuestionAnalysis, getAreaList } from '@/api/base'

  export default {
    data() {
      return {
        barData: {},
        pieData: {},
        legendCon: '',
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
        getQuestionAnalysis(Object.assign({},this.listQuery, this.queryParam)).then(res => {
          var data = [] // value
          var name = [] // name
          var collect = [] // name， value
          var sum = 0
          res.retData.map(item => {
            collect.push({name: item.beforekey, value: item.count, after: item.afterkey, afterValue: item.afterkeycount})
            data.push(item.count)
            name.push(item.beforekey)
            sum += item.count
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
          // 饼图配置
          this.pieData = {
            title: {
              text: '总提问次数',
              textStyle: {
                fontWeight: 'normal',
                color: '#aaa',
                fontSize: 16
              },
              subtext: sum,
              subtextStyle: {
                fontWeight: 'normal',
                color: '#333',
                fontSize: 22
              },
              x: 'center',
              y: '45%'
            },
            color: ['#37a5ff','#4fcb74','#FBD438','#f04664','#9860E5','#37CBCB'],
            tooltip: {
              trigger: 'item',
              formatter: function(params){
                if (params.data.after) {
                  return params.data.name + '： ' + params.data.value + '(' + params.percent + '%)' + '<br/>' + '客户还对这些方面感兴趣<br/>' + params.data.after + '： ' + params.data.afterValue
                } else {
                  return params.data.name + '： ' + params.data.value + '(' + params.percent + '%)' + '<br/>' + '客户还对这些方面感兴趣<br/>暂无'
                }
              }
              // formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            series: [
              {
                name: '客户还对这些方面感兴趣',
                type: 'pie',
                center: ['50%', '50%'],
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                },
                radius: ['50%', '70%'],
                data: collect,
              }
            ]
          }
          // 饼图legend
          this.getLegendCon()
          this.$forceUpdate()
        })
      },
      searchForm() {
        this.listQuery.start = 1
        this.getData()
      },
      getLegendCon() {
        var color = ['#37a5ff','#4fcb74','#FBD438','#f04664','#9860E5','#37CBCB', '#37a5ff','#4fcb74','#FBD438','#f04664']
        let str = ''
        this.keyData.map((obj, index) => {
          if (obj.after) {
            str += '<li style="display: flex;">' +
              '<span style="line-height: 28px;width: 10px;height: 10px;border-radius: 2px;background: ' + color[index] + ';margin: 9px 10px 0 0;"></span>' +
              '<span style="flex: 3;font-size: 16px;line-height: 28px;color: #5a5a5a;">' + obj.name + '</span>' +
              '<span style="flex: 1;font-size: 16px;line-height: 28px;color: #E9E9E9;">|</span>' +
              '<span style="flex: 3;font-size: 16px;line-height: 28px;color: #6a6a6a;">' + obj.after + '</span>' +
              '<span style="flex: 1;font-size: 16px;line-height: 28px;color: #5a5a5a;text-align: center;">' + obj.afterValue + '</span>' +
              '</li>'
          } else {
            str += '<li style="display: flex;">' +
              '<span style="line-height: 28px;width: 10px;height: 10px;border-radius: 2px;background: ' + color[index] + ';margin: 9px 10px 0 0;"></span>' +
              '<span style="flex: 3;font-size: 16px;line-height: 28px;color: #5a5a5a;">' + obj.name + '</span>' +
              '<span style="flex: 1;font-size: 16px;line-height: 28px;color: #E9E9E9;">|</span>' +
              '<span style="flex: 4;font-size: 16px;line-height: 28px;color: #6a6a6a;text-align: center;">暂无</span>' +
              '</li>'
          }
          this.legendCon = str
        })
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
          const tHeader = ['排名', '关键字', '次数', '下一关键字', '次数']
          const filterVal = ['index', 'name', 'value', 'after', 'afterValue']
          const list = this.keyData
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '关键字匹配数量统计'+this.queryParam.startDate + '~' + this.queryParam.endDate)
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
        this.getData()
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
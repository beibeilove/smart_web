<template>
  <div>
    <a-form @submit="handleSubmit" :form="form">
      <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
        <a-row>
          <a-col :md="16" :sm="20">
            <a-form-item
              label="答案概述"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-input
                :value="addList.answer"
                v-decorator="['answer',{rules: [{ required: true, message: '请输入推荐提问' },{max: 30, message: '请输入推荐提问，30字以内'}]}]"
                name="answer"
                placeholder="请输入推荐提问，30字以内，必填" />
            </a-form-item>
            <a-form-item
              label="播放方式"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">
              <a-radio-group
                name="playtype"
                @change="onChangeRadio"
                v-model="addList.playtype"
                v-decorator="['playtype',{rules: [{ required: true, message: '请选择上传类型' }]}]">
                <a-radio :value="1">H5播放</a-radio>
                <a-radio :value="0">图片播放</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              label="语音描述"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-if="!addList.playtype"
            >
              <a-textarea
                :value="addList.voicetext"
                v-decorator="['voicetext',{rules: [{ required: true, message: '请输入语音描述' },{max: 500, message: '请输入语音描述，500个字以内'}]}]"
                name="voicetext"
                placeholder="请输入答案描述，500个字以内，必填" />
            </a-form-item>
            <a-form-item
              label="图片"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-if="!addList.playtype">
              <a-input
                type="hidden"
                name="photo"
                :value="addList.photo"
                v-decorator="['photo',{rules: [{ required: true, message: '请上传图片' }]}]"
              ></a-input>
              <a-upload
                accept="image/*"
                name="folder"
                :headers="headers"
                listType="picture-card"
                class="avatar-uploader"
                :action="uploadFile"
                :fileList="fileListImg"
                @change="handleChangeImg"
              >
                <div>
                  <a-icon type="plus"/>
                  <div class="ant-upload-text">Upload</div>
                </div>
              </a-upload>
            </a-form-item>
            <a-form-item
              label="视频"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-if="!addList.playtype">
              <div class="clearfix">
                <a-upload
                  accept="video/*"
                  name="folder"
                  :headers="headers"
                  listType="picture"
                  :fileList="fileList"
                  @change="handleChangeVideo"
                  class="upload-list-inline"
                  :action="uploadFile"
                >
                  <div v-if="fileList.length < 3">
                    <a-button>
                      <a-icon type="upload" /> upload
                    </a-button>
                  </div>
                </a-upload>
              </div>
              <p style="color: #CCCCCC;font-size: 14px;">最多3个</p>
            </a-form-item>
            <a-form-item
              label="附件"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-if="addList.playtype">
              <a-input
                type="hidden"
                name="html"
                :value="addList.html"
                v-decorator="['html',{rules: [{ required: true, message: '请上传附件' }]}]"
              ></a-input>
              <a-upload
                accept="image/*"
                name="folder"
                :headers="headers"
                listType="picture"
                class="upload-list-inline"
                :action="uploadFile"
                :fileList="fileListHtml"
                @change="handleChangeHtml"
                directory
              >
                <div v-if="fileListHtml.length < 1">
                  <a-button>
                    <a-icon type="upload" /> upload
                  </a-button>
                </div>
              </a-upload>
            </a-form-item>
            <a-row>
              <a-col :xs="22" :sm="3" :push="2">
                <a-button type="primary" @click="handleSubmit">保存</a-button>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
  </div>
</template>

<script>
  import { baseURL } from '@/utils/request'
  import STable from '@/components/table/'
  import pick from 'lodash.pick'
  import { addAnswer, updateAnswer, getAnswerDetail } from '@/api/base'
  import ATextarea from 'ant-design-vue/es/input/TextArea'
  export default {
    name: 'BaseForm',
    data () {
      return {
        title: '关联答案',
        // 分页参数
        listQuery: {
          size: 10,
          start: 0
        },
        // 查询参数
        queryParam: {},
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
        addList: {
          answer: '',
          photo: '',
          playtype: 0
        },
        uploadFile: baseURL + '/uploadFolder',
        headers: {
          token: ''
        },
        fileList: [],
        fileListHtml: [],
        fileListImg: []
      }
    },
    components: {
      ATextarea,
      STable
    },
    mounted() {
      this.headers.token = this.$store.state.user.token
      if (this.$route.query.id) {
        this.initData()
      } else {
        this.form.setFieldsValue(pick({playtype: 0}, 'playtype'))
        this.addList.playtype = 0
      }
    },
    methods: {
      initData() {
        getAnswerDetail({id: this.$route.query.id}).then(res => {
          var result = res.retData[0]
          if (result) {
            this.$nextTick(() => {
              result.playtype = result.playtype ? parseInt(result.playtype) : 0
              if (result.playtype === 0) {
                var arr = []
                for (var i = 0; i < 3; i++) {
                  var j = i === 0 ? '' : i + ''
                  if (result['video' + j]) {
                    var obj = {
                      uid: i + 1,
                      name: result['name' + j],
                      url: result['video' + j]
                    }
                    arr.push(obj)
                  }
                }
                this.fileList = arr

                // 图片列表
                var photoList = result.photo && result.photo.indexOf(',') ? result.photo.split(',') : result.photo
                var newPhotoList = []
                photoList.map((item, index) => {
                  var photo = {
                    uid: index,
                    name: 'name.jpg',
                    url : item
                  }
                  newPhotoList.push(photo)
                })
                this.fileListImg = newPhotoList
                this.form.setFieldsValue(pick(result, 'answer', 'photo', 'playtype', 'voicetext', 'name'))
              } else {
                if (result.html) {
                  this.fileListHtml = [
                    {
                      uid: 1,
                      name: '附件',
                      url: result.html
                    }
                  ]
                }
                this.form.setFieldsValue(pick(result, 'answer', 'playtype', 'html'))
                this.$forceUpdate()
                console.log(result.html, this.form.getFieldValue('html'))
              }
            })
            this.addList = result
          }
        })
        this.$forceUpdate()
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
      handleChangeImg ({ fileList }) {
        this.fileListImg = fileList
        var strs = ''
        this.fileListImg.map((item) => {
          if (item.response) {
            strs += item.response.retData + ','
          }
          if (item.url) {
            strs += item.url + ','
          }
        })
        strs = strs.substr(0, strs.length-1)
        this.addList.photo = strs
        this.form.setFieldsValue(pick(this.addList, 'photo'))
      },
      handleChangeVideo ({ fileList }) {
        this.fileList = fileList
        this.init()
        if (this.fileList.length === 0 ) {
          this.addList['name'] = ''
          this.addList['video'] = ''
        }
        this.fileList.map((item,index) => {
          let i = ''
          if (index === 0) {
            i = ''
          } else {
            i = index+''
          }
          for (var j = 0; j < 3; j++) {
            if (j < this.fileList.length) {
              this.addList['name'+i] = item.name
              this.addList['video'+i] = item.response ? item.response.retData : item.url
            } else {
              this.addList['name' + j] = ''
              this.addList['video' + j] = ''
            }
          }
          console.log(fileList)
        })
        this.form.setFieldsValue(pick(this.addList, 'name'))
      },
      handleChangeHtml ({ file, fileList }) {
        this.fileListHtml = fileList
        if (file.response && file.name === 'index.html') {
          this.fileListHtml = [file]
          this.addList.html = file.response.retData
          this.form.setFieldsValue(pick(this.addList, 'html'))
        }
      },
      handleSubmit (e) {
        e.preventDefault()
        this.init()
        if (this.addList.html) {
          this.form.setFieldsValue(pick(this.addList, 'html'))
        }
        this.form.validateFields((err, values) => {
          if (!err) {
            if (this.$route.query.id) {
              updateAnswer(Object.assign({},this.addList, values)).then(res => {
                this.$router.push({ path: '/question/answer' })
                console.log(res, 'update')
              })
            } else {
              addAnswer(Object.assign({},this.addList, values)).then(res => {
                this.$router.push({ path: '/question/answer' })
                console.log(res, 'add')
              })
            }
          }
        })
      },
      onChangeRadio() {
        this.init()
      },
      init() {
        if (this.addList.playtype === 0) {
          this.addList.html = ''
          this.fileListHtml = []
          this.form.setFieldsValue(pick(this.addList, 'html'))
        } else if (this.addList.playtype === 1) {
          this.addList.voicetext = ''
          this.fileListImg = []
          this.addList.photo = ''
          this.fileList = []
          this.addList.name = ''
          this.addList.video = ''
          this.addList.name1 = ''
          this.addList.video1 = ''
          this.addList.name2 = ''
          this.addList.video2 = ''
          this.form.setFieldsValue(pick(this.addList, 'voicetext', 'photo', 'name'))
        }
      }
    }
  }
</script>
<style>
  .ant-upload.ant-upload-select-picture-card, .ant-upload-list-picture-card .ant-upload-list-item{
    width: 210px;
    height: 150px;
    overflow: hidden;
  }

  .ant-upload.ant-upload-select-picture-card img, .ant-upload-list-picture-card .ant-upload-list-item img{
    width: 100%;
  }
</style>
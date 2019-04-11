<template xmlns:v-drag-and-drop="http://www.w3.org/1999/xhtml">
  <a-card>
    <div class="clearfix">
      <div v-drag-and-drop:options="options">
        <a-upload
          accept="image/*"
          :action="uploadFile"
          listType="picture-card"
          :fileList="fileList"
          name="folder"
          :headers="headers"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div>
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-button
          :loading="loginBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="loginBtn">保存</a-button>
      </div>
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
    </div>
  </a-card>
</template>
<script>
  import { baseURL } from '@/utils/request'
  import { getBannerList, updateBanner } from '@/api/base'

  export default {
    data () {
      return {
        loginBtn: false,
        previewVisible: false,
        previewImage: '',
        options: {
          dropzoneSelector: '.ant-upload-list',
          draggableSelector: '.ant-upload-list-item',
          multipleDropzonesItemsDraggingEnabled: true,
          showDropzoneAreas: true,
          onDrop: function(event) {
            console.log(event)
          },
          onDragstart: function(event) {
            console.log(event)
          },
          onDragend: function(event) {
            console.log(event)
          }
        },
        uploadFile: baseURL + '/uploadFolder',
        headers: {
          token: ''
        },
        fileList: [],
      }
    },
    mounted() {
      this.headers.token = this.$store.state.user.token
      this.initData()
    },
    methods: {
      initData() {
        getBannerList({}).then(res => {
          var bannerList = res.retData[0].slideshow.split(',')
          var list = []
          bannerList.map((item, index) => {
            var obj= {
              uid: index,
              name: item.split('/')[item.split('/').length - 1],
              url: item
            }
            list.push(obj)
          })
          this.fileList = list
          this.$forceUpdate()
        })
      },
      handleCancel () {
        this.previewVisible = false
      },
      handlePreview (file) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      },
      handleChange ({ file, fileList }) {
        var arr = []
        fileList.map(item => {
          var obj = {
            uid: '',
            name: '',
            url: ''
          }
          if (item.uid === file.uid) {
            obj.uid = item.uid
            obj.name = item.name
            obj.url = file.response ? file.response.retData : ''
          } else {
            obj.uid = item.uid
            obj.name = item.name
            obj.url = item.url
          }
          arr.push(obj)
        })
        this.fileList = arr
      },
      handleSubmit() {
        this.loginBtn = true
        var obj = ''
        for (var i=0; i<document.getElementsByClassName('ant-upload-list-item').length; i++) {
          obj += document.getElementsByClassName('ant-upload-list-item')[i].getElementsByTagName('img')[0].src + ','
        }
        obj = obj.substr(0, obj.length-1)
        updateBanner(encodeURIComponent(obj)).then(() => {
          this.$message.success('操作成功')
          this.loginBtn = false
          // setTimeout(this.initData(), 20000)
        })
      }
    },
  }
</script>
<style>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .item-dropzone-area{
    display: inline-block;
  }
  .ant-modal-close-x {
    width: 28px;
    height: 28px;
    line-height: 28px;
  }
</style>
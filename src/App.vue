<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive">
          <!-- 这里是会被缓存的视图组件，比如 page1,page2 -->
        </router-view>
      </keep-alive>

      <router-view v-if="!$route.meta.keepAlive">
        <!-- 这里是不被缓存的视图组件，比如 page3 -->
      </router-view>
    </div>
  </a-locale-provider>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  import { deviceEnquire, DEVICE_TYPE } from '@/utils/device'

  export default {
    data () {
      return {
        locale: zhCN
      }
    },
    mounted () {
      const { $store } = this
      deviceEnquire(deviceType => {

        switch (deviceType) {
          case DEVICE_TYPE.DESKTOP:
            $store.commit('TOGGLE_DEVICE', 'desktop')
            $store.dispatch('setSidebar', true)
            break
          case DEVICE_TYPE.TABLET:
            $store.commit('TOGGLE_DEVICE', 'tablet')
            $store.dispatch('setSidebar', false)
            break
          case DEVICE_TYPE.MOBILE:
          default:
            $store.commit('TOGGLE_DEVICE', 'mobile')
            $store.dispatch('setSidebar', true)
            break
        }
        console.log('deviceType', deviceType)
      })
    }
  }
</script>
<style>
  #app {
    height: 100%;
  }
  .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
    padding: 16px 10px !important;
  }
</style>
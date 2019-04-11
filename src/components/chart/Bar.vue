<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px',fontSize: '16px',lineHeight: '24px',fontWeight: 700 }">{{ title }}</h4>
    <slot></slot>
    <v-chart
      height="254"
      :data="data"
      :forceFit="true"
      :padding="['auto', 'auto', '40', '50']">
      <v-tooltip />
      <v-axis />
      <v-bar position="x*y"/>
    </v-chart>
  </div>
</template>

<script>
  export default {
    name: 'Bar',
    props: {
      title: {
        type: String,
        default: ''
      },
      data: {
        type: Array,
        default: null
      },
      scale: {
        type: Array,
        default: null
      },
      tooltip: {
        type: Array,
        default: null
      }
    },
    data () {
      return {}
    }
  }
</script>
<style>
  canvas{
    width: 100% !important;
  }
</style>
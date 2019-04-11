<template>
  <div class="footer">
    <div class="links">
      <a href="_self">帮助</a>
      <a href="_self">隐私</a>
      <a href="_self">条款</a>
    </div>
    <div class="copyright">
      Copyright &copy; 2019 广菲克. 版权所有.
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LayoutFooter',
    data () {
      return {
      }
    }
  }
</script>

<style lang="scss" scoped>
  .footer {
    padding: 0 16px;
    margin: 48px 0 24px;
    text-align: center;

    .links {
      margin-bottom: 8px;

      a {
        color: rgba(0, 0, 0, .45);

        &:hover {
          color: rgba(0, 0, 0, .65);
        }

        &:not(:last-child) {
          margin-right: 40px;
        }
      }
    }
    .copyright {
      color: rgba(0, 0, 0, .45);
      font-size: 14px;
    }
  }
</style>
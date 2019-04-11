<template>
  <div class="main">
    <a-form
      class="user-layout-login"
      ref="formLogin"
      :autoFormCreate="(form)=>{this.form = form}"
      id="formLogin"
    >
      <a-form-item
        fieldDecoratorId="username"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入帐户名或邮箱地址' }], validateTrigger: 'change'}">
        <a-input size="large" type="text" placeholder="用户名 / admin">
          <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>
      <a-form-item
        fieldDecoratorId="password"
        :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}">
        <a-input size="large" type="password" autocomplete="false" placeholder="密码 / 1234">
          <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </a-input>
      </a-form-item>

      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="loginBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="loginBtn"
        >确定</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { timeFix } from '@/utils/util'

export default {
  data() {
    return {
      loginBtn: false,
      form: null,
      formLogin: {
        username: '',
        password: '',
      }
    }
  },
  methods: {
    handleSubmit() {
      const that = this
      that.form.validateFields(['username', 'password'], { force: true }, (err, values) => {
        if (!err) {
          this.loginBtn = true
          that.$store.dispatch('Login',values).then(res => {
            if (!res) {
              this.loginBtn = false
              this.$router.push({ name: 'base' })
              this.$notification.success({
                message: '欢迎',
                description: `${timeFix()}，欢迎回来`
              })
            } else {
              this.loginBtn = false
              this.$notification.error({
                message: '登陆失败',
                description: `请检查您的账号密码`
              })
            }
          }).catch(error => {
            console.log(error)
          })
        }
      })
    },
    requestFailed(err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
      this.loginBtn = false
    }
  }
}
</script>

<style lang="scss" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
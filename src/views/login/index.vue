<template>
  <div class="login-container">
    <div class="login-logo">
      <!-- <img src="@/assets/img/logo_text.png"> -->
      <h3 class="title">{{ this.$store.state.settings.title }}</h3>
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
      size="medium"
    >
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          auto-complete="on"
          placeholder="企业邮箱"
        >
          <span slot="prepend" class="prepend_span">用户(SSO): </span>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="SSO密码"
          @keyup.enter.native="handleLogin"
        >
          <span slot="prepend" class="prepend_span">密码: </span>
          <span class="show-pwd" slot="append" @click="showPwd">
            <svg-icon icon-class="eye" />
          </span>
        </el-input>
      </el-form-item>

      <!--          <span class="prepend_span">验证码：</span>-->
      <el-form-item class="submit_btn">
        <el-button
          :loading="loading"
          type="primary"
          style="width:400px;"
          size="medium"
          @click.native.prevent="handleLogin"
          id="self-button"
        >
          登录
        </el-button>
      </el-form-item>
      <el-link
        type="danger"
        style="float: right;font-weight: bold"
        :underline="false"
        @click="forgetPassword"
        >忘记密码?</el-link
      >
    </el-form>
    <div class="footer_img"></div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '@oyohotels.cn',
        password: '',
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername },
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePass },
        ],
      },
      loading: false,
      pwdType: 'password',
      redirect: '/',
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = 'text'
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', this.loginForm)
            .then((res) => {
              // console.log("res:", res)
              if (res.data.status && res.data.data) {
                this.$router.push({ path: this.redirect || '/' })
              } else {
                this.$message({ message: res.data.error, type: 'error' })
              }
              this.loading = false
            })
            .catch((err) => {
              // console.log('err', err)
              this.$message({ message: '账号密码不匹配', type: 'error' })
              this.loading = false
            })
        } else {
          this.$message({ message: '非法数据', type: 'error' })
          console.log('error submit!!')
          return false
        }
      })
    },
    forgetPassword() {
      this.$router.push({ path: '/reset-ldap-password' })
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #eee;
$light_gray: #2d3a4b;

/* reset element-ui css */
// .login-container {
//   .el-input {
//     display: inline-block;
//     height: 47px;
//     width: 85%;
//     input {
//       background: transparent;
//       border: 0px;
//       -webkit-appearance: none;
//       border-radius: 0px;
//       padding: 12px 5px 12px 15px;
//       color: black;
//       height: 47px;
//       &:-webkit-autofill {
//         -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
//         -webkit-text-fill-color: rgba(0, 0, 0, 0.75) !important;
//       }
//     }
//   }
//   .el-form-item {
//     border: 1px solid lightgray;
//     background: rgba(0, 0, 0, 0.1);
//     border-radius: 5px;
//     color: rgba(0, 0, 0, 0.452);
//   }
//   .el-button {
//     border: 1px solid #e6312a;
//     background-color: #e6312a;
//     margin:0;
//   }
// }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/login';
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  //   position: fixed;
  //   height: 100%;
  //   width: 100%;
  //   background-color: $bg;
  //   .login-form {
  //     position: absolute;
  //     left: 0;
  //     right: 0;
  //     width: 520px;
  //     max-width: 100%;
  //     padding: 35px 35px 15px 35px;
  //     margin: 120px auto;
  //   }
  //   .tips {
  //     font-size: 14px;
  //     color: #fff;
  //     margin-bottom: 10px;
  //     span {
  //       &:first-of-type {
  //         margin-right: 16px;
  //       }
  //     }
  //   }
  //   .svg-container {
  //     padding: 6px 5px 6px 15px;
  //     color: $dark_gray;
  //     vertical-align: middle;
  //     width: 30px;
  //     display: inline-block;
  //   }
  //   .title {
  //     font-size: 26px;
  //     font-weight: 400;
  //     color: $light_gray;
  //     margin: 0px auto 40px auto;
  //     text-align: center;
  //     font-weight: bold;
  //   }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .eye-btn {
    width: 60px;
    padding: 0;
  }
  .show-eye {
    font-size: 12px;
  }
  .prepend_span {
    display: block;
    width: 56px;
  }

  #self-button {
    background-color: #e6312a;
    border-color: #e6312a;
  }
}
</style>

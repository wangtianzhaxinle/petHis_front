
<template>
  <div class="login-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="login-form" auto-complete="on" label-position="left">
      <template v-if="checkcode===false">
        <div class="title-container">
          <h3 class="title">找回密码</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="registerForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="phonenumber">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="phonenumber"
            v-model.number="registerForm.phonenumber"
            placeholder="手机"
            name="phonenumber"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>
        <el-form-item
          prop="code"
        >
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="code"
            v-model="registerForm.code"
            placeholder="验证码"
            name="code"
            type="text"
            tabindex="1"
            auto-complete="on"
          />

        </el-form-item>

        <el-button v-if="show" type="primary" style="width:100%;margin-bottom:30px;" @click="getPhoneCode">获取验证码</el-button>
        <el-button v-if="!show" type="primary" style="width:100%;margin-bottom:30px;" :disabled="true">
          <span v-if="!show" style="color: #707070;">
            {{ count }}s后重新获取
          </span></el-button>
        <el-row />
        <!-- 这里一直提示handleRegister不是一个方法,原来我把handleRegister写在methods括号外面了,获取不到 -->
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="checkUser">提交</el-button>

      </template>

      <template v-else>

        <div class="title-container">
          <h3 class="title">重置密码</h3>
        </div>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="registerForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-form-item prop="confirmPassword">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="confirmPassword"
            v-model="registerForm.confirmPassword"
            :type="passwordType"
            placeholder="确认密码"
            name="confirmPassword"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-row />
        <!-- 这里一直提示handleRegister不是一个方法,原来我把handleRegister写在methods括号外面了,获取不到 -->
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="resetPasword">重置密码</el-button>

      </template>

      <!-- <el-button v-if="show" type="primary" style="width:100%;margin-bottom:30px;" @click="getPhoneCode">获取验证码</el-button>
         -->

    </el-form>
  </div>
</template>

<script>
// import { registerUser } from '@/api/user'
// import { checkUsername } from '@/utils/validate'

import { getPhoneCode } from '@/api/code'
import { checkUser, resetPassword } from '@/api/user'
export default {

  name: 'Register',
  data() {
    var confirmPassword = (rule, value, callback) => {
      // console.log(this.registerForm)
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    const telCheck = (rule, value, callback) => {
      var reg = /^1[3-9]\d{9}$/
      // console.log(value)
      // console.log(Number.isInteger(value))
      if (!Number.isInteger(value)) {
        // 这里输入框必须是v-model.number不然Number.isInteger(value)结果始终为false
        return callback(new Error('手机号码必须是数字'))
      } else if (value.toString().length !== 11) {
        return callback(new Error('手机号码必须是11位数字'))
      } else if (!reg.test(value)) {
        return callback(new Error('请输入有效的手机号码'))
      } else {
        callback()
      }
    }
    return {
      checkcode: false,
      show: true,
      count: '',
      timer: null,
      // checkUser: {
      //   username: '',
      //   phonenumber: '',
      //   code: ''
      // },
      registerForm: {

        // name: '',
        username: '',
        // sex: '',
        // age: '',
        // address: '',
        // email: '',

        password: '',
        confirmPassword: '',
        phonenumber: '',
        code: ''

      },
      /*
        loginForm: {
          mobile: '',
          code: '',
          zheCode: ''
        },*/
      loading: false,
      passwordType: 'password',
      redirect: undefined,

      registerRules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' },
          { max: 10, message: '最大长度为10', trigger: 'blur' }
        ],
        username: [
          { required: true, trigger: 'blur', message: '请输入用户名' }

        ],

        password: [
          { required: true, trigger: 'blur', message: '请输入密码' }
        ],
        confirmPassword: [
          { required: true, trigger: 'blur', message: '请确认密码' },

          { validator: confirmPassword, trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, trigger: 'blur', message: '请输入手机号码' },
          // { type: 'number', trigger: 'blur', message: '手机号码应为数字' },
          // { min: 1, max: 11, message: '手机号码应为11位数字' },
          { validator: telCheck, trigger: 'blur' }
        ],
        code: [
          { required: true, trigger: 'blur', message: '请输入验证码' }
        ]
      }
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    resetPasword() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          const data = this.registerForm
          resetPassword(data).then(res => {
            if (res.total > 0) {
              this.$router.push(`/login`)
            }
          })
        } else {
          console.log('error submit!!')
          // return false
        }
      })
    },
    getPhoneCode() {
      const TIME_COUNT = 60

      if (this.$refs.phonenumber.value !== '' && this.$refs.phonenumber.value !== null && this.$refs.phonenumber.value !== undefined) {
        if (!this.timer) {
          this.count = TIME_COUNT
          this.show = false
          const data = { userPhone: this.registerForm.phonenumber }
          getPhoneCode(data).then(res => {

          })
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--
            } else {
              this.show = true
              clearInterval(this.timer)
              this.timer = null
            }
          }, 1000)
        }
      } else {
        this.$alert('请输入手机号码', '提示', {
          confirmButtonText: '确定'

        })
      }
    },
    checkUser() {
      const data = this.registerForm
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          checkUser(data).then(res => {
            if (res.total > 0) {
              this.checkcode = true
            }
          })
        }
      })
    }

  }

}

</script>
  <style lang="scss">
  /* 修复input 背景不协调 和光标变色 */
  /* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

  $bg:#283443;
  $light_gray:#fff;
  $cursor: #fff;

  @supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
      color: $cursor;
    }
  }

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
  </style>

  <style lang="scss" scoped>
  $bg:#2d3a4b;
  $dark_gray:#889aa4;
  $light_gray:#eee;

  .login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
      overflow: hidden;
    }

    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
  </style>


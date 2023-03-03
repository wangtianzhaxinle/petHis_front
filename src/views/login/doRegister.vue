<template>
  <div class>
    <el-form ref="ruleForm" :model="ruleForm" class :rules="rules">
      <el-form-item prop="user1">
        <el-input v-model="ruleForm.user1" type="text" placeholder="用户名" required="required" prefix-icon="el-icon-user-solid" />
      </el-form-item>
      <el-form-item prop="pass1">
        <el-input v-model="ruleForm.pass1" class="phone-input" placeholder="手机号/邮箱" prefix-icon="el-icon-mobile-phone" />
      </el-form-item>
      <el-form-item v-show="yzmshow" prop="code" class="phone">
        <el-input v-model="ruleForm.code" placeholder="验证码" :minlength="6" :maxlength="6" />
        <el-button type="primary" class="code-btn" :disabled="!show" @click="getCode()">
          <span v-show="show">发送验证码</span>
          <span v-show="!show" class="count">{{ count }} s</span>
        </el-button>
      </el-form-item>
      <el-form-item prop="pass">
        <el-input v-model="ruleForm.pass" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock" />
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input v-model="ruleForm.checkPass" type="password" placeholder="请再次输入密码" prefix-icon="el-icon-lock" />
      </el-form-item>
      <el-form-item class="btn-form">
        <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
      <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
  /*  var validateUser1 = async(rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        if (value) {
          const res = await request.post('/api/user/checkUsernameExist',
          {
            username: this.ruleForm.user1
          })
          console.log(res)
          if (res.data.code === 20000) {
            callback()
          } else {
            return callback(new Error('该用户名已经被注册'))
          }
        }
      }
    }*/
    var validatePass1 = async(rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号或者邮箱不能为空'))
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        // eslint-disable-next-line no-useless-escape
        const reg2 = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/
        if ((reg.test(value) || reg2.test(value))) {
          this.yzmshow = true
          callback()
        } else {
          callback(new Error('请输入正确的手机号或者邮箱'))
        }
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else {
        if (this.ruleForm.code.length === 6) {
          callback()
        } else {
          callback(new Error('验证码不正确'))
        }
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      activeIndex: '2',
      loginForm: {
        mobile: '',
        code: '',
        zheCode: ''
      },
      show: true,
      count: '',
      timer: null,
      yzmshow: false,
      ruleForm: {
        user1: '',
        pass1: '',
        pass: '',
        checkPass: '',
        zhecode: '',
        mobile: '',
        phoneCode: '',
        emailCode: '',
        code: ''
      },
      rules: {
        code: [{
          required: true,
          validator: validateCode,
          trigger: 'blur'
        },
        {
          min: 6,
          max: 6,
          message: '长度为6',
          trigger: 'blur'
        }
        ],
        user1: [{
          required: true,
          // validator: validateUser1,
          trigger: 'blur'
        }],
        pass1: [{
          required: true,
          validator: validatePass1,
          trigger: 'blur'
        }],
        // 密码
        pass: [{
          required: true,
          validator: validatePass,
          trigger: 'blur'
        },
        {
          min: 6,
          message: '长度在不少于6个字符',
          trigger: 'blur'
        }
        ],
        // 校验密码
        checkPass: [{
          required: true,
          validator: validatePass2,
          trigger: 'blur'
        },
        {
          min: 6,
          message: '长度在不少于6个字符',
          trigger: 'blur'
        }
        ]
      }
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

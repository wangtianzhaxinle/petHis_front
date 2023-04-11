
<template>
  <div>

    <el-form ref="userForm" :model="perosanlInfo" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户id" hidden>
        <el-input v-model="perosanlInfo.userid" :disabled="true" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="perosanlInfo.name" :disabled="disable" />
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="perosanlInfo.username" :disabled="true" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-image
          v-if="disable"
          style="width: 100px; height: 100px"
          :src="perosanlInfo.avatar"
        />
        <el-upload
          v-else
          ref="pictureUpload"
          class="avatar-uploader"
          action="#"
          list-type="picture-card"
          :limit="1"
          :http-request="uploadImg"
          :file-list="filelist"
          :before-upload="beforeUpload"
        >

          <i slot="default" class="el-icon-plus" />
          <div slot="file" slot-scope="{file}">
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            >
            <span class="el-upload-list__item-actions">
              <span
                class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)"
              >
                <i class="el-icon-zoom-in" />
              </span>
              <span
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete" />
              </span>

            </span>
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="perosanlInfo.age" :disabled="disable" />
      </el-form-item>
      <el-form-item label="性别" required prop="sex">
        <el-radio-group v-model="perosanlInfo.sex" :disabled="disable">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="手机号" prop="phonenumber">
        <el-input v-model.number="perosanlInfo.phonenumber" :disabled="disable" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="perosanlInfo.address" :disabled="disable" />
      </el-form-item>
      <el-form-item label="注册时间">

        <el-col :span="11">
          <el-form-item prop="date2">
            <el-date-picker v-model="perosanlInfo.createtime" placeholder="选择时间" style="width: 100%;" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="电子邮件" prop="email">
        <el-input v-model="perosanlInfo.email" :disabled="disable" />
      </el-form-item>
      <el-form-item label="是否员工">
        <el-radio-group v-model="perosanlInfo.isEmployee" :disabled="true">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="resetPassword">修改密码</el-button>
        <el-button v-if="disable===true" @click="editUserInfo">修改信息</el-button>
        <template v-else>
          <el-button @click="submitEditUser">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </template>

      </el-form-item>

    </el-form>
    <el-dialog
      :title="title"
      :visible.sync="resetPassDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form v-if="isCodeRight===false" ref="codeForm" :model="valid" :rules="coderules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="验证码" prop="code">
          <el-input v-model="valid.code" />
        </el-form-item>
        <el-form-item>
          <el-button v-if="show" type="primary" @click="getCode">获取验证码</el-button>
          <el-button v-if="!show" type="primary" :disabled="true">
            <span v-if="!show" style="color: #707070;">
              {{ count }}s后重新获取
            </span></el-button>
          <el-button type="primary" @click="submitCode">提交</el-button>

        </el-form-item>
      </el-form>

      <el-form v-else ref="resetPassForm" :model="resetPasswordModel" :rules="resetPassRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="密码" prop="password">
          <el-input v-model="resetPasswordModel.password" type="password" />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="resetPasswordModel.confirmPassword" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPassword">提交</el-button>

        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>
<script>
// import { getPersonalUserInfo } from '@/api/user'
import { mapGetters } from 'vuex'
import store from '@/store'
import { upload } from '@/api/upload'
import { updateUserById, updatePassword } from '@/api/user'
export default {
  name: 'PersoanlInfo',
  data() {
    const telCheck = (rule, value, callback) => {
      var reg = /^1[3-9]\d{9}$/

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
    var confirmPassword = (rule, value, callback) => {
      if (value !== this.resetPasswordModel.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      /* ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },*/
      baseurl: 'http://localhost:8080/petHis',
      filelist: [],
      disable: true,
      title: '修改密码',
      isCodeRight: false,
      show: true,
      count: '',
      timer: null,
      valid: {
        code: ''
      },
      resetPasswordModel: {
        password: '',
        confirmPassword: ''
      },
      resetPassDialogVisible: false,
      coderules: {
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { max: 4, min: 4, message: '验证码应为4位', trigger: 'blur' }

        ]

      },
      resetPassRules: {
        password: [
          { required: true, message: '请输入验证码', trigger: 'blur' }

        ],
        confirmPassword: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { validator: confirmPassword, trigger: 'blur' }
        ]

      },
      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' },
          { min: 3, message: '长度至少有三个字符', trigger: 'blur' }
        ],
        age: [
          { required: true, trigger: 'blur', message: '请输入年龄' },
          { type: 'number', required: true, trigger: 'blur', message: '请输入数字' },
          {
            validator(rule, value, callback) {
              if (value > 0 && value < 150) {
                callback()
              } else {
                callback(new Error('年龄范围不正确'))
              }
            },
            trigger: 'blur'
          }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ],
        phonenumber: [
          { required: true, trigger: 'blur', message: '请输入手机号码' },

          { validator: telCheck, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        avatar: [
          { required: true, message: '请选择头像', trigger: 'blur' }
        ]
      },
      // 原来data中可以直接获取到vuex的数据
      perosanlInfo: {
        userid: store.getters.userId,
        name: store.getters.name,
        avatar: store.getters.avatar,
        sex: store.getters.sex,
        age: store.getters.age,
        phonenumber: store.getters.phoneNumber,
        address: store.getters.address,
        createtime: store.getters.createtime,
        email: store.getters.email,
        username: store.getters.username,
        isEmployee: store.getters.isEmployee
      }
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'email',
      'avatar',
      'userId',
      'username',
      'sex',
      'age',
      'address',
      'email',
      'createtime',
      'phoneNumber',
      'isEmployee'
    ])
    // this.perosanlInfo.user_id = this.$store.state.user_id
    // this.perosanlInfo.name = this.$store.state.name
    // this.perosanlInfo.avatar = this.$store.state.avatar
    // this.perosanlInfo.sex = this.$store.state.sex
    // this.perosanlInfo.phoneNumber = this.$store.state.phoneNumber
    // this.perosanlInfo.address = this.$store.state.address
    // this.perosanlInfo.createtime = this.$store.state.createtime
    // this.perosanlInfo.email = this.$store.state.email
  },
  created() {
    // this.getLoginInfo()
  },

  methods: {
    handleClose(done) {
      if (!this.isCodeRight) {
        this.resetForm('codeForm')
      } else {
        this.resetForm('resetPassForm')
      }

      done()
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitPassword() {
      const data = {
        userid: this.perosanlInfo.userid,
        password: this.resetPasswordModel.password

      }
      updatePassword(data).then(async res => {
        if (res.total > 0) {
          this.isCodeRight = false
          await this.$store.dispatch('user/logout')
          this.$router.push(`/login?redirect=${this.$route.fullPath}`)
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    editUserInfo() {
      this.disable = false
    },
    submitEditUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.loading = true
          const user = this.perosanlInfo
          this.loading = true
          updateUserById(user).then(res => {
            if (res.total > 0) {
              // this.userDialogVisible = false
              // this.resetForm()
              this.loading = false
              this.cancel()
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getCode() {
      const TIME_COUNT = 60
      if (!this.timer) {
        this.count = TIME_COUNT
        this.show = false
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
    },
    submitCode() {
      this.isCodeRight = true
    },
    resetPassword() {
      this.resetPassDialogVisible = true
    },
    cancel() {
      this.disable = true
    },
    beforeUpload(file) {
      // this.progressShow = true
      // this.fake = new FakeProgress({
      //   timeConstant: 10000,
      //   autoStart: true
      // })
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 < 200
      // console.log(file.type)
      // console.log(file.size)

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 200k!')
        return false
      }
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
        return false
      }
      // console.log(isJPG && isLt2M)
      return isJPG && isLt2M
    },
    uploadImg(file) {
      var form = new FormData()
      form.append('file', file.file)

      upload(form).then(res => {
        if (res.total > 0) {
          // alert(res.message)
          if (!this.disable) { this.perosanlInfo.avatar = this.baseurl + res.data }
          if (this.empDialogVisible) { this.employee.image = this.baseurl + res.data }
          // this.fake.end()
          // console.log(this.medicine)
        }
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = this.userInfo.avatar
      this.dialogVisible = true
    },
    handleRemove(file) {
      console.log('handleRemove')
      console.log(this.filelist)
      const uploadFiles = this.$refs.pictureUpload.uploadFiles
      for (const i in uploadFiles) {
        if (file.url === uploadFiles[i].url) {
          uploadFiles.splice(i, 1)
          this.userInfo.avatar = ''
        }
      }
      console.log('handleRemove')
    }

    /* getLoginInfo() {
      this.dataSource.loading = true

       getPersonalUserInfo(user_id).then(res => {
        this.dataSource.loading = false
        // if (res.succeed) {
        if (res.total > 0) {
          this.dataSource.pageData.total = res.total
          this.dataSource.data = res.data
          console.log(res.data)
        } else {
          this.dataSource.data = []
          this.dataSource.pageData.total = 0
        }
        // }
      })
    }*/

  }

}

</script>

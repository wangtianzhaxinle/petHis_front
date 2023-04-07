
<template>
  <el-form ref="ruleForm" :model="employeePerosanlInfo" :rules="rules" label-width="100px" class="demo-ruleForm">
    <el-form-item label="姓名">
      <el-input v-model="employeePerosanlInfo.user.name" :disabled="true" />
    </el-form-item>
    <el-form-item label="图片">
      <el-avatar :src="employeePerosanlInfo.image" shape="square" :size="100" />
    </el-form-item>
    <el-form-item label="年龄">
      <el-input v-model="employeePerosanlInfo.user.age" :disabled="true" />
    </el-form-item>
    <el-form-item label="性别" required>
      <el-radio-group v-model="employeePerosanlInfo.user.sex" :disabled="true">
        <el-radio :label="1">男</el-radio>
        <el-radio :label="0">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="手机号">
      <el-input v-model="employeePerosanlInfo.user.phonenumber" :disabled="true" />
    </el-form-item>
    <el-form-item label="地址">
      <el-input v-model="employeePerosanlInfo.user.address" :disabled="true" />
    </el-form-item>
    <el-form-item label="入职时间">

      <el-col :span="11">
        <el-form-item>
          <el-date-picker v-model="employeePerosanlInfo.hiredate" placeholder="选择时间" style="width: 100%;" :disabled="true" />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="薪水">
      <el-input v-model="employeePerosanlInfo.salary" :disabled="true" />
    </el-form-item>

    <el-form-item label="银行卡">
      <el-input v-model="employeePerosanlInfo.bankcard" :disabled="true" />
    </el-form-item>

    <!-- <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>  -->

  </el-form>
</template>
<script>
import { getEmployeePersonalInfo } from '@/api/employee.js'

import store from '@/store'
export default {
  name: 'EmployeePersoanlInfo',
  data() {
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
      /* rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },*/
      // 原来data中可以直接获取到vuex的数据
      userId: store.getters.userId,
      employeePerosanlInfo: {

      }
    }
  },
  computed: {
    /* ...mapGetters([

      'user_id'

    ])*/
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
    this.getEmployeePersonalInfo()
  },

  methods: {

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
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getEmployeePersonalInfo() {
      const employee_id = this.userId
      getEmployeePersonalInfo(employee_id).then(res => {
        if (res.total > 0) {
          this.employeePerosanlInfo = res.data
          // alert('获取员工个人信息成功')
        } else {
          alert('获取员工个人信息失败')
        }
      })
    }
    // }

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


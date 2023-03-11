
<template>
  <el-form ref="ruleForm" :model="perosanlInfo" :rules="rules" label-width="100px" class="demo-ruleForm">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="name" :disabled="true" />
    </el-form-item>

    <el-form-item label="头像" prop="desc">
      <el-avatar g :src="avatar" class="user-avatar" />
    </el-form-item>

    <el-form-item label="年龄" prop="region">
      <el-input v-model="age" :disabled="true" />
    </el-form-item>
    <el-form-item label="性别" required>
      <el-radio-group v-model="sex">
        <el-radio :label="1">男</el-radio>
        <el-radio :label="0">女</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="手机号" prop="delivery">
      <el-input v-model="phoneNumber" :disabled="true" />
    </el-form-item>
    <el-form-item label="地址" prop="type">
      <el-input v-model="address" :disabled="true" />
    </el-form-item>
    <el-form-item label="注册时间" prop="resource">

      <el-col :span="11">
        <el-form-item prop="date2">
          <el-date-picker v-model="createtime" placeholder="选择时间" style="width: 100%;" :disabled="true" />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="电子邮件" prop="desc">
      <el-input v-model="email" :disabled="true" />
    </el-form-item>

    <!-- <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>  -->

  </el-form>
</template>
<script>
// import { getPersonalUserInfo } from '@/api/user'
// import { mapGetters } from 'vuex'
import store from '@/store'
export default {
  name: 'PersoanlInfo',
  data() {
    return {
      rules: {
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
      },
      // 原来data中可以直接获取到vuex的数据
      perosanlInfo: {
        userId: store.getters.userId,
        name: store.getters.name,
        avatar: store.getters.avatar,
        sex: store.getters.sex,
        phoneNumber: store.getters.phoneNumber,
        address: store.getters.address,
        createtime: store.getters.createtime,
        email: store.getters.email
      }
    }
  },
  created() {
    // this.getLoginInfo()
    this.itemId = this.$route.params.itemId
    this.getList()
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


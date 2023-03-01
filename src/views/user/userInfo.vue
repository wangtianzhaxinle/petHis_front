<template>

  <div class="app-container"> <table-pane
                                :data-source="dataSource"
                                @changeSize="changeSize"
                                @changeNum="changeNum"
                              >
                                <!-- 这里终于搞定了妈耶,查了一下午的作用于插槽,没想到是scope后面少了个row,
                              错误的:scopedata.scope.avatar
                              正确的:scopedata.scope.row.avatar -->
                                <template v-slot:avatar="scopedata">
                                  <el-image
                                    style="width: 100px; height: 100px"
                                    :src="scopedata.scope.row.avatar"
                                    :fit="fit"
                                  />
                                </template></table-pane>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="editForm" :model="userInfo" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userInfo.name" />
        </el-form-item>

        <!-- <el-form-item label="头像" prop="desc">
          <el-avatar g :src="avatar" class="user-avatar" />
        </el-form-item> -->

        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="userInfo.age" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username" />
        </el-form-item>
        <el-form-item label="性别" required>
          <el-radio-group v-model="userInfo.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="userInfo.phoneNumber" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="userInfo.address" />
        </el-form-item>
        <el-form-item label="注册时间" required>

          <el-col :span="11">
            <el-form-item prop="createtime">
              <el-date-picker v-model="createtime" placeholder="选择日期" style="width: 100%;" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="userInfo.email" />
        </el-form-item>

        <!-- <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>  -->

      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import { getUserInfoList, deleteUserById } from '@/api/user'
import tablePane from '@/components/tablePane.vue'

export default {
  name: 'UserInfo',
  components: { tablePane },

  data() {
    return {

      dialogVisible: false,
      userInfo: {
        name: '',
        age: '',
        sex: '',
        username: '',
        createtime: '',
        phoneNumber: '',
        address: '',
        email: ''

      },
      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { type: 'number', required: true, message: '请输入正确的年龄', trigger: ['blur', 'change'] }
        ],
        sex: [

          { type: 'array', message: '请选择性别', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '请选择手机号', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ], username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }

        ], createtime: [
          { required: true, message: '请选择日期', trigger: 'blur' }

        ]

      },

      // 表格配置
      dataSource: {
        tool: [{
          name: '新增用户',
          key: 1,
          permission: 2010701,
          handleClick: this.handleAdd
        },
        {
          name: '全部删除',
          key: 2,
          permission: 2010701,
          handleClick: this.handleAdd
        }
        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'id',
            prop: 'userId'

          },
          {
            label: '名字',
            prop: 'name',
            isCodeTableFormatter: function(val) { // 过滤器
              if (val.sex === 1) {
                return '男'
              } else {
                return '女'
              }
            }

          },

          {
            label: '性别',
            prop: 'sex'

          },
          {
            label: '年龄',
            prop: 'age'

          },
          {
            label: '手机号',
            prop: 'phonenumber',
            width: 300
          },
          {
            label: '地址',
            prop: 'address'
          },
          {
            label: '用户名',
            prop: 'username'
          },
          {
            label: '密码',
            prop: 'password'
          },
          {
            label: '头像',
            prop: 'avatar',
            isTemplate: true

          }, {
            label: '注册时间',
            prop: 'createtime'
          },
          {
            label: '邮箱',
            prop: 'email'
          }

        ], // 表格的列数据

        handleSelectionChange: this.handleSelectionChange,
        isSelection: true, // 表格有多选时设置
        isOperation: true, // 表格有操作列时设置
        isIndex: true, // 列表序号
        loading: true, // loading
        pageData: {
          total: 0, // 总条数
          pageSize: 10, // 每页数量
          pageNum: 1 // 页码
        },
        operation: {
          // 表格有操作列时设置
          label: '操作', // 列名
          width: '150', // 根据实际情况给宽度
          data: [
            {
              label: '删除', // 操作名称
              type: 'danger',
              permission: '2010702', // 后期这个操作的权限，用来控制权限
              handleRow: this.deleterow
            }, {
              label: '查看', // 操作名称
              type: 'info',
              permission: '2010702', // 后期这个操作的权限，用来控制权限
              handleRow: this.showrow
            },
            {
              label: '修改', // 操作名称
              type: 'warning',
              permission: '2010702', // 后期这个操作的权限，用来控制权限
              handleRow: this.editrow
            }
          ]
        }
      },
      dialogAdd: false,
      msg: {},
      selected: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum
      }

      this.dataSource.loading = true
      console.log('getAllPetInfoList')
      getUserInfoList(data).then(res => {
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
    },
    // 搜索层事件

    // 子组件通信
    childMsg(msg) {
      if (msg.dialogAdd === false) {
        this.dialogAdd = false
      } else if (msg.refreshList) {
        this.getList()
      }
    },
    // 改变每页数量
    changeSize(size) {
      this.dataSource.pageData.pageSize = size
      this.getList()
    },
    // 改变页码
    changeNum(pageNum) {
      this.dataSource.pageData.pageNum = pageNum
      this.getList()
    },
    // 多选事件
    handleSelectionChange(val) {
      this.selected = val
      console.log('调用了父组件的select方法')
      console.log(val)
    },
    //
    // 表格上方工具栏回调
    handleAdd(index, row) {
      this.dialogAdd = true
    },
    /*
    // 表格操作列回调
    handleRow(index, row, lable) {
      if (lable === '删除') {
        this.$confirm('确认删除该版本?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delVersion({ versionId: row.id }).then(res => {
            if (res.succeed) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        }).catch(() => {
        })
      }
    }
    **/
    deleterow(index, row) {
      console.log(row.id)
      this.$confirm('确认删除该用户?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //
        deleteUserById(row.userId).then(res => {
          if (res.total > 0) {
            console.log(res.data)
            console.log('删除成功')
            this.getList()
          }
        })
        //
      })
    },
    editrow(index, row) {
      this.dialogVisible = true
    }

  }
}
</script>


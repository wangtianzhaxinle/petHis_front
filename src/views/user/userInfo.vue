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
                                  />
                                </template></table-pane>

    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
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
          <el-input v-model="userInfo.phonenumber" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="userInfo.address" />
        </el-form-item>
        <el-form-item label="注册时间" required>

          <el-col :span="11">
            <el-form-item prop="createtime">
              <el-date-picker v-model="userInfo.createtime" placeholder="选择日期" style="width: 100%;" :disabled="true" />
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

    <el-dialog
      title="提示"
      :visible.sync="viewDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="editForm" :model="userInfo" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userInfo.name" :disabled="true" />
        </el-form-item>

        <el-form-item label="头像">
          <el-avatar :src="userInfo.avatar" class="user-avatar" />
        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="userInfo.age" :disabled="true" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username" :disabled="true" />
        </el-form-item>
        <el-form-item label="性别" required>
          <el-radio-group v-model="userInfo.sex" :disabled="true">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="userInfo.phonenumber" :disabled="true" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="userInfo.address" :disabled="true" />
        </el-form-item>
        <el-form-item label="注册时间" required>

          <el-col :span="11">
            <el-form-item prop="createtime">
              <el-date-picker v-model="userInfo.createtime" placeholder="选择日期" style="width: 100%;" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="userInfo.email" :disabled="true" />
        </el-form-item>

        <!-- <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>  -->

      </el-form>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
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
          <el-input v-model="userInfo.phonenumber" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="userInfo.address" />
        </el-form-item>
        <el-form-item label="注册时间" required>

          <el-col :span="11">
            <el-form-item prop="createtime">
              <el-date-picker v-model="userInfo.createtime" placeholder="选择日期" style="width: 100%;" :disabled="true" />
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

    <el-dialog
      title="角色"
      :visible.sync="roleDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-tree
        ref="roleTree"
        :data="roleData"
        highlight-current
        default-expand-all
        show-checkbox
        node-key="roleid"
        :props="defaultProps"
        @check="handleCheckChange"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">修改</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getUserInfoList, deleteUserById, deleteUserByIds } from '@/api/user'
import { getAllRoleList, getRoleByUserId, updateRoleByUserId } from '@/api/role'
import tablePane from '@/components/tablePane.vue'

export default {
  name: 'UserInfo',
  components: { tablePane },

  data() {
    return {

      editDialogVisible: false,
      addDialogVisible: false,
      viewDialogVisible: false,

      roleDialogVisible: false,
      userInfo: {
        /* name: '',
        age: '',
        sex: '',
        username: '',
        createtime: '',
        phonenumber: '',
        address: '',
        email: ''
*/
      },
      defaultProps: {
        label: 'description'
      },
      userId: '',
      roleData: {},
      roleIds: [],
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
          key: 'Adduser',
          permission: 'AddUser',
          handleClick: this.AddUser
        },
        {
          name: '全部删除',
          key: 'AllDelete',
          permission: 'AllDelete',
          handleClick: this.AllDelete
        }
        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'id',
            prop: 'userId',
            width: 30

          },
          {
            label: '名字',
            prop: 'name'

          },

          {
            label: '性别',
            prop: 'sex',
            isCodeTableFormatter: function(val) { // 过滤器
              if (val.sex === 1) {
                return '男'
              } else {
                return '女'
              }
            },
            width: 50

          },
          {
            label: '年龄',
            prop: 'age',
            width: 50

          },
          {
            label: '手机号',
            prop: 'phonenumber',
            width: 150
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
            /*,
            isCodeTableFormatter: function(time) { // 过滤器
              var date = new Date(time).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')

              return date
            }*/
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
          width: '250', // 根据实际情况给宽度
          data: [
            {
              label: '删除', // 操作名称
              type: 'danger',
              permission: 'deleteUser', // 后期这个操作的权限，用来控制权限
              handleRow: this.deleteUser
            }, {
              label: '查看角色', // 操作名称
              type: 'info',
              permission: 'viewRole', // 后期这个操作的权限，用来控制权限
              handleRow: this.viewRole
            },
            {
              label: '修改', // 操作名称
              type: 'warning',
              permission: 'editUser', // 后期这个操作的权限，用来控制权限
              handleRow: this.editUser
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
    this.getRoleList()
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.userInfo = {}
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
          this.dataSource.data = res.data.records
          console.log(res.data)
        } else {
          this.dataSource.data = []
          this.dataSource.pageData.total = 0
        }
        // }
      })
    },
    submit() {
      const data = {
        roleIds: this.roleIds,
        userId: this.userId
      }
      updateRoleByUserId(data).then(res => {
        alert(res.message)
        if (res.total > 0) {
          this.roleDialogVisible = false
        }
      })
    },
    getRoleList() {
      getAllRoleList().then(res => {
        this.roleData = res.data
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
    deleteUser(index, row) {
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
    editUser(index, row) {
      this.editDialogVisible = true
      this.userInfo = row
    },
    viewUser(index, row) {
      this.viewDialogVisible = true
      this.userInfo = row
    },
    AddUser(index, row) { // 这里粗心AddUser写成了addUser,所以一直提示handleClick不是一个方法
      this.addDialogVisible = true

      // alert(222)
    },
    viewRole(index, row) {
      this.roleDialogVisible = true
      this.userId = ''
      this.userId = row.userid
      getRoleByUserId(this.userId).then(res => {
        this.roleIds = this.getIdsFromJson(res.data)

        // console.log(this.permissionids)
        if (this.roleIds) {
          this.$nextTick(() => {
            this.$refs.roleTree.setCheckedKeys([])// 不放在这里在的话在进入页面的第一次调用时,el-tree还
            // 未渲染,此时如果不放在nextTick里面会报错找不到setCheckedKeys属性,没有默认选中效果,只有在第二次开始显示才正常
            this.roleIds.forEach(value => { // 真的大坑，我自己摸索好久！！！
              this.$refs.roleTree.setChecked(value, true, false) // 给树节点赋值
            })
            this.checkStrictly = false // 重点： 赋值完成后 设置为false
          })
        }
      })
    },
    AllDelete() {
      console.log(this.selected)
      const ids = this.selected.map((user) => user.userId)
      this.$confirm('确认删除选中的用户?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => deleteUserByIds(ids).then(res => {
        if (res.total > 0) {
          // console.log(res.data)
          alert('删除成功')
          this.getList()
        } else {
          alert('删除失败')
        }
      })
      )

      // console.log(ids)
      // alert(111)
    },
    handleCheckChange(data, checked) {
      // checked.checkedKeys  选中的节点id数组z
      // checked.halfCheckedKeys 半选中节点id数组
      this.roleIds = checked.halfCheckedKeys.concat(checked.checkedKeys) // 选中节点和半选中节点所有的id
    },
    getIdsFromJson(json) {
      // console.log(json)
      const ids = []
      if (json) {
        const array = json
        for (let i = 0; i < array.length; i++) {
          const tep = array[i].roleid
          ids.push(tep)
        }
        console.log(ids)
        return ids
      }
    }

  }
}
</script>


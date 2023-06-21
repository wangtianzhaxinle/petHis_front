<template>

  <div class="app-container">
    <div>
      <div class="filter-container">
        <el-input v-model="searchUser.name" style="width:200px" class="filter-item" placeholder="请输入名字" />
        <el-input v-model="searchUser.username" style="width:200px" class="filter-item" placeholder="请输入用户名" />
        <el-input v-model="searchUser.address" style="width:200px" class="filter-item" placeholder="请输入地址" />
        <el-select v-model="searchUser.sex" style="width:200px" class="filter-item" placeholder="性别">

          <el-option label="女" value="0" />
          <el-option label="男" value="1" />

        </el-select>
        <el-select v-model="searchUser.isEmployee" style="width:200px" class="filter-item" placeholder="是否员工">

          <el-option label="否" value="0" />
          <el-option label="是" value="1" />

        </el-select>
        <el-select v-model="searchUser.isDelete" style="width:200px" class="filter-item" placeholder="是否显示已删除用户">
          <el-option label="显示全部用户" :value="null" />
          <el-option label="显示未删除用户" value="0" />
          <el-option label="显示已删除用户" value="1" />
        </el-select>
        <div class="filter-btn">
          <el-button class="filter-item" type="primary" @click="search">
            搜索
          </el-button>
          <el-button class="filter-item" type="warning" @click="resetFilter">
            重置
          </el-button>
        </div>
      </div>

    </div>
    <table-pane
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
      </template>
      <template v-slot:operator="scopedata">

        <div class="btn">
          <el-button
            v-if="scopedata.scope.row.isDelete!==1"
            type="danger"
            size="mini"
            @click.native.prevent="deleteUser(scopedata.scope.$index, scopedata.scope.row)"
          >
            删除
          </el-button>
          <el-button

            type="warning"
            size="mini"
            @click.native.prevent="editUser(scopedata.scope.$index, scopedata.scope.row)"
          >
            修改
          </el-button>
          <el-button

            type="info"
            size="mini"
            @click.native.prevent="viewRole(scopedata.scope.$index, scopedata.scope.row)"
          >
            查看角色
          </el-button>
          <el-button
            v-if="scopedata.scope.row.isEmployee===0"
            type="info"
            size="mini"
            @click.native.prevent="addEmploye(scopedata.scope.$index, scopedata.scope.row)"
          >
            添加为员工
          </el-button>
        </div>

      </template>
    </table-pane>

    <!-- <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="editForm" :model="userInfo" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userInfo.name" />
        </el-form-item>

        <el-form-item label="头像" prop="desc">
          <el-avatar g :src="avatar" class="user-avatar" />
        </el-form-item>

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

        <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>

      </el-form>
    </el-dialog> -->

    <!-- <el-dialog
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

        <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>

      </el-form>
    </el-dialog> -->
    <el-dialog
      :title="title"
      :visible.sync="userDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="userForm" :model="userInfo" :rules="userRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户id" hidden>
          <el-input v-model="userInfo.userid" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userInfo.name" />
        </el-form-item>

        <el-form-item label="头像" prop="avatar">
          <el-upload
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

          <!-- <el-progress v-if="progressShow" :text-inside="true" :stroke-width="15" :percentage="parseInt(fake.progress*100)" status="success" /> -->

        </el-form-item>

        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="userInfo.age" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="userInfo.password" />
        </el-form-item>
        <el-form-item label="性别" required>
          <el-radio-group v-model="userInfo.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenumber">
          <el-input v-model="userInfo.phonenumber" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="userInfo.address" />
        </el-form-item>
        <el-form-item v-if="submitType==='edit'" label="注册时间" required>

          <el-col :span="11">
            <el-form-item prop="createtime">
              <el-date-picker v-model="userInfo.createtime" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input v-model="userInfo.email" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>

      </el-form>
    </el-dialog>

    <el-dialog
      title="角色"
      :visible.sync="roleDialogVisible"
      width="30%"
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
    <el-dialog
      title="加为员工"
      :visible.sync="empDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="empForm" :model="employee" :rules="empRules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户id" hidden>
          <el-input v-model="employee.userid" />
        </el-form-item>
        <el-form-item label="入职日期" required>
          <el-col :span="11">
            <el-form-item prop="hiredate">
              <el-date-picker v-model="employee.hiredate" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="照片" prop="image">

          <el-upload
            ref="pictureUpload"
            class="avatar-uploader"
            action="#"
            list-type="picture-card"
            :limit="1"
            :http-request="uploadImg"
            :file-list="filelist"
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

        <el-form-item label="薪水" prop="salary">
          <el-input v-model.number="employee.salary" />
        </el-form-item>
        <el-form-item label="银行卡" prop="bankcard">
          <el-input v-model="employee.bankcard" />
        </el-form-item>

        <el-form-item label="最大容量" prop="maxAppoint">
          <el-input v-model.number="employee.maxAppoint" />
        </el-form-item>
        <el-form-item label="身份证" prop="card">
          <el-input v-model="employee.card" />
        </el-form-item>
        <el-form-item label="籍贯" prop="nativePlace">
          <el-input v-model="employee.nativePlace" />
        </el-form-item>
        <el-form-item label="学历" prop="educationBackground">
          <el-input v-model="employee.educationBackground" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitEmpForm">提交</el-button>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>

      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

  </div>

</template>

<script>
import { getUserInfoList, deleteUserById, deleteUserByIds, addUser, updateUserById } from '@/api/user'
import { getAllRoleList, getRoleByUserId, updateRoleByUserId } from '@/api/role'
import { upload } from '@/api/upload'
// import { checkUsername } from '@/utils/validate'
import { addEmployee } from '@/api/employee'
import tablePane from '@/components/tablePane2.vue'
import rules from '@/utils/rules'
// var _this = {}
// import FakeProgress from 'fake-progress'

export default {
  name: 'UserInfo',
  components: { tablePane },

  data() {
    // const telCheck = (rule, value, callback) => {
    //   var reg = /^1[3-9]\d{9}$/
    //   // console.log(value)
    //   // console.log(Number.isInteger(value))
    //   if (!Number.isInteger(value)) {
    //     // 这里输入框必须是v-model.number不然Number.isInteger(value)结果始终为false
    //     return callback(new Error('手机号码必须是数字'))
    //   } else if (value.toString().length !== 11) {dialogVisible
    //     return callback(new Error('手机号码必须是11位数字'))
    //   } else if (!reg.test(value)) {
    //     return callback(new Error('请输入有效的手机号码'))
    //   } else {
    //     callback()
    //   }
    // }
    // var user = '777'
    return {
      title: '',
      empDialogVisible: false,
      userDialogVisible: false,
      dialogVisible: false,
      roleDialogVisible: false,
      submitType: '',
      baseurl: 'http://localhost:8080/petHis',
      filelist: [],
      progressShow: false,
      dialogImageUrl: '',
      test: '123456',
      // fake: '',
      userInfo: {
        userid: '',
        name: '',
        age: '',
        sex: '',
        username: '',
        password: '',
        createtime: '',
        phonenumber: '',
        address: '',
        email: '',
        avatar: ''

      },
      editUsername: null,
      employee: {
        hiredate: '',
        salary: '',
        bankcard: '',
        maxAppoint: '',
        card: '',
        nativePlace: '',
        educationBackground: '',
        image: '',
        userid: ''

      },
      searchUser: {
        name: null,
        username: null,
        sex: null,
        address: null,
        isEmployee: null,
        isDelete: '0'
      },

      defaultProps: {
        label: 'description'
      },
      userId: '',
      roleData: {},
      roleIds: [],
      userRules: {
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

          { validator: rules.checkPhone, trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ], username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          // {
          //   async validator(rule, value, callback) {
          //     // console.log(value)
          //     var flag = await checkUsername(value)
          //     // console.log('flag' + flag)
          //     if (!flag) {
          //       // console.log(11)
          //       console.log('用户名可用')
          //       callback()
          //     } else {
          //       console.log('用户名不可用')
          //       callback(new Error('用户名已经存在'))
          //     }
          //   },
          //   trigger: 'blur'
          // }
          { validator: (rule, value, callback) => {
            rules.checkRepeatUserName(value, callback, this.editUsername)
          }, trigger: 'blur' }

        ], createtime: [
          { required: true, message: '请选择日期', trigger: 'blur' }

        ], avatar: [
          { required: true, message: '请选择头像', trigger: 'blur' }
        ], password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]

      },
      empRules: {
        image: [
          { required: true, message: '请选择图片', trigger: 'blur' }
        ],
        hiredate: [
          { required: true, message: '请选择入职日期', trigger: 'blur' }

        ],
        salary: [
          { required: true, message: '请输入薪水', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        bankcard: [
          { required: true, trigger: 'blur', message: '请输入银行卡' }

        ],
        maxAppoint: [
          { required: true, trigger: 'blur', message: '请输入最大预约人数' },

          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        card: [

          { required: true, message: '请输入身份证', trigger: 'blur' },
          {
            validator: rules.checkIdCard, trigger: 'blur'
          }
        ],
        nativePlace: [
          { required: true, message: '请输入籍贯', trigger: 'blur' }
        ],
        educationBackground: [
          { required: true, message: '请输入学历', trigger: 'blur' }
        ]
      },

      // 表格配置
      dataSource: {
        tool: [{
          name: '新增用户',
          key: 'Adduser',

          handleClick: this.AddUser
        },
        {
          name: '批量删除',
          key: 'AllDelete',

          handleClick: this.batchDelete
        }
        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'id',
            prop: 'userid',
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
          },
          {
            label: '是否员工',
            prop: 'isEmployee',
            filter: function(val) {

            },
            isIcon: true,
            icon: function(val) {
              if (val === 1) {
                return 'el-icon-check'
              } else {
                return 'el-icon-close'
              }
            }
          },
          {
            label: '是否删除',
            prop: 'isDelete',
            filter: function(val) {

            },
            isIcon: true,
            icon: function(val) {
              if (val === 1) {
                return 'el-icon-check'
              } else {
                return 'el-icon-close'
              }
            }
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
          width: '350', // 根据实际情况给宽度
          data: [
            {
              label: '删除', // 操作名称
              type: 'danger',
              // permission: 'deleteUser', // 后期这个操作的权限，用来控制权限
              handleRow: this.deleteUser
            }, {
              label: '查看角色', // 操作名称
              type: 'info',
              // permission: 'viewRole', // 后期这个操作的权限，用来控制权限
              handleRow: this.viewRole
            },
            {
              label: '修改', // 操作名称
              type: 'warning',
              // permission: 'editUser', // 后期这个操作的权限，用来控制权限
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
  //  _this = this
  },
  methods: {
    resetFilter() {
      this.searchUser.name = null
      this.searchUser.username = null
      this.searchUser.address = null
      this.searchUser.sex = null
      this.searchUser.isEmployee = null
      this.searchUser.isDelete = '0'
    },
    search() {
      this.getList()
    },

    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum,
        name: this.searchUser.name,
        username: this.searchUser.username,
        address: this.searchUser.address,
        sex: this.searchUser.sex,
        isEmployee: this.searchUser.isEmployee,
        isDelete: this.searchUser.isDelete
      }

      this.dataSource.loading = true
      console.log('getAllPetInfoList')
      getUserInfoList(data).then(res => {
        this.dataSource.loading = false
        // if (res.succeed) {
        if (res.total > 0) {
          this.dataSource.pageData.total = res.total
          this.dataSource.data = res.data.records
          // console.log(res.data)
          this.getRoleList()
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
        // alert(res.message)
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
    handleCheckChange(data, checked) {
      // checked.checkedKeys  选中的节点id数组z
      // checked.halfCheckedKeys 半选中节点id数组
      this.roleIds = checked.halfCheckedKeys.concat(checked.checkedKeys) // 选中节点和半选中节点所有的id
    },

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
      console.log(row.userid)
      this.$confirm('确认删除该用户?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //
        deleteUserById(row.userid).then(res => {
          if (res.total > 0) {
            console.log(res.data)
            // console.log('删除成功')
            this.getList()
          }
        })
        //
      })
    },
    editUser(index, row) {
      this.userDialogVisible = true
      this.title = '修改用户信息'
      this.submitType = 'edit'
      this.editUsername = row.username
      this.$nextTick(() => {
        // 赋值
        this.userInfo = JSON.parse(JSON.stringify(row))
        this.userInfo.password = null
        // console.log(this.medicine)
        this.filelist.push({ 'url': this.userInfo.avatar })
      })
    },
    AddUser(index, row) { // 这里粗心AddUser写成了addUser,所以一直提示handleClick不是一个方法
      this.filelist = []
      this.userInfo = {}
      this.userDialogVisible = true
      this.title = '添加用户'
      this.submitType = 'add'

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
    batchDelete() {
      // console.log(this.selected)
      const ids = this.selected.map((user) => user.userid)
      this.$confirm('确认删除选中的用户?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => deleteUserByIds(ids).then(res => {
        if (res.total > 0) {
          // console.log(res.data)
          // alert('删除成功')
          this.getList()
        } else {
          // alert('删除失败')
        }
      })
      )
    },
    addEmploye(index, row) {
      this.empDialogVisible = true
      this.$nextTick(() => { this.employee.userid = row.userid })
    },
    handleClose(done) {
      this.resetForm()
      // 这里userid未绑定rules的prop无法用resetField重置

      done()
    },
    resetForm() {
      if (this.userDialogVisible === true) {
        this.$refs.userForm.resetFields()
        this.userInfo = {}
        this.editUsername = null
      }
      if (this.empDialogVisible === true) {
        // alert(666)
        this.$refs.empForm.resetFields()
        this.employee.userid = ''
      }

      this.$refs.pictureUpload.clearFiles()
      // this.userInfo.userid = ''

      this.filelist = []// 不加这行,在修改时删掉原先图片在上传新的图片,提交成功后,再点击修改进去表单会发现有两张图片
    },

    submitForm() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.loading = true
          const user = this.userInfo

          if (this.submitType === 'add') {
            addUser(user).then(res => {
            // alert(this.$route.path)
              if (res.total > 0) {
                this.userDialogVisible = false
                this.resetForm()
                // this.$router.go(0)
                // this.$router.push({ path: this.$route.path || '/' })
                this.loading = false
                this.getList()
              }
            }).catch(() => {
              this.loading = false
            })
          } else if (this.submitType === 'edit') {
            this.loading = true

            updateUserById(user).then(res => {
            // alert(this.$route.path)
              if (res.total > 0) {
                this.userDialogVisible = false
                this.resetForm()
                // this.$router.go(0)
                // this.$router.push({ path: this.$route.path || '/' })
                this.loading = false
                this.getList()
              }
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitEmpForm() {
      this.$refs.empForm.validate(valid => {
        if (valid) {
          this.loading = true
          const data = {
            hiredate: this.employee.hiredate,
            salary: this.employee.salary,
            bankcard: this.employee.bankcard,
            maxappoint: this.employee.maxAppoint,
            card: this.employee.card,
            nativeplace: this.employee.nativePlace,
            educationbackground: this.employee.educationBackground,
            userid: this.employee.userid,
            image: this.employee.image
          }
          addEmployee(data).then(res => {
            if (res.total > 0) {
              this.empDialogVisible = false
              this.resetForm()
              this.loading = false
              this.getList()
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          this.$message.error('表单验证不通过')
          return false
        }
      })
    },
    beforeUpload(file) {
      // this.progressShow = true
      // this.fake = new FakeProgress({
      //   timeConstant: 10000,
      //   autoStart: true
      // })
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 < 200
      console.log(file.type)
      console.log(file.size)

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
          if (this.userDialogVisible) { this.userInfo.avatar = this.baseurl + res.data }
          if (this.empDialogVisible) { this.employee.image = this.baseurl + res.data }
          this.fake.end()
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
          this.employee.image = ''
        }
      }
      console.log('handleRemove')
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
<style  scoped lang='scss'>
.filter-item{
  margin-left: 10px;
  display: inline-block;
}
.filter-container .filter-item:nth-of-type(1){
  margin-left: 0px;
}
.filter-btn{
  display: inline-block;
  margin-left: 10px;
}
</style>


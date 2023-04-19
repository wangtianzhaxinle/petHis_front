<template>
  <div class="app-container">
    <div>
      <div class="filter-container">
        <el-input v-model="searchEmployee.user.name" style="width:200px" class="filter-item" placeholder="请输入名字" />
        <el-input v-model="searchEmployee.nativeplace" style="width:200px" class="filter-item" placeholder="请输入籍贯" />
        <el-input v-model="searchEmployee.user.address" style="width:200px" class="filter-item" placeholder="请输入地址" />

        <el-select v-model="searchEmployee.user.sex" style="width:200px" class="filter-item" placeholder="性别">

          <el-option label="女" value="0" />
          <el-option label="男" value="1" />

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
    > <template v-slot:image="data">
      <el-image
        style="width: 100px; height: 100px"
        :src="data.scope.row.image"
      />
    </template>

    </table-pane>
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
        <el-button type="primary" @click="submitRoleList">修改</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="empDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="empForm" :model="employee" :rules="empRules" label-width="100px" class="demo-ruleForm">

        <el-form-item v-if="submitType==='edit'" label="用户" prop="userid">
          <el-input v-model="employee.userid" />
        </el-form-item>
        <el-form-item v-if="submitType==='add'" label="用户id" prop="userid">
          <el-select
            v-model="employee.userid"
            filterable

            placeholder="请输入用户名"
          >
            <el-option
              v-for="item in options"
              :key="item.userid"
              :label="item.name"
              :value="item.userid"
            />
          </el-select>

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
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <!-- <el-dialog
      :title="title"
      :visible.sync="empDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form ref="userEmpForm" :inline="true" :model="useremployee" :rules="empRules" label-width="100px" class="demo-ruleForm">
        <er-row>
        <el-form-item label="头像" prop="user.avatar">
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
        </el-form-item>
        <el-form-item label="照片" prop="employee.image">
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
        </er-row>
        <er-row>

          <el-col :span="12">

            <el-form-item label="用户id">
              <el-input v-model="useremployee.user.userid" />
            </el-form-item>
            <el-form-item label="姓名" prop="user.name">
              <el-input v-model="useremployee.user.name" />
            </el-form-item>

            <el-form-item label="年龄" prop="user.age">
              <el-input v-model.number="useremployee.user.age" />
            </el-form-item>
            <el-form-item label="用户名" prop="user.username">
              <el-input v-model="useremployee.user.username" />
            </el-form-item>

            <el-form-item label="密码" prop="user.password">
              <el-input v-model="useremployee.user.password" />
            </el-form-item>
            <el-form-item label="性别" prop="user.sex">
              <el-radio-group v-model="useremployee.user.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机号" prop="user.phonenumber">
              <el-input v-model.number="useremployee.user.phonenumber" />
            </el-form-item>
            <el-form-item label="地址" prop="user.address">
              <el-input v-model="useremployee.user.address" />
            </el-form-item>
            <el-form-item v-if="submitType==='edit'" label="注册时间" required>

              <el-col :span="11">
                <el-form-item prop="user.createtime">
                  <el-date-picker v-model="useremployee.user.createtime" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="电子邮件" prop="user.email">
              <el-input v-model="useremployee.user.email" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="用户id" prop="employee.userid">
              <el-input v-model="useremployee.employee.userid" />
            </el-form-item>
            <el-form-item label="入职日期" required>
              <el-col :span="11">
                <el-form-item prop="employee.hiredate">
                  <el-date-picker v-model="useremployee.employee.hiredate" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>
              </el-col>
            </el-form-item>

            <el-form-item label="薪水" prop="employee.salary">
              <el-input v-model.number="useremployee.employee.salary" />
            </el-form-item>
            <el-form-item label="银行卡" prop="employee.bankcard">
              <el-input v-model="useremployee.employee.bankcard" />
            </el-form-item>

            <el-form-item label="最大容量" prop="employee.maxAppoint">
              <el-input v-model.number="useremployee.employee.maxAppoint" />
            </el-form-item>
            <el-form-item label="身份证" prop="employee.card">
              <el-input v-model="useremployee.employee.card" />
            </el-form-item>
            <el-form-item label="籍贯" prop="employee.nativePlace">
              <el-input v-model="useremployee.employee.nativePlace" />
            </el-form-item>
            <el-form-item label="学历" prop="employee.educationBackground">
              <el-input v-model="useremployee.employee.educationBackground" />
            </el-form-item>

          </el-col>

        </er-row>

        <el-form-item>
          <el-button type="primary" @click="submitEmpForm">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog> -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>

import { getEmployeeList, addEmployee, updateEmployeeById, deleteEmployeeById, deleteEmployeeByIds } from '@/api/employee.js'
import { getUserInfoList } from '@/api/user'

import tablePane from '@/components/tablePane.vue'
import { getAllRoleList, getRoleByUserId, updateRoleByUserId } from '@/api/role'
import { upload } from '@/api/upload'
// import { checkUsername } from '@/utils/validate'

export default {
  name: 'EmployeeInfo',
  components: { tablePane },
  data() {
    return {
      userId: '',
      roleIds: [],
      roleData: {},
      filelist: [],
      options: [],
      roleDialogVisible: false,
      title: '',
      empDialogVisible: false,
      userEmpDialogVisible: false,
      submitType: '',
      userlodading: '',
      employee: {},
      dialogImageUrl: '',
      dialogVisible: false,
      baseurl: 'http://localhost:8080/petHis',
      useremployee: {
        user: {},
        employee: {}
      },
      defaultProps: {
        label: 'description'
      },
      searchEmployee: {
        user: {
          name: null,
          address: null,
          sex: null
        },
        nativeplace: null

      },
      empRules: {

        image: [
          { required: true, message: '请选择图片', trigger: 'blur' }
        ],
        userid: [
          { required: true, message: '请选择用户', trigger: 'blur' }
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

          { required: true, message: '请输入身份证', trigger: 'blur' }
        ],
        nativePlace: [
          { required: true, message: '请输入籍贯', trigger: 'blur' }
        ],
        educationBackground: [
          { required: true, message: '请输入学历', trigger: 'blur' }
        ]

      },
      // 搜索栏配置

      // 表格配置
      dataSource: {
        tool: [
          // {
          //   name: '将用户添加为员工',
          //   key: 'addEmployee',
          //   // permission: 'addEmployee',
          //   handleClick: this.addEmployee
          // },
          {
            name: '添加员工',
            key: 'addEmployee',
            // permission: 'addEmployee',
            handleClick: this.addEmployee
          },
          {
            name: '批量删除',
            key: 'batchDelete',
            // permission: 'batchDeleteEmployee',
            handleClick: this.batchDelete
          }
        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'id',
            prop: 'employeeid',
            width: 100
          },
          {
            label: '名字',
            prop: 'user.name',
            width: 100
          },
          {
            label: '照片',
            prop: 'image',
            width: 100,
            isTemplate: true
          },
          {
            label: '身份证',
            prop: 'card',
            width: 150

          },
          {
            label: '籍贯',
            prop: 'nativeplace',
            width: 170

          },
          {
            label: '学历',
            prop: 'educationbackground',
            width: 100

          },
          {
            label: '性别',
            prop: 'user.sex',
            width: 60,
            isCodeTableFormatter: function(val) { // 过滤器
              if (val.sex === 1) {
                return '男'
              } else {
                return '女'
              }
            }

          },

          {
            label: '手机号',
            prop: 'user.phonenumber',
            width: 130
          },
          {
            label: '地址',
            prop: 'user.address'
          },

          {
            label: '入职时间',
            prop: 'hiredate'
          },

          {
            label: '薪水',
            prop: 'salary'
          },

          {
            label: '银行卡',
            prop: 'bankcard',
            width: 150
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
              // permission: 'deleteRow', // 后期这个操作的权限，用来控制权限
              handleRow: this.deleteEmployee
            },
            {
              label: '修改', // 操作名称
              type: 'warning',
              // permission: 'editRow', // 后期这个操作的权限，用来控制权限
              handleRow: this.editEmployee
            },
            {
              label: '查看角色', // 操作名称
              type: 'info',
              // permission: 'viewRole', // 后期这个操作的权限，用来控制权限
              handleRow: this.viewRole
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
    resetFilter() {
      this.searchEmployee.user.name = null
      this.searchEmployee.user.address = null
      this.searchEmployee.user.sex = null
      this.searchEmployee.nativeplace = null
      this.getList()
    },
    search() {
      this.getList()
    },
    handleClose(done) {
      // this.userInfo = {}
      this.resetForm()
      done()
    },
    resetForm() {
      // if (this.roleDialogVisible) {

      // }
      if (this.empDialogVisible) {
        this.$refs.empForm.resetFields()
        // 这里userid未绑定rules的prop无法用resetField重置
        this.employee = {}
        this.$refs.pictureUpload.clearFiles()
        // this.userInfo.userid = ''
        this.filelist = []
      }
    },

    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum,
        user: {
          name: this.searchEmployee.user.name,
          address: this.searchEmployee.user.address,
          sex: this.searchEmployee.user.sex
        },
        nativeplace: this.searchEmployee.nativeplace
      }
      this.dataSource.loading = true
      // console.log('getAllPetInfoList')
      getEmployeeList(data).then(res => {
        this.dataSource.loading = false
        // if (res.succeed) {
        if (res.total > 0) {
          this.dataSource.pageData.total = res.total
          this.dataSource.data = res.data
          this.getRoleList()
          this.getUserByNoEmployee()
          // console.log(res.data)
        } else {
          this.dataSource.data = []
          this.dataSource.pageData.total = 0
        }
        // }
      })
    },
    getRoleList() {
      getAllRoleList().then(res => {
        this.roleData = res.data
      })
    },
    // remoteMethod(query) {
    //   if (query !== '') {
    //     this.loading = true
    //     setTimeout(() => {
    //       this.userlodading = false
    //       const data = { name: query, isEmployee: 0 }
    //       getUserInfoList(data).then(res => {
    //         if (res.total > 0) {
    //           this.options = res.data.records
    //         } else {
    //           this.options = []
    //         }
    //       })
    //     }, 200)
    //   } else {
    //     const data = { name: null, isEmployee: 0 }
    //     getUserInfoList(data).then(res => {
    //       if (res.total > 0) {
    //         this.options = res.data.records
    //       } else {
    //         this.options = []
    //       }
    //     })
    //   }
    // },
    getUserByNoEmployee() {
      const data = { name: null, isEmployee: 0 }
      getUserInfoList(data).then(res => {
        if (res.total > 0) {
          this.options = res.data.records
        } else {
          this.options = []
        }
      })
    },
    submitEmpForm() {
      this.$refs.empForm.validate(valid => {
        if (valid) {
          this.loading = true
          const employee = this.employee
          if (this.submitType === 'add') {
            addEmployee(employee).then(res => {
              if (res.total > 0) {
                this.resetForm()
                this.petDialogVisible = false
                this.loading = false
                this.getList()
              }
            }).catch(() => {
              this.loading = false
            })
          } else if (this.submitType === 'edit') {
            this.loading = true
            updateEmployeeById(employee).then(res => {
              if (res.total > 0) {
                this.resetForm()
                this.petDialogVisible = false
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
    addEmployee() {
      this.title = '添加员工'
      this.empDialogVisible = true
      this.submitType = 'add'
      this.filelist = []
      this.employee = {}
    },
    // addUserEmployee() {
    //   this.title = '添加员工'
    //   this.userEmpDialogVisible = true
    //   this.submitType = 'add'
    // },
    editEmployee(index, row) {
      this.title = '修改员工'
      this.empDialogVisible = true
      this.submitType = 'edit'

      this.$nextTick(() => {
        // 赋值
        this.employee = JSON.parse(JSON.stringify(row))
        this.filelist.push({ 'url': this.employee.image })
      })
    },
    batchDelete() {
      const ids = this.selected.map((employee) => employee.userid)
      deleteEmployeeByIds(ids).then(res => {
        if (res.total > 0) {
          this.getList()
        }
      })
    },
    deleteEmployee(index, row) {
      const data = {
        userid: row.userid
      }
      deleteEmployeeById(data).then(res => {
        if (res.total > 0) {
          this.getList()
        }
      })
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
    },
    submitRoleList() {
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
    // 图片上传
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
          // this.fake.end()
          // console.log(this.medicine)
        }
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = this.employee.image
      this.dialogVisible = true
    },
    handleRemove(file) {
      console.log('handleRemove')
      console.log(this.filelist)
      const uploadFiles = this.$refs.pictureUpload.uploadFiles
      for (const i in uploadFiles) {
        if (file.url === uploadFiles[i].url) {
          uploadFiles.splice(i, 1)
          this.employee.image = ''
        }
      }
      console.log('handleRemove')
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
    }
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


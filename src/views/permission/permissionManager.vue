<template>

  <div class="app-container">
    <div>
      <div class="filter-container">
        <el-input v-model="searchPermission.name" style="width:200px" class="filter-item" placeholder="请输入权限名" />
        <el-input v-model="searchPermission.url" style="width:200px" class="filter-item" placeholder="请输入url" />
        <el-input v-model="searchPermission.permissionCode" style="width:200px" class="filter-item" placeholder="请输入权限码" />
        <el-input v-model="searchPermission.type" style="width:200px" class="filter-item" placeholder="请输入类型" />
        <el-select v-model="searchPermission.parentid" style="width:200px" class="filter-item" placeholder="请选择父权限">
          <el-option label="全部" :value="-1" />
          <el-option
            v-for=" i in options"
            :key="i.permissionid"
            :label="i.name"
            :value="i.permissionid"
          />

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
    />
    <el-dialog
      :title="title"
      :visible.sync="perDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="PermissionForm" :model="permission" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="permissionId" hidden>
          <el-input v-model="permission.permissionid" />
        </el-form-item>

        <el-form-item label="权限名" prop="name">
          <el-input v-model="permission.name" />
        </el-form-item>

        <el-form-item label="url" prop="url">
          <el-input v-model="permission.url" />

        </el-form-item>

        <el-form-item label="父权限">
          <el-select v-model="permission.parentid" placeholder="请选择" @change="$forceUpdate()">

            <el-option
              v-for=" i in options"
              :key="i.permissionid"
              :label="i.name"
              :value="i.permissionid"
            />

          </el-select>

        </el-form-item>

        <el-form-item label="权限码" prop="permissioncode">
          <el-input v-model="permission.permissioncode" />
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-input v-model="permission.type" />

        </el-form-item>
        <el-form-item>

          <el-button type="primary" @click="submitForm()">提交</el-button>

        </el-form-item>

      </el-form>
    </el-dialog>

  </div>

</template>

<script>
import { getPermissionList, deletePermissionById, deletePermissionByIds, getFatherPermissionList, updatePermissionById, addPermission } from '@/api/permission'

import tablePane from '@/components/tablePane.vue'

export default {
  name: 'PermissionInfo',
  components: { tablePane },

  data() {
    return {

      /*

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
*/
      title: '',
      perDialogVisible: false,
      options: [],
      permission: {},
      submitType: '',
      searchPermission: {
        name: null,
        url: null,
        permissionCode: null,
        type: null,
        parentid: -1
      },
      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入url', trigger: 'blur' }

        ],
        parentid: [
          { }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        permissioncode: [
          { required: true, message: '请输入权限码', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入类型', trigger: 'blur' }
        ]
      },
      // 表格配置
      dataSource: {
        tool: [{
          name: '新增权限',
          key: 'AddPermission',
          // permission: 'AddPermission',
          handleClick: this.AddPermission
        },
        {
          name: '全部删除',
          key: 'AllDeletePermission',
          // permission: 'AllDeletePermission',
          handleClick: this.AllDeletePermission
        }
        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'id',
            prop: 'permissionid',
            width: 70

          },
          {
            label: '名字',
            prop: 'name',
            width: 200
          },

          {
            label: 'url',
            prop: 'url',

            width: 150

          },
          // {
          //   label: 'parentid',
          //   prop: 'parentid',
          //   width: 100

          // },
          {
            label: '父权限',
            prop: 'parentPermission.name',
            width: 150,
            isCodeTableFormatter: function(val) { // 过滤器
              if (val.parentPermission === null) {
                return '无父权限'
              } else {
                return val.parentPermission.name
              }
            }

          },
          {
            label: 'permissioncode',
            prop: 'permissioncode',
            width: 200
          },

          {
            label: 'type',
            prop: 'type'

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
              //  permission: 'deletePermission', // 后期这个操作的权限，用来控制权限
              handleRow: this.deletePermission
            },
            {
              label: '修改', // 操作名称
              type: 'warning',
              //   permission: 'editPermission', // 后期这个操作的权限，用来控制权限
              handleRow: this.editPermission
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
      this.searchPermission.name = null
      this.searchPermission.url = null
      this.searchPermission.permissionCode = null
      this.searchPermission.type = null
      this.searchPermission.parentid = -1
    },
    search() {
      this.getList()
    },
    AddPermission() {
      this.title = '添加权限'
      this.perDialogVisible = true
      this.submitType = 'add'
      this.permission = {}
      this.permission.parentid = this.options[0].permissionid
    },
    editPermission(index, row) {
      this.title = '修改权限'
      this.perDialogVisible = true
      this.submitType = 'edit'
      this.permission = JSON.parse(JSON.stringify(row))
    },
    submitForm() {
      this.$refs.PermissionForm.validate(valid => {
        if (valid) {
          this.loading = true
          const permissionData = this.permission

          if (this.submitType === 'add') {
            addPermission(permissionData).then(res => {
            // alert(this.$route.path)
              // alert(res.message)
              this.perDialogVisible = false
              this.resetForm()

              this.loading = false
              this.getList()
            }).catch(() => {
              this.loading = false
            })
          } else if (this.submitType === 'edit') {
            this.loading = true
            const permissionData = this.permission

            updatePermissionById(permissionData).then(res => {
            // alert(this.$route.path)
              // alert(res.message)
              this.perDialogVisible = false
              // this.resetForm()
              // this.$router.go(0)
              // this.$router.push({ path: this.$route.path || '/' })
              this.loading = false
              this.getList()
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
    getFatherPermissionList() {
      getFatherPermissionList().then(res => {
        if (res.total > 0) {
          this.options = []
          this.options.push({ name: '无父权限', permissionid: null })
          this.options = this.options.concat(res.data)
        }
      })
    },
    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum,
        name: this.searchPermission.name,
        url: this.searchPermission.url,
        permissionCode: this.searchPermission.permissionCode,
        type: this.searchPermission.type,
        parentid: this.searchPermission.parentid
      }

      this.dataSource.loading = true
      console.log('getAllPetInfoList')
      getPermissionList(data).then(res => {
        this.dataSource.loading = false
        // if (res.succeed) {
        if (res.total > 0) {
          this.dataSource.pageData.total = res.total
          this.dataSource.data = res.data
          this.getFatherPermissionList()
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

    deletePermission(index, row) {
      console.log(row.id)
      this.$confirm('确认删除该权限?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //
        deletePermissionById(row.permissionid).then(res => {
          if (res.total > 0) {
            console.log(res.data)
            console.log('删除成功')
            this.getList()
          }
        })
        //
      })
    }, AllDeletePermission() {
      // console.log(this.selected)
      const ids = this.selected.map((permission) => permission.permissionid)
      this.$confirm('确认删除选中的用户?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => deletePermissionByIds(ids).then(res => {
        if (res.total > 0) {
          // console.log(res.data)
          // alert('删除成功')
          this.getList()
        } else {
          // alert('删除失败')
        }
      })
      )
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

<template>

  <div class="app-container"> <table-pane
                                :data-source="dataSource"
                                @changeSize="changeSize"
                                @changeNum="changeNum"
                              />

    <el-dialog
      title="权限"
      :visible.sync="perDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-tree
        ref="permissionTree"
        :data="permData"
        highlight-current
        default-expand-all
        show-checkbox
        node-key="permissionid"
        :props="defaultProps"

        @check="handleCheckChange"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提交</el-button>
      <!-- <el-button @click="resetForm('addMedicineForm')">重置</el-button> -->
      </div>

    </el-dialog>

    <el-dialog
      :title="title"
      :visible.sync="roleDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="RoleForm" :model="role" :rule="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="roleId" hidden>
          <el-input v-model="role.roleid" />
        </el-form-item>

        <el-form-item label="角色名" prop="name">
          <el-input v-model="role.name" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="role.description" />

        </el-form-item>
        <el-form-item>

          <el-button type="primary" @click="submitForm()">提交</el-button>

        </el-form-item>

      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import { getRoleList, deleteRoleById, getPermissionByRoleId, updatePermissionByRoleId, addRole, updateRoleByRoleId } from '@/api/role'
import { getPermissionTree } from '@/api/permission'

import tablePane from '@/components/tablePane.vue'

export default {
  name: 'RoleInfo',
  components: { tablePane },

  data() {
    return {
      permData: [],
      perDialogVisible: false,
      defaultProps: {
        children: 'childrenPermission',
        label: 'name'
      },
      permissionids: [],
      roleId: '',
      title: '',
      roleDialogVisible: false,
      role: {

      },
      submitType: '',

      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }

        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }

        ]

      },

      // 表格配置
      dataSource: {
        tool: [{
          name: '新增角色',
          key: 'AddRole',
          permission: 'AddRole',
          handleClick: this.AddRole
        },
        {
          name: '全部删除',
          key: 'AllDeleteRole',
          permission: 'AllDeleteRole',
          handleClick: this.AllDeleteRole
        }
        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'id',
            prop: 'roleid',
            width: 100

          },
          {
            label: '名字',
            prop: 'name'

          },

          {
            label: '描述',
            prop: 'description'

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
          width: '300', // 根据实际情况给宽度
          data: [
            {
              label: '删除', // 操作名称
              type: 'danger',
              permission: 'deleteRole', // 后期这个操作的权限，用来控制权限
              handleRow: this.deleteRole
            },
            {
              label: '修改', // 操作名称
              type: 'warning',
              permission: 'editRole', // 后期这个操作的权限，用来控制权限
              handleRow: this.editRole
            },
            {
              label: '查看权限', // 操作名称
              type: 'warning',
              permission: 'viewPermission', // 后期这个操作的权限，用来控制权限
              handleRow: this.viewPermission
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
          // this.resetForm()
          done()
        })
        .catch(_ => {})
    },
    submit() {
      // alert('提交')
      const data = {
        permissionids: this.permissionids,
        roleId: this.roleId
      }
      updatePermissionByRoleId(data).then(res => {
        alert(res.message)
        if (res.total > 0) {
          this.perDialogVisible = false
        }
      })
    },
    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum
      }

      this.dataSource.loading = true
      console.log('getAllPetInfoList')
      getRoleList(data).then(res => {
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
      getPermissionTree().then(res => {
        if (res.total > 0) {
          this.permData = res.data
        }
      })
    },
    AddRole() {
      this.roleDialogVisible = true
      this.submitType = 'add'
      this.title = '添加角色'
      this.role = {}
    },
    editRole(index, row) {
      this.roleDialogVisible = true
      this.submitType = 'edit'
      this.title = '修改角色'
      this.role = JSON.parse(JSON.stringify(row))
    },

    submitForm() {
      this.$refs.RoleForm.validate(valid => {
        if (valid) {
          this.loading = true
          const data = this.role
          if (this.submitType === 'add') {
            addRole(data).then(res => {
              alert(res.message)
              if (res.total > 0) {
                this.roleDialogVisible = false
                this.getList()
              }
            })
          } else if (this.submitType === 'edit') {
            updateRoleByRoleId(data).then(res => {
              alert(res.message)
              if (res.total > 0) {
                this.roleDialogVisible = false
                this.getList()
              }
            })
          }
        } else {
          console.log('submit error')
        }
      }
      )
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

    deleteRole(index, row) {
      // console.log(row.id)
      this.$confirm('确认删除该角色?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //
        deleteRoleById(row.roleid).then(res => {
          if (res.total > 0) {
            console.log(res.data)
            console.log('删除成功')
            this.getList()
          }
        })
        //
      })
    },
    viewPermission(index, row) {
      this.perDialogVisible = true
      // this.$refs.permissionTree.setCheckedKeys([])
      this.roleId = ''
      this.roleId = row.roleid
      getPermissionByRoleId(row.roleid).then(res => {
        console.log(res.data)
        this.permissionids = this.getIdsFromJson(res.data)

        // console.log(this.permissionids)
        if (this.permissionids) {
          this.$nextTick(() => {
            this.$refs.permissionTree.setCheckedKeys([])// 不放在这里在的话在进入页面的第一次调用时,el-tree还
            // 未渲染,此时如果不放在nextTick里面会报错找不到setCheckedKeys属性,没有默认选中效果,只有在第二次开始显示才正常
            this.permissionids.forEach(value => { // 真的大坑，我自己摸索好久！！！
              this.$refs.permissionTree.setChecked(value, true, false) // 给树节点赋值
            })
            this.checkStrictly = false // 重点： 赋值完成后 设置为false
          })
        }
      })
    },
    handleCheckChange(data, checked) {
      // checked.checkedKeys  选中的节点id数组z
      // checked.halfCheckedKeys 半选中节点id数组
      this.permissionids = checked.halfCheckedKeys.concat(checked.checkedKeys) // 选中节点和半选中节点所有的id
    },
    editUser(index, row) {
      this.editDialogVisible = true
      this.userInfo = row
    },
    AddUser(index, row) { // 这里粗心AddUser写成了addUser,所以一直提示handleClick不是一个方法
      this.addDialogVisible = true

      // alert(222)
    }, /*
    AllDeletePermission() {
      // console.log(this.selected)
      const ids = this.selected.map((permission) => permission.permissionid)
      this.$confirm('确认删除选中的用户?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => deletePermissionByIds(ids).then(res => {
        if (res.total > 0) {
          // console.log(res.data)
          alert('删除成功')
          this.getList()
        } else {
          alert('删除失败')
        }
      })
      )
    },*/
    getIdsFromJson(json) {
      // console.log(json)
      const ids = []
      if (json) {
        const array = json
        for (let i = 0; i < array.length; i++) {
          const tep = array[i].permissionid
          ids.push(tep)
        }
        console.log(ids)
        return ids
      }
    }

  }
}
</script>


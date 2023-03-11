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
      />
    </el-dialog>
  </div>

</template>

<script>
import { getRoleList, deleteRoleById, getPermissionByRoleId } from '@/api/role'
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
      // 表格配置
      dataSource: {
        tool: [{
          name: '新增权限',
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
      this.$confirm('确认删除该用户?', '温馨提示', {
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
      this.$refs.permissionTree.setCheckedKeys([])
      getPermissionByRoleId(row.roleid).then(res => {
        console.log(res.data)
        this.permissionids = this.getIdsFromJson(res.data)

        // console.log(this.permissionids)
        if (this.permissionids) {
          this.$nextTick(() => {
            this.permissionids.forEach(value => { // 真的大坑，我自己摸索好久！！！
              this.$refs.permissionTree.setChecked(value, true, false) // 给树节点赋值
            })
            this.checkStrictly = false // 重点： 赋值完成后 设置为false
          })
        }
      })
    },
    editUser(index, row) {
      this.editDialogVisible = true
      this.userInfo = row
    },
    AddUser(index, row) { // 这里粗心AddUser写成了addUser,所以一直提示handleClick不是一个方法
      this.addDialogVisible = true

      // alert(222)
    },
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
    },
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


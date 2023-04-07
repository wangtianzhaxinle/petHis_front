<template>
  <div>
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
        <el-button type="primary" @click="submit">修改</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { getEmployeeList } from '@/api/employee.js'
import tablePane from '@/components/tablePane.vue'
import { getAllRoleList, getRoleByUserId, updateRoleByUserId } from '@/api/role'

export default {
  name: 'EmployeeInfo',
  components: { tablePane },
  data() {
    return {
      userId: '',
      roleIds: [],
      roleData: {},

      roleDialogVisible: false,
      defaultProps: {
        label: 'description'
      },
      // 搜索栏配置

      // 表格配置
      dataSource: {
        tool: [{
          name: '新增员工',
          key: 'addEmployee',
          // permission: 'addEmployee',
          handleClick: this.addEmployee
        },
        {
          name: '批量删除',
          key: 'batchDeleteEmployee',
          // permission: 'batchDeleteEmployee',
          handleClick: this.batchDeleteEmployee
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
            label: '性别',
            prop: 'user.sex',
            width: 100

          },

          {
            label: '手机号',
            prop: 'user.phonenumber',
            width: 300
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
            prop: 'bankcard'
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
              handleRow: this.deleteRow
            },
            {
              label: '修改', // 操作名称
              type: 'warming',
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
    this.getRoleList()
  },
  methods: {
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
    handleClose(done) {
      // this.userInfo = {}
      done()
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
    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum
      }

      this.dataSource.loading = true
      console.log('getAllPetInfoList')
      getEmployeeList(data).then(res => {
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
    addEmployee() {

    },
    editEmployee() {

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


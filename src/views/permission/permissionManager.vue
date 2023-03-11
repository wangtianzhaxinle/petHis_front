<template>

  <div class="app-container"> <table-pane
    :data-source="dataSource"
    @changeSize="changeSize"
    @changeNum="changeNum"
  />

  </div>

</template>

<script>
import { getPermissionList, deletePermissionById, deletePermissionByIds } from '@/api/permission'

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
      // 表格配置
      dataSource: {
        tool: [{
          name: '新增权限',
          key: 'AddPermission',
          permission: 'AddPermission',
          handleClick: this.AddPermission
        },
        {
          name: '全部删除',
          key: 'AllDeletePermission',
          permission: 'AllDeletePermission',
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
            prop: 'name'

          },

          {
            label: 'url',
            prop: 'url',

            width: 150

          },
          {
            label: 'parentid',
            prop: 'parentid',
            width: 100

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
              permission: 'deletePermission', // 后期这个操作的权限，用来控制权限
              handleRow: this.deletePermission
            },
            {
              label: '修改', // 操作名称
              type: 'warning',
              permission: 'editPermission', // 后期这个操作的权限，用来控制权限
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

    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum
      }

      this.dataSource.loading = true
      console.log('getAllPetInfoList')
      getPermissionList(data).then(res => {
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

    deletePermission(index, row) {
      console.log(row.id)
      this.$confirm('确认删除该用户?', '温馨提示', {
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
    },
    editUser(index, row) {
      this.editDialogVisible = true
      this.userInfo = row
    },
    AddUser(index, row) { // 这里粗心AddUser写成了addUser,所以一直提示handleClick不是一个方法
      this.addDialogVisible = true

      // alert(222)
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
          alert('删除成功')
          this.getList()
        } else {
          alert('删除失败')
        }
      })
      )
    }

  }
}
</script>


<template>
  <table-pane
    :data-source="dataSource"
    @changeSize="changeSize"
    @changeNum="changeNum"
  />

</template>

<script>

import { getEmployeeList } from '@/api/employee.js'
import tablePane from '@/components/tablePane.vue'

export default {
  name: 'EmployeeInfo',
  components: { tablePane },
  data() {
    return {
      // 搜索栏配置

      // 表格配置
      dataSource: {
        tool: [{
          name: '新增员工',
          key: 'addEmployee',
          permission: 'addEmployee',
          handleClick: this.addEmployee
        },
        {
          name: '批量删除',
          key: 'batchDeleteEmployee',
          permission: 'batchDeleteEmployee',
          handleClick: this.batchDeleteEmployee
        }
        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'id',
            prop: 'employeeId',
            width: 100
          },
          {
            label: '名字',
            prop: 'name',
            width: 100
          },

          {
            label: '性别',
            prop: 'sex',
            width: 100

          },

          {
            label: '手机号',
            prop: 'phone',
            width: 300
          },
          {
            label: '地址',
            prop: 'address'
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
          width: '100', // 根据实际情况给宽度
          data: [
            {
              label: '删除', // 操作名称
              type: 'danger',
              permission: 'deleteRow', // 后期这个操作的权限，用来控制权限
              handleRow: this.deleteRow
            },
            {
              label: '修改', // 操作名称
              type: 'warming',
              permission: 'editRow', // 后期这个操作的权限，用来控制权限
              handleRow: this.editRow
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


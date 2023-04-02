<template>
  <table-pane
    :data-source="dataSource"
    @changeSize="changeSize"
    @changeNum="changeNum"
  />

</template>

<script>

import { getAppointList, getAppointPersonalInfo } from '@/api/appoint'
import tablePane from '@/components/tablePane.vue'
import store from '@/store'

export default {
  name: 'ApponitInfo',
  components: { tablePane },
  data() {
    return {
      userId: store.getters.userId,
      // 搜索栏配置

      // 表格配置
      dataSource: {
        tool: [
          {
            name: '批量删除',
            key: 'batchDeleteApponit',
            permission: 'batchDeleteApponit',
            handleClick: this.batchDeleteApponit
          }
        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'appointid',
            prop: 'appointid',
            width: 100
          },
          {
            label: 'itemId',
            prop: 'itemid',
            width: 100
          },

          {
            label: 'userId',
            prop: 'userId',
            width: 100

          },

          {
            label: 'employeeId',
            prop: 'employeeid',
            width: 300
          },
          {
            label: 'status',
            prop: 'status'
          },

          {
            label: 'appointtime',
            prop: 'appointTime'
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
      console.log('getAppointList')
      getAppointList(data).then(res => {
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
    getAppointPersonalInfo() {
      getAppointPersonalInfo(this.userId).then(res => {

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

  }
}
</script>


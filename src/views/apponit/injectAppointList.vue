<template>
  <div>  <table-pane
    :data-source="dataSource"
    @changeSize="changeSize"
    @changeNum="changeNum"
  />

  </div>

</template>

<script>

import { getAppointListByEmpAndItem, getAppointPersonalInfo, addCheck } from '@/api/appoint'
import tablePane from '@/components/tablePane.vue'
import store from '@/store'
import { getMedicineListByName } from '@/api/medicine'
import { getToken } from '@/utils/auth'

export default {
  name: 'CheckApponitList',
  components: { tablePane },
  data() {
    return {
      userId: store.getters.userId,
      DialogVisible: false,
      medicineListVisible: false,

      // 搜索栏配置

      // 表格配置
      dataSource: {
        tool: [
        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'appointid',
            prop: 'appointid',
            width: 100
          },
          {
            label: 'itemid',
            prop: 'itemid',
            width: 100
          },
          {
            label: '宠物名',
            prop: 'pet.name',
            width: 100
          },

          {
            label: '主人名',
            prop: 'user.name',
            width: 100

          },

          {
            label: 'employeeId',
            prop: 'employeeid',
            width: 100
          },
          {
            label: 'status',
            prop: 'status'
          },

          {
            label: '预约看病时间',
            prop: 'appointdate'
          },
          {
            label: '下单时间',
            prop: 'createtime'
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
              label: '挂起', // 操作名称
              type: 'info',
              permission: 'deleteRow', // 后期这个操作的权限，用来控制权限
              handleRow: this.deleteRow
            },
            {
              label: '诊断', // 操作名称
              type: 'info',
              permission: 'diagnose', // 后期这个操作的权限，用来控制权限
              handleRow: this.diagnose
            },
            {
              label: '提醒', // 操作名称
              type: 'info',
              permission: 'deleteRow', // 后期这个操作的权限，用来控制权限
              handleRow: this.deleteRow
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
    // this.init()
  },
  methods: {

    handleClose(done) {
      this.presecibe.presecibeTable = []
      done()
    },
    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum,
        itemid: 3,
        employeeid: this.userId
      }

      this.dataSource.loading = true
      console.log('getAppointList')
      getAppointListByEmpAndItem(data).then(res => {
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
    init: function() {
      if (typeof (WebSocket) === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        var token = getToken()
        // 实例化socket
        this.socket = new WebSocket('ws://localhost:8080/petHis/webSocket?token=' + token)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open: function() {
      console.log('socket连接成功')
    },
    error: function() {
      console.log('连接错误')
    },
    // 接收服务器发来的消息
    getMessage: function(e) {
      // console.log(e.data)
      this.medicineTable = JSON.parse(e.data)
    },
    // 给服务器发消息的方法
    send: function() {
      this.socket.send(this.parms)
    },
    close: function() {
      console.log('socket已经关闭')
    }

  }
}
</script>


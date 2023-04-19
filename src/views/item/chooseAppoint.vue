<template>

  <el-tabs
    v-model="menuTabsValue"
    type="card"
    @tab-click="handleClick"
  >
    <el-tab-pane
      v-for="item in menuTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >

      <div class="app-container">
        <table-pane
          :data-source="dataSource"
          @changeSize="changeSize"
          @changeNum="changeNum"
        > <template v-slot:image="scopedata">
            <el-image
              style="width: 100px; height: 100px"
              :src="scopedata.scope.row.image"
            />
          </template>
          <template v-slot:operator="scopedata">

            <div
              class="btn"
            >

              <div v-if="scopedata.scope.row.maxAppoint>scopedata.scope.row.nowAppoint">
                <el-button
                  type="info"
                  size="mini"
                  @click.native.prevent="choose(scopedata.scope.$index, scopedata.scope.row)"
                >
                  预约
                </el-button></div>

            </div>

          </template>
        </table-pane>
        <el-dialog
          title="预约"
          :visible.sync="appointDialogVisible"
          width="30%"
          append-to-body
        >
          <el-form ref="appointForm" :model="appoint" :rules="rules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="employeeid" hidden>
              <el-input v-model="appoint.employeeid" />
            </el-form-item>
            <el-form-item label="itemid" hidden>
              <el-input v-model="appoint.itemid" />
            </el-form-item>
            <el-form-item label="预约时间">
              <el-input v-model="appoint.appointdate" disabled />
            </el-form-item>
            <el-form-item label="你的宠物" prop="petid">
              <el-select v-model="appoint.petid" placeholder="请选择">
                <el-option
                  v-for=" i in options"
                  :key="i.petid"
                  :label="i.name"
                  :value="i.petid"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm">提交</el-button>
              <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
            </el-form-item>

          </el-form>
        </el-dialog>
      </div>
    </el-tab-pane>

  </el-tabs>
</template>
<script>

import tablePane from '@/components/tablePane2.vue'
import { getEmployeeByDate } from '@/api/employee'
import { getToken } from '@/utils/auth'
import { getPetListByUserId } from '@/api/pet'
import { addAppoint, getAppointNumber } from '@/api/appoint'
import moment from 'moment'
import store from '@/store'
import 'moment/locale/zh-cn'

export default {
  name: 'ChooseAppoint',
  components: { tablePane },

  data() {
    return {

      itemid: '',
      roleid: '',
      userId: store.getters.userId,
      appointDialogVisible: false,
      options: [],
      appoint: {
        itemid: '',
        petid: '',
        employeeid: '',
        appointdate: moment().add(1, 'days').format('L')
      },
      menuTabsValue: moment().add(1, 'days').format('L'),
      menuTabs: [
        {
          title: moment().add(1, 'days').format('L'),
          name: moment().add(1, 'days').format('L')

        },
        {
          title: moment().add(2, 'days').format('L'),
          name: moment().add(2, 'days').format('L')

        },
        {
          title: moment().add(3, 'days').format('L'),
          name: moment().add(3, 'days').format('L')

        }

      ],
      rules: {
        petid: [
          { required: true, message: '请选择宠物', trigger: 'change' }
        ]
      },
      // 表格配置
      dataSource: {
        tool: [
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
            isTemplate: true

          },
          {
            label: '性别',
            prop: 'user.sex',
            width: 100,
            isCodeTableFormatter: function(val) { // 过滤器
              if (val.sex === 1) {
                return '男'
              } else {
                return '女'
              }
            }

          },
          {
            label: '最大预约人数',
            prop: 'maxAppoint',
            width: 200

          },
          {
            label: '当前预约人数',
            prop: 'nowAppoint',
            width: 200

          },

          {
            label: '入职时间',
            prop: 'hiredate'
          },

          {
            label: '学历',
            prop: 'educationbackground'
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
          width: '200', // 根据实际情况给宽度
          data: [
            {
              label: '选择', // 操作名称
              type: 'info',
              // permission: '2010702', // 后期这个操作的权限，用来控制权限
              handleRow: this.choose
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
    this.itemid = this.$route.query.itemid
    this.roleid = this.$route.query.roleid
    if (typeof (this.itemid) === 'undefined' || typeof (this.roleid) === 'undefined') {
      this.$router.push({ path: '/itemManager/itemInfo' })
    } else {
      moment.updateLocale()
      this.getList(this.menuTabsValue)
      this.getYourPetList()
      this.init()
    }
    //  this.getList()
    // moment.updateLocale('zh-cn')
  },
  mounted() {
    // window.mainPage = this
    // this.init()
  },

  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
      // console.log(tab.name)
      this.getList(tab.name)
      this.appoint.appointdate = tab.name
    },
    getYourPetList() {
      // console.log('getRoleList')
      const data = {
        pageSize: -1,
        pageNum: -1,
        userId: this.userId

      }
      getPetListByUserId(data).then(res => {
        // alert(res.mesage)
        this.options = res.data
      })
    },
    // 获取列表数据
    getList(appointtime) {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum,
        roleId: this.roleid,
        appointtime: appointtime
      }
      this.dataSource.loading = true
      console.log('getItemInfoList')
      getEmployeeByDate(data).then(res => {
        this.dataSource.loading = false
        // if (res.succeed) {
        if (res.total > 0) {
          this.dataSource.pageData.total = res.total
          this.dataSource.data = res.data
          const ids = res.data.map((employee) => employee.employeeid)
          // console.log(this.menuTabsValue)
          // console.log(ids)
          console.log('getList')
          console.log(ids)
          const appointNumberData = {
            ids: ids,
            date: this.menuTabsValue
          }
          console.log(appointNumberData.ids)
          getAppointNumber(appointNumberData).then(res => {
            if (res.total > 0) {
              // console.log(res.data)
              this.updateNowAppoint(res.data)
            }
            console.log('getAppointNumber error')
          })
        } else {
          this.dataSource.data = []
          this.dataSource.pageData.total = 0
        }
        // }
      })
    },
    updateNowAppoint(newAppointNumber) {
      const data = this.dataSource.data

      for (var i = 0; i < newAppointNumber.length; i++) {
        for (var j = 0; j < data.length; j++) {
          if (newAppointNumber[i].employeeid === data[j].employeeid) {
            // console.log('更新预约人数')
            // console.log(newAppointNumber[i].employeeid)
            this.dataSource.data[j].nowAppoint = newAppointNumber[i].nowAppoint
          }
        }
      }
    },
    choose(index, row) {
      this.appointDialogVisible = true
      this.appoint.employeeid = row.employeeid
      this.appoint.itemid = this.itemid
    },
    submitForm() {
      const data = this.appoint
      addAppoint(data).then(res => {
        if (res.total > 0) {
          // alert(res.message)
          this.appointDialogVisible = false
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
    init: function() {
      if (typeof (WebSocket) === 'undefined') {
        alert('您的浏览器不支持socket')
      } else {
        var token = getToken()
        // 实例化socket
        this.socket = new WebSocket('ws://localhost:8080/petHis/webSocket/' + this.userId + '?token=' + token)
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
      const ids = this.dataSource.data.map((employee) => employee.employeeid)
      // console.log(this.menuTabsValue)
      console.log('onmessage')
      const appointNumberData = {
        ids: ids,
        date: this.menuTabsValue
      }
      console.log(e)
      // this.medicineTable = JSON.parse(e.data)
      getAppointNumber(appointNumberData).then(res => {
        if (res.total > 0) {
          console.log(res.data)
          this.updateNowAppoint(res.data)
        }
      })
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


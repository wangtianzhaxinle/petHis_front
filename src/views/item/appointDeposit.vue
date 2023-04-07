<template>

  <div class="app-container">
    <table-pane
      :data-source="dataSource"
      @changeSize="changeSize"
      @changeNum="changeNum"
    >
      <template v-slot:operator="scopedata">

        <div class="btn">
          <el-button
            v-if="scopedata.scope.row.status===0"
            type="info"
            size="mini"
            @click.native.prevent="choose(scopedata.scope.$index, scopedata.scope.row)"
          >

            预约
          </el-button>
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
        <el-form-item label="itemid">
          <el-input v-model="appoint.itemid" />
        </el-form-item>
        <el-form-item label="roomid">
          <el-input v-model="appoint.roomid" />
        </el-form-item>
        <el-form-item label="appointdate">

          <el-select v-model="appoint.appointdate" placeholder="请选择时间">
            <el-option
              v-for=" i in DateOptions"
              :key="i.date"
              :label="i.date"
              :value="i.date"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="托管时间/天">
          <el-input v-model.number="appoint.deposittime" />
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
          <el-button type="primary" @click="submitForm">立即创建</el-button>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>

</template>
<script>

import tablePane from '@/components/tablePane2.vue'
import { getPetListByUserId } from '@/api/pet'
import { addDeposit } from '@/api/appoint'

import { getRoomList } from '@/api/room'
import moment from 'moment'
import 'moment/locale/zh-cn'
import store from '@/store'
export default {
  name: 'ApponitDesposit',
  components: { tablePane },

  data() {
    return {
      userId: store.getters.userId,
      roomid: '',
      itemid: 1,
      appoint: {
        itemid: 1,
        petid: '',
        roomid: '',
        appointdate: '',
        deposittime: ''
      },
      options: [
      ],
      DateOptions: [
        { date: moment().add(1, 'days').format('L') },
        { date: moment().add(2, 'days').format('L') },
        { date: moment().add(3, 'days').format('L') }

      ],

      appointDialogVisible: false,
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
            prop: 'roomid',
            width: 100
          },
          {
            label: '名字',
            prop: 'name',
            width: 100
          },

          {
            label: '状态',
            prop: 'status',
            width: 100,

            isCodeTableFormatter: function(val) {
              if (val.status === 0) {
                return '未使用'
              } else if (val.status === 1) {
                return '已预订'
              } else if (val.status === 2) {
                return '使用中'
              } else if (val.status === 3) {
                return '已超时'
              }
            }

          },
          {
            label: '宠物id',
            prop: 'petid',
            width: 100

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
              permission: '2010702', // 后期这个操作的权限，用来控制权限
              handleRow: this.apponitDoctor
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
    // this.itemId = this.$route.params.itemId
    //  this.getList()
    // moment.updateLocale('zh-cn')
    moment.updateLocale()
    this.getYourPetList()
    this.getList()
  },
  methods: {
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
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum

      }
      this.dataSource.loading = true
      console.log('getItemInfoList')
      getRoomList(data).then(res => {
        this.dataSource.loading = false

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
    choose(index, row) {
      // alert(666)
      this.appointDialogVisible = true
      // this.appoint.employeeid = row.employeeid
      this.appoint.itemid = this.itemid
      this.appoint.roomid = row.roomid
    },
    submitForm() {
      const data = this.appoint

      addDeposit(data).then(res => {
        if (res.total > 0) {
          alert(res.message)
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
    }
    //

  }
}

</script>


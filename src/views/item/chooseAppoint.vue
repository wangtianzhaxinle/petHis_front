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
        />
        <el-dialog
          title="预约"
          :visible.sync="appointDialogVisible"
          width="30%"
          append-to-body
        >
          <el-form ref="appointForm" :model="appoint" :rules="rules" label-width="100px" class="demo-ruleForm">
            <el-form-item label="employeeid">
              <el-input v-model="appoint.employeeid" />
            </el-form-item>
            <el-form-item label="itemid">
              <el-input v-model="appoint.itemid" />
            </el-form-item>
            <el-form-item label="appointdate">
              <el-input v-model="appoint.appointdate" />
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
    </el-tab-pane>

  </el-tabs>
</template>
<script>

import tablePane from '@/components/tablePane.vue'
import { getEmployeeByDate } from '@/api/employee'

import { getPetListByUserId } from '@/api/pet'
import { addAppoint } from '@/api/appoint'
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
            label: '性别',
            prop: 'user.sex',
            width: 100

          },

          {
            label: '容量',
            prop: 'maxappoint',
            width: 100

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
      this.$router.go(-1)
    } else {
      moment.updateLocale()
      this.getList(this.menuTabsValue)
      this.getYourPetList()
    }
    //  this.getList()
    // moment.updateLocale('zh-cn')
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
          console.log(res.data)
        } else {
          this.dataSource.data = []
          this.dataSource.pageData.total = 0
        }
        // }
      })
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


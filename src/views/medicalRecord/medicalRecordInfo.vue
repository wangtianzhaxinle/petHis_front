<template>

  <div class="app-container">
    <table-pane
      :data-source="dataSource"
      @changeSize="changeSize"
      @changeNum="changeNum"
    >
      <!-- <template v-slot:operator="scopedata">
        <div class="btn">
          <el-button

            type="info"
            size="mini"
            @click.native.prevent="editRoom(scopedata.scope.$index, scopedata.scope.row)"
          >

            修改
          </el-button>
          <el-button

            type="info"
            size="mini"
            @click.native.prevent="deleteRoom(scopedata.scope.$index, scopedata.scope.row)"
          >

            删除
          </el-button>
        </div>

      </template> -->

    </table-pane>
    <!-- <el-dialog
      title="预约"
      :visible.sync="appointDialogVisible"
      width="30%"
      append-to-body
    >
      <el-form ref="appointForm" :model="appoint" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="itemid">
          <el-input />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">立即创建</el-button>
         <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog> -->
  </div>

</template>
<script>

import tablePane from '@/components/tablePane2.vue'

// import moment from 'moment'
import 'moment/locale/zh-cn'
import store from '@/store'
import { getMedicalRecordList } from '@/api/medicalRecord'
export default {
  name: 'MedicalRecordinfo',
  components: { tablePane },

  data() {
    return {
      userId: store.getters.userId,
      appointDialogVisible: false,

      // 表格配置
      dataSource: {
        tool: [

        ],
        data: [], // 表格数据
        cols: [
          {
            label: '病历id',
            prop: 'medicalrecordid',
            width: 100
          },
          {
            label: '宠物id',
            prop: 'pet.petid',
            width: 100
          },
          {
            label: '预约id',
            prop: 'appointid',
            width: 100

          },

          {
            label: '宠物名',
            prop: 'pet.name',
            width: 100

          },
          {
            label: '医生id',
            prop: 'appoint.employeeid',
            width: 100

          },
          {
            label: '医生名',
            prop: 'emp.name',
            width: 200
          },
          {
            label: '病史',
            prop: 'medicalhistory',
            width: 200
          },

          {
            label: '诊断',
            prop: 'diagnose',
            width: 200
          },
          {
            label: '就诊时间',
            prop: 'visittime',
            width: 200
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
              //  permission: '2010702', // 后期这个操作的权限，用来控制权限
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
    // moment.updateLocale()

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
      console.log('getMedicalRecordList')
      getMedicalRecordList(data).then(res => {
        this.dataSource.loading = false

        if (res.total > 0) {
          this.dataSource.pageData.total = res.total
          this.dataSource.data = res.data
          // console.log(res.data)
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
    }
    //

  }
}

</script>


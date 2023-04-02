<template>
  <div>  <table-pane
           :data-source="dataSource"
           @changeSize="changeSize"
           @changeNum="changeNum"
         >
           <template v-slot:operator="scopedata">

             <div v-if="scopedata.scope.row.itemid===2" class="btn">
               <el-button
                 type="info"
                 size="mini"
                 @click.native.prevent="diagnose(scopedata.scope.$index, scopedata.scope.row)"
               >
                 诊断
               </el-button>

               <el-button
                 type="danger"
                 size="mini"
               >
                 下载
               </el-button>

               <el-button
                 type="success"
                 size="mini"
               >
                 提醒
               </el-button>
             </div>

             <div v-else class="btn">
               <el-button
                 type="info"
                 size="mini"
               >
                 办理
               </el-button>

               <el-button
                 type="success"
                 size="mini"
               >
                 提醒
               </el-button>
             </div>

           </template>

         </table-pane>
    <el-dialog
      title="诊断"
      :visible.sync="DialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-form ref="diagnoseForm" :model="diagnoseModel" label-width="100px" class="demo-ruleForm">
        <el-form-item label="petid" prop="namedicalHistoryme">
          <el-input v-model="diagnoseModel.petid" />
        </el-form-item>
        <el-form-item label="employeeid" prop="namedicalHistoryme">
          <el-input v-model="diagnoseModel.employeeid" />
        </el-form-item>
        <el-form-item label="病史" prop="medicalHistoryme">
          <el-input v-model="diagnoseModel.medicalHistory" type="textarea" />
        </el-form-item>

        <el-form-item label="诊断" prop="diagnose">
          <el-input v-model="diagnoseModel.diagnose" type="textarea" />
        </el-form-item>

        <!-- <el-form-item>
            <el-button type="primary" @click="submitForm">添加</el-button>

          </el-form-item> -->
      </el-form>

      <el-form :inline="true" :model="selectMedicineModel" class="demo-form-inline">
        <el-form-item label="药名">
          <el-input v-model="selectMedicineModel.name" placeholder="药名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="selectmedicinme">查询</el-button>
        </el-form-item>
      </el-form>

      <!--form表单设置 label-width="100px"会导致表单项输入框前面留出100px的位置,导致输入框右移,会在el-form-item__content 位置添加style="margin-left: 100px;" -->
      <el-form ref="presecibeForm" :model="presecibe">
        <el-table v-if="presecibe.presecibeTable.length>0" :data="presecibe.presecibeTable" border style="width: 100%" :highlight-current-row="true">
          <el-table-column label="id" width="70" prop="medicineid" align="left">
            <!-- <template slot-scope="scope">
                <el-form-item :prop="medicineid" labe="id">
                  <el-input v-model="scope.row.medicineid" readonly="true" />
                </el-form-item>
              </template> -->
          </el-table-column>

          <el-table-column label="药名" width="200" prop="name" show-overflow-tooltip>
            <!-- <template slot-scope="scope">
                <el-form-item :prop="name">
                  <el-input v-model="scope.row.name" readonly="true" />
                </el-form-item>
              </template> -->
          </el-table-column>

          <el-table-column label="价格" width="100" prop="price">
            <!-- <template slot-scope="scope">
                <el-form-item :prop="price">
                  <el-input v-model="scope.row.price" readonly="true" />
                </el-form-item>
              </template> -->
          </el-table-column>

          <el-table-column label="库存" width="250" prop="amount">
            <!-- <template slot-scope="scope">
                <el-form-item :prop="amount">
                  <el-input v-model="scope.row.amount" readonly="true" />
                </el-form-item>
              </template> -->
          </el-table-column>

          <el-table-column label="是否处方药" width="250" prop="isprescription">
            <!-- <template slot-scope="scope">
                <el-form-item :prop="isprescription">
                  <el-input v-model="scope.row.isprescription" readonly="true" style="{border: none}" />
                </el-form-item>
              </template> -->
          </el-table-column>

          <el-table-column label="数量" width="250" prop="count">
            <template slot-scope="scope">
              <el-form-item>
                <el-input v-model="scope.row.count" style="{border: none}" />
              </el-form-item>
            </template>
          </el-table-column>

        </el-table>

      </el-form>

      <el-dialog
        width="70%"
        title="药品列表"
        :visible.sync="medicineListVisible"

        append-to-body
      >
        <el-table
          :data="medicineTable"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            label="药名"
            width="180"
          />
          <el-table-column
            prop="price"
            label="价格"
            width="180"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column
            prop="isprescription"
            label="是否处方药"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.isprescription===1">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="operate"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"
                @click="chooseMedicine(scope.$index, scope.row)"
              >选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRecord">提交</el-button>

      </div>
    </el-dialog>
  </div>

</template>

<script>

import { getAppointListByEmp, getAppointPersonalInfo, addCheck } from '@/api/appoint'
import tablePane from '@/components/tablePane2.vue'
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

      diagnoseModel: {
      },
      selectMedicineModel: {
        name: ''
      },
      medicineTable: [],

      presecibe: {

        presecibeTable: []
      },
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
          //   {
          //     label: 'itemid',
          //     prop: 'itemid',
          //     width: 100
          //   },
          {
            label: '项目名',
            prop: 'item.name',
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

          //   {
          //     label: 'employeeId',
          //     prop: 'employeeid',
          //     width: 100
          //   },
          {
            label: '员工名',
            prop: 'emp.name',
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
    diagnose(index, row) {
      this.DialogVisible = true
      this.diagnoseModel.petid = row.petid
      this.diagnoseModel.employeeid = row.employeeid
    },
    submitForm() {
      const data = {

        petid: this.diagnoseModel.petid,
        employeeid: this.diagnoseModel.employeeid,
        medicalHistoryme: this.diagnoseModel.medicalHistoryme,
        diagnose: this.diagnoseModel.diagnose,
        medicineList: this.presecibe.presecibeTable

      }
      console.log(data)
    },
    selectmedicinme() {
      this.medicineListVisible = true
      getMedicineListByName(this.selectMedicineModel.name).then(res => {
        this.medicineTable = res.data
      })
    },
    chooseMedicine(index, row) {
      const presecibeMedicne = JSON.parse(JSON.stringify(row))
      presecibeMedicne['count'] = ''
      console.log(presecibeMedicne)
      const map = new Map()
      this.presecibe.presecibeTable.push(presecibeMedicne)
      const qc = this.presecibe.presecibeTable.filter(key => !map.has(key.medicineid) && map.set(key.medicineid, key.medicineid)) // 这里对name属性进行去重
      this.presecibe.presecibeTable = qc
    },
    handleClose(done) {
      this.presecibe.presecibeTable = []
      done()
    },
    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum,
        employeeid: this.userId
      }

      this.dataSource.loading = true
      console.log('getAppointList')
      getAppointListByEmp(data).then(res => {
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
    submitRecord() {
      addCheck().then(res => {
        if (res.total > 0) {
          alert(res.message)
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

<style lang="scss" scoped>

.btn{
 display: flex;
 justify-content: center;
}
.btn div{
 margin-left: 5px;
}

</style>

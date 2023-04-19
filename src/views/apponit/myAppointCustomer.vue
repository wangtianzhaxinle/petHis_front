<template>
  <div>
    <!-- <div>
      <div class="filter-container">

        <el-select v-model="searchAppoint.status" style="width:200px" class="filter-item" placeholder="预约状态">
          <el-option label="未确定" value="0" />
          <el-option label="已确定" value="1" />
          <el-option label="爽约" value="2" />
          <el-option label="已完成" value="3" />
          <el-option label="已取消" value="4" />
          <el-option label="进行中" value="5" />
        </el-select>
        <div class="filter-btn">
          <el-button class="filter-item" type="primary" @click="search">
            搜索
          </el-button>
          <el-button class="filter-item" type="warning" @click="resetFilter">
            重置
          </el-button>
        </div>
      </div>

    </div> -->
    <table-pane
      :data-source="dataSource"
      @changeSize="changeSize"
      @changeNum="changeNum"
    >
      <template v-slot:operator="scopedata">

        <div v-if="scopedata.scope.row.itemid===2" class="btn">
          <el-button
            v-if="scopedata.scope.row.status===1"
            type="success"
            size="mini"
            @click.native.prevent=" diagnoses(scopedata.scope.$index, scopedata.scope.row)"
          >
            诊断
          </el-button>
          <el-button
            v-if="scopedata.scope.row.status===5"
            type="success"
            size="mini"
            @click.native.prevent="addMedicalRecord(scopedata.scope.$index, scopedata.scope.row)"
          >
            写病历
          </el-button>
          <!-- <el-button
            v-if="scopedata.scope.row.status===3"
            type="warning"
            size="mini"
            @click.native.prevent="editMedicalRecord(scopedata.scope.$index, scopedata.scope.row)"
          >
            修改病历
          </el-button> -->
          <el-button
            v-if="scopedata.scope.row.status===5"
            type="success
                 "
            size="mini"
            @click.native.prevent="addPrescribeList(scopedata.scope.$index, scopedata.scope.row)"
          >
            开药
          </el-button>
          <el-button
            v-if="scopedata.scope.row.status===5"
            type="danger"
            size="mini"
            @click.native.prevent="endDiagnoses(scopedata.scope.$index, scopedata.scope.row)"
          >
            结束
          </el-button>

          <el-button
            v-if="scopedata.scope.row.status===3"
            type="danger"
            size="mini"
            @click.native.prevent="printMedicalRecord(scopedata.scope.$index, scopedata.scope.row)"
          >
            打印病历
          </el-button>

          <el-button
            v-if="scopedata.scope.row.status===1"
            type="success"
            size="mini"
            @click.native.prevent="remind(scopedata.scope.$index, scopedata.scope.row)"
          >
            提醒
          </el-button>
        </div>

        <div
          v-if="scopedata.scope.row.itemid===3"
          class="btn"
        >
          <el-button
            v-if="scopedata.scope.row.status===1"
            type="success"
            size="mini"
            @click.native.prevent="finishInjection(scopedata.scope.$index, scopedata.scope.row)"
          >
            办理
          </el-button>

          <el-button
            v-if="scopedata.scope.row.status===1"
            type="success"
            size="mini"
            @click.native.prevent="remind(scopedata.scope.$index, scopedata.scope.row)"
          >
            提醒
          </el-button>
        </div>

      </template>

    </table-pane>
    <el-dialog
      title="开药"
      :visible.sync="prescribeDialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-form ref="addMedicineForm" :inline="true" :model="prescribe" :rules="addMedicineRules" class="demo-form-inline">
        <el-form-item v-show="false" label="appointid">
          <el-input v-model="prescribe.appointId" placeholder="appointid" />
        </el-form-item>
        <el-form-item v-show="false" label="员工id" :hidden="true">
          <el-input v-model="prescribe.employeeid" placeholder="药品id" />
        </el-form-item>
        <el-form-item v-show="false" label="药品id" hidden>
          <el-input v-model="prescribe.medicineid" placeholder="药品id" />
        </el-form-item>

        <el-form-item label="药名" prop="medicineName" hidden>
          <el-input v-model="prescribe.medicineName" placeholder="药名" />
        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model.number="prescribe.count" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="selectmedicinme">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addMedicine">添加</el-button>
        </el-form-item>
      </el-form>

      <!--form表单设置 label-width="100px"会导致表单项输入框前面留出100px的位置,导致输入框右移,会在el-form-item__content 位置添加style="margin-left: 100px;" -->
      <el-form ref="presecibeForm" :model="presecibeList">
        <el-table v-if="presecibeList.presecibeTable.length>0" :data="presecibeList.presecibeTable" border :highlight-current-row="true">
          <el-table-column label="id" width="70" prop="medicineid" align="left">
            <!-- <template slot-scope="scope">
                <el-form-item :prop="medicineid" labe="id">
                  <el-input v-model="scope.row.medicineid" readonly="true" />
                </el-form-item>
              </template> -->
          </el-table-column>

          <el-table-column label="药名" width="200" prop="medicineName" show-overflow-tooltip>
            <!-- <template slot-scope="scope">
                <el-form-item :prop="name">
                  <el-input v-model="scope.row.name" readonly="true" />
                </el-form-item>
              </template> -->
          </el-table-column>

          <!-- <el-table-column label="价格" width="100" prop="price">
            <template slot-scope="scope">
                <el-form-item :prop="price">
                  <el-input v-model="scope.row.price" readonly="true" />
                </el-form-item>
              </template>
          </el-table-column> -->

          <!-- <el-table-column label="库存" width="250" prop="amount">
            <template slot-scope="scope">
                <el-form-item :prop="amount">
                  <el-input v-model="scope.row.amount" readonly="true" />
                </el-form-item>
              </template>
          </el-table-column> -->

          <!-- <el-table-column label="是否处方药" width="250" prop="isprescription">
            <template slot-scope="scope">
                <el-form-item :prop="isprescription">
                  <el-input v-model="scope.row.isprescription" readonly="true" style="{border: none}" />
                </el-form-item>
              </template>
          </el-table-column> -->

          <el-table-column label="数量" width="250" prop="count">
            <!-- <template slot-scope="scope">
              <el-form-item>
                <el-input v-model="scope.row.count" style="{border: none}" />
              </el-form-item>
            </template> -->
          </el-table-column>

          <el-table-column label="操作" width="250">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="deletePrescribe(scope.$index, scope.row)"
              >删除
              </el-button>
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
            prop="amount"
            label="实际库存"
            align="center"
          />
          <el-table-column
            prop="nowAmount"
            label="当前库存"
            align="center"
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
        <el-button type="primary" @click="submitPrescribeList">提交</el-button>

      </div>
    </el-dialog>

    <el-dialog
      :title="title"
      :visible.sync="dignoseDialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-form ref="diagnoseForm" :model="diagnoseModel" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="预约id" hidden>
          <el-input v-model="diagnoseModel.appointid" />
        </el-form-item>
        <el-form-item label="病历id" hidden>
          <el-input v-model="diagnoseModel.medicalrecordid" />
        </el-form-item>
        <!-- <el-form-item label="employeeid">
          <el-input v-model="diagnoseModel.employeeid" />
        </el-form-item>  -->
        <el-form-item label="病史" prop="medicalhistory">
          <el-input v-model="diagnoseModel.medicalhistory" type="textarea" :rows="6" />
        </el-form-item>

        <el-form-item label="诊断" prop="diagnose">
          <el-input v-model="diagnoseModel.diagnose" type="textarea" :rows="6" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>

        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import axios from 'axios'
import { getAppointListByEmp, diagnoses, endDiagnoses, finishInjection, remind } from '@/api/appoint'
import { getMedicineRecordById, addMedicalRecord } from '@/api/medicalRecord'
import { addPrescribeList } from '@/api/prescribe'
import rules from '@/utils/rules'
import tablePane from '@/components/tablePane2.vue'
import store from '@/store'
import { getMedicineListByName } from '@/api/medicine'
// import { getToken } from '@/utils/auth'

export default {
  name: 'CheckApponitList',
  components: { tablePane },
  data() {
    return {
      userId: store.getters.userId,
      // DialogVisible: false,
      medicineListVisible: false,
      prescribeDialogVisible: false,
      dignoseDialogVisible: false,
      title: '',
      searchAppoint: {
        status: null
      },
      diagnoseModel: {
      },
      prescribe: {
        appointId: '',
        medicineid: '',
        // employeeid: '',
        count: '',
        medicineName: ''
      },
      medicineTable: [],

      presecibeList: {

        presecibeTable: []
      },
      rules: {
        medicalhistory: [
          { required: true, message: '请输入病史', trigger: 'blur' }
        ],
        diagnose: [
          { required: true, message: '请输入诊断', trigger: 'blur' }
        ]
      },
      addMedicineRules: {
        medicineName: [
          { required: true, message: '请选择药品', trigger: ['blur', 'change'] }
        ],
        count: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: ['blur', 'change'] },
          { validator: (rule, value, callback) => {
            rules.checkMedicineAmount(value, callback, this.prescribe.medicineid, this.prescribe.count)
          }, trigger: 'blur' }
        ]
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
          // {
          //   label: '主人电话',
          //   prop: 'user.phonenumber',
          //   width: 150

          // },

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
            label: '状态',
            prop: 'status',
            isCodeTableFormatter: function(val) { // 过滤器
              if (val.status === 0) {
                return '待确认'
              } else if (val.status === 1) {
                return '已确认'
              } else if (val.status === 2) {
                return '爽约'
              } else if (val.status === 3) {
                return '已完成'
              } else if (val.status === 4) {
                return '已取消'
              } else if (val.status === 5) {
                return '进行中'
              }
            }
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
          width: '600', // 根据实际情况给宽度
          data: [
            {
              label: '挂起', // 操作名称
              type: 'info',

              handleRow: this.deleteRow
            },
            {
              label: '诊断', // 操作名称
              type: 'info',

              handleRow: this.diagnose
            },
            {
              label: '提醒', // 操作名称
              type: 'info',

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
    // diagnose(index, row) {
    //   this.DialogVisible = true
    //   this.diagnoseModel.petid = row.petid
    //   this.diagnoseModel.employeeid = row.employeeid
    // },
    submitForm() {
      const data = {
        appointid: this.diagnoseModel.appointid,
        // petid: this.diagnoseModel.petid,
        // employeeid: this.diagnoseModel.employeeid,
        medicalrecordid: this.diagnoseModel.medicalrecordid,
        medicalhistory: this.diagnoseModel.medicalhistory,
        diagnose: this.diagnoseModel.diagnose,
        visittime: this.diagnoseModel.visittime
        // medicineList: this.presecibe.presecibeTable

      }
      addMedicalRecord(data).then(res => {
        if (res.total > 0) {
          this.dignoseDialogVisible = false
          this.getList()
        }
      })
    },

    handleClose(done) {
      if (this.prescribeDialogVisible) {
        this.prescribe = {}
      }
      this.presecibeList.presecibeTable = []
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
    // getAppointPersonalInfo() {
    //   getAppointPersonalInfo(this.userId).then(res => {

    //   })
    // },
    addMedicalRecord(index, row) {
      const data = {
        id: row.appointid
      }

      // this.diagnoseModel.petid = row.petid
      // this.diagnoseModel.employeeid = row.employeeid
      getMedicineRecordById(data).then(res => {
        if (res.total > 0) {
          this.diagnoseModel = res.data
          this.diagnoseModel.appointid = row.appointid
        } else {
          this.diagnoseModel = {}
          this.diagnoseModel.appointid = row.appointid
        }
      })

      // this.diagnoseModel.appointid = row.appointid
      this.dignoseDialogVisible = true
      this.title = '添加病历'
    },
    editMedicalRecord(index, row) {
      this.dignoseDialogVisible = true
      this.title = '修改病历'
    },
    diagnoses(index, row) {
      const data = {
        appointid: row.appointid
      }
      diagnoses(data).then(res => {
        if (res.total > 0) {
          this.getList()
        }
      })
    },
    addPrescribeList(index, row) {
      this.prescribeDialogVisible = true
      this.prescribe.appointId = row.appointid
      // this.prescribe.employeeid = row.employeeid
    },
    endDiagnoses(index, row) {
      const data = {
        appointid: row.appointid
      }
      endDiagnoses(data).then(res => {
        if (res.total > 0) {
          this.getList()
        }
      })
    },
    printMedicalRecord(index, row) {
      axios({
        methods: 'get',
        url: 'http://localhost:8080/petHis/downloading/PDF/' + row.appointid,

        responseType: 'blob'
      }).then((res) => {
        const content = res.data
        this.pdfUrl = window.URL.createObjectURL(
          new Blob([content], { type: 'application/pdf' })
        )
        // window.open(this.pdfUrl);
        var date = new Date().getTime()
        var ifr = document.createElement('iframe')
        ifr.style.frameborder = 'no'
        ifr.style.display = 'none'
        ifr.style.pageBreakBefore = 'always'
        ifr.setAttribute('id', 'printPdf' + date)
        ifr.setAttribute('name', 'printPdf' + date)
        ifr.src = this.pdfUrl
        document.body.appendChild(ifr)
        this.doPrint('printPdf' + date)
        window.URL.revokeObjectURL(ifr.src) // 释放URL 对象
      })
    },
    // 打印
    doPrint(val) {
      var ordonnance = document.getElementById(val).contentWindow
      setTimeout(() => {
        ordonnance.print()
        this.pdfLoading = false
      }, 10)
    },

    remind(index, row) {
      const data = {
        phonenumber: row.user.phonenumber
      }
      remind(data).then(res => {

      })
    },
    finishInjection(index, row) {
      const data = {
        appointid: row.appointid
      }
      finishInjection(data).then(res => {
        if (res.total > 0) {
          this.getList()
        }
      })
    },
    selectmedicinme() {
      this.medicineListVisible = true
      getMedicineListByName(this.prescribe.medicineName).then(res => {
        this.medicineTable = res.data
      })
    },
    chooseMedicine(index, row) {
      // const presecibeMedicne = JSON.parse(JSON.stringify(row))
      // presecibeMedicne['count'] = ''
      // console.log(presecibeMedicne)
      // const map = new Map()
      // this.presecibe.presecibeTable.push(presecibeMedicne)
      // const qc = this.presecibe.presecibeTable.filter(key => !map.has(key.medicineid) && map.set(key.medicineid, key.medicineid)) // 这里对name属性进行去重
      // this.presecibe.presecibeTable = qc

      this.prescribe.medicineid = row.medicineid
      this.prescribe.medicineName = row.name
      this.medicineListVisible = false
    },
    addMedicine() {
      this.$refs.addMedicineForm.validate(valid => {
        if (valid) {
          this.presecibeList.presecibeTable.push(JSON.parse(JSON.stringify(this.prescribe)))
          this.prescribe.medicineid = null
          this.prescribe.medicineName = null
          this.prescribe.count = null
        } else {
          this.$message({
            message: '请填写好内容',
            type: 'warning'
          })
        }
      })
    },
    deletePrescribe(index, row) {
      this.presecibeList.presecibeTable.splice(index, 1)
    },
    submitPrescribeList() {
      const data =

      // petid: this.diagnoseModel.petid,
      // employeeid: this.diagnoseModel.employeeid,
      // medicalHistoryme: this.diagnoseModel.medicalHistoryme,
      // diagnose: this.diagnoseModel.diagnose,
       this.presecibeList.presecibeTable

      // console.log(data)
      // addCheck().then(res => {
      //   if (res.total > 0) {
      //     alert(res.message)
      //   }
      // })
      this.$confirm('确定要提交处方?提交后无法修改', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        addPrescribeList(data).then(res => {
          if (res.total > 0) {
            this.prescribeDialogVisible = false
            this.presecibeList.presecibeTable = []
          }
        })
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

    // init: function() {
    //   if (typeof (WebSocket) === 'undefined') {
    //     alert('您的浏览器不支持socket')
    //   } else {
    //     var token = getToken()
    //     // 实例化socket
    //     this.socket = new WebSocket('ws://localhost:8080/petHis/webSocket?token=' + token)
    //     // 监听socket连接
    //     this.socket.onopen = this.open
    //     // 监听socket错误信息
    //     this.socket.onerror = this.error
    //     // 监听socket消息
    //     this.socket.onmessage = this.getMessage
    //   }
    // },
    // open: function() {
    //   console.log('socket连接成功')
    // },
    // error: function() {
    //   console.log('连接错误')
    // },
    // // 接收服务器发来的消息
    // getMessage: function(e) {
    //   // console.log(e.data)
    //   this.medicineTable = JSON.parse(e.data)
    // },
    // // 给服务器发消息的方法
    // send: function() {
    //   this.socket.send(this.parms)
    // },
    // close: function() {
    //   console.log('socket已经关闭')
    // }

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

<style  scoped lang='scss'>
.filter-item{
  margin-left: 10px;
  display: inline-block;
}
.filter-container .filter-item:nth-of-type(1){
  margin-left: 0px;
}
.filter-btn{
  display: inline-block;
  margin-left: 10px;
}
</style>


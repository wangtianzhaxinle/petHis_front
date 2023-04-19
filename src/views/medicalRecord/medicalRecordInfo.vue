<template>

  <div class="app-container">
    <div>
      <div class="filter-container">
        <el-input v-model="searchMedicalRecord.appointid" style="width:200px" class="filter-item" placeholder="请输入预约id" />
        <el-input v-model="searchMedicalRecord.pet.name" style="width:200px" class="filter-item" placeholder="请输入宠物名" />
        <el-input v-model="searchMedicalRecord.emp.name" style="width:200px" class="filter-item" placeholder="请输入员工名" />

        <div class="filter-btn">
          <el-button class="filter-item" type="primary" @click="search">
            搜索
          </el-button>
          <el-button class="filter-item" type="warning" @click="resetFilter">
            重置
          </el-button>
        </div>
      </div>

    </div>
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
    <el-dialog
      :title="title"
      :visible.sync="dignoseDialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-form ref="diagnoseForm" :model="diagnoseModel" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="病历id" hidden>
          <el-input v-model="diagnoseModel.medicalrecordid" />
        </el-form-item>
        <!-- <el-form-item label="预约id">
          <el-input v-model="diagnoseModel.appointid" />
        </el-form-item> -->

        <el-form-item label="病史" prop="medicalhistory">
          <el-input v-model="diagnoseModel.medicalhistory" type="textarea" :rows="6" />
        </el-form-item>

        <el-form-item label="诊断" prop="diagnose">
          <el-input v-model="diagnoseModel.diagnose" type="textarea" :rows="6" />
        </el-form-item>

        <el-form-item label="就诊时间" required>
          <el-col :span="11">
            <el-form-item prop="visittime">
              <el-date-picker v-model="diagnoseModel.visittime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="updateMedicalRecord">提交</el-button>
          <el-button type="primary" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>
<script>

import tablePane from '@/components/tablePane.vue'

// import moment from 'moment'
import 'moment/locale/zh-cn'
import store from '@/store'
// import axios from 'axios'
import { getMedicalRecordList, updateMedicalRecordById } from '@/api/medicalRecord'
export default {
  name: 'MedicalRecordinfo',
  components: { tablePane },

  data() {
    return {
      userId: store.getters.userId,
      appointDialogVisible: false,
      dignoseDialogVisible: false,
      title: '',
      diagnoseModel: {

      },
      searchMedicalRecord: {
        appointid: null,
        pet: {
          name: null
        },
        emp: {
          name: null
        }
      },
      rules: {
        medicalhistory: [
          { required: true, message: '请输入病史', trigger: 'blur' }
        ],
        diagnose: [
          { required: true, message: '请输入诊断', trigger: 'blur' }
        ],
        visittime: [
          { required: true, message: '请选择就诊时间', trigger: 'blur' }
        ]
      },
      // 表格配置
      dataSource: {
        tool: [
          // {
          //   name: '批量删除',
          //   key: 'batchDelete',

          //   handleClick: this.batchDelete
          // }

        ],
        data: [], // 表格数据
        cols: [
          {
            label: '病历id',
            prop: 'medicalrecordid',
            width: 100
          },
          // {
          //   label: '宠物id',
          //   prop: 'pet.petid',
          //   width: 100
          // },
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
          // {
          //   label: '医生id',
          //   prop: 'appoint.employeeid',
          //   width: 100

          // },
          {
            label: '医生名',
            prop: 'emp.name',
            width: 200
          },
          {
            label: '病史',
            prop: 'medicalhistory'

          },

          {
            label: '诊断',
            prop: 'diagnose'

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
              label: '修改', // 操作名称
              type: 'warning',
              //  permission: '2010702', // 后期这个操作的权限，用来控制权限
              handleRow: this.editMedicalRecordRecord
            },
            // {
            //   label: '删除', // 操作名称
            //   type: 'danger',
            //   //  permission: '2010702', // 后期这个操作的权限，用来控制权限
            //   handleRow: this.deleteAppoint
            // },
            {
              label: '下载病历', // 操作名称
              type: 'danger',
              //  permission: '2010702', // 后期这个操作的权限，用来控制权限
              handleRow: this.downloadMedicalRecord
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
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.resetForm()
          // 这里userid未绑定rules的prop无法用resetField重置

          done()
        })
        .catch(_ => {})
    },
    resetForm() {
      this.$refs.diagnoseForm.resetFields()
      this.diagnoseModel = {}
    },
    resetFilter() {
      this.searchMedicalRecord.appointid = null
      this.searchMedicalRecord.pet.name = null
      this.searchMedicalRecord.emp.name = null
      this.getList()
    },
    search() {
      this.getList()
    },
    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum,
        appointid: this.searchMedicalRecord.appointid,
        pet: {
          name: this.searchMedicalRecord.pet.name
        },
        emp: {
          name: this.searchMedicalRecord.emp.name
        }

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
    editMedicalRecordRecord(index, row) {
      this.title = '修改病历'
      this.dignoseDialogVisible = true
      this.$nextTick(() => {
        // 赋值
        this.diagnoseModel = JSON.parse(JSON.stringify(row))
      })
    },
    updateMedicalRecord() {
      this.$refs.diagnoseForm.validate(valid => {
        if (valid) {
          this.loading = true
          const data = this.diagnoseModel
          updateMedicalRecordById(data).then(res => {
            if (res.total > 0) {
              this.dignoseDialogVisible = false
              this.loading = false
              this.getList()
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    downloadMedicalRecord(index, row) {
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = 'http://localhost:8080/petHis/' + 'downloading/PDF/' + row.appointid
      document.body.appendChild(link)
      link.click()
    },
    // downloadMedicalRecord(index, row) {
    //   // 请求类型 responseType: "blob",
    //   axios({
    //     methods: 'get',
    //     url: 'http://localhost:8080/petHis/downloading/PDF/' + row.appointid,

    //     responseType: 'blob'
    //   }).then((res) => {
    //     const content = res.data
    //     this.pdfUrl = window.URL.createObjectURL(
    //       new Blob([content], { type: 'application/pdf' })
    //     )
    //     // window.open(this.pdfUrl);
    //     var date = new Date().getTime()
    //     var ifr = document.createElement('iframe')
    //     ifr.style.frameborder = 'no'
    //     ifr.style.display = 'none'
    //     ifr.style.pageBreakBefore = 'always'
    //     ifr.setAttribute('id', 'printPdf' + date)
    //     ifr.setAttribute('name', 'printPdf' + date)
    //     ifr.src = this.pdfUrl
    //     document.body.appendChild(ifr)
    //     this.doPrint('printPdf' + date)
    //     window.URL.revokeObjectURL(ifr.src) // 释放URL 对象
    //   })
    // },
    // // 打印
    // doPrint(val) {
    //   var ordonnance = document.getElementById(val).contentWindow
    //   setTimeout(() => {
    //     ordonnance.print()
    //     this.pdfLoading = false
    //   }, 100)
    // },
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

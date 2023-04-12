<template>

  <div class="app-container">
    <div>
      <div class="filter-container">
        <el-input v-model="serchPrescribe.appointId" style="width:200px" class="filter-item" placeholder="预约id" />
        <el-input v-model="serchPrescribe.pet.name" style="width:200px" class="filter-item" placeholder="宠物名" />
        <el-input v-model="serchPrescribe.medicine.name" style="width:200px" class="filter-item" placeholder="药名" />
        <el-input v-model="serchPrescribe.employee.name" style="width:200px" class="filter-item" placeholder="药师" />
        <el-select v-model="serchPrescribe.status" style="width:200px" class="filter-item" placeholder="状态">
          <el-option label="待配药" value="0" />
          <el-option label="已完成" value="1" />
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

    </div>
    <table-pane
      :data-source="dataSource"
      @changeSize="changeSize"
      @changeNum="changeNum"
    >
      <template v-slot:operator="scopedata">
        <div class="btn">
          <el-button

            type="warning"
            size="mini"
            @click.native.prevent="editPrescribe(scopedata.scope.$index, scopedata.scope.row)"
          >

            修改
          </el-button>
          <el-button

            type="danger"
            size="mini"
            @click.native.prevent="deletePrescribe(scopedata.scope.$index, scopedata.scope.row)"
          >

            删除
          </el-button>
        </div>

      </template>

    </table-pane>
    <el-dialog
      :title="title"
      :visible.sync="prescribeDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="prescribeForm" :model="prescribe" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="prescribeId" hidden>
          <el-input v-model="prescribe.prescribeid" />
        </el-form-item>
        <el-form-item label="appointid" prop="appointId">
          <el-select v-model="prescribe.appointId" filterable>
            <el-option
              v-for="item in appointOptions"
              :key="item.appointid"
              :label="item.appointid"
              :value="item.appointid"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="药品" prop="medicineid">
          <el-select
            v-model="prescribe.medicineid"
            filterable
            remote
            :loading="medicinelodading"
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="item in medicineOptions"
              :key="item.medicineid"
              :label="item.name"
              :value="item.medicineid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="药师" prop="employeeid">
          <el-select v-model="prescribe.employeeid">
            <el-option
              v-for="item in medicinerOptions"
              :key="item.employeeid"
              :label="item.user.name"
              :value="item.employeeid"
            />
          </el-select>

        </el-form-item>
        <el-form-item label="数量" prop="count">
          <el-input v-model.number="prescribe.count" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="prescribe.status">
            <el-radio :label="1">已完成</el-radio>
            <el-radio :label="0">待配药</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>

</template>
<script>

import tablePane from '@/components/tablePane2.vue'

// import moment from 'moment'
import 'moment/locale/zh-cn'
import store from '@/store'
import { getPrescribeList, deletePrescribeById, deletePrescribeByIds, updatePrescribeById, addPrescribe } from '@/api/prescribe'
import { getMedicinerList } from '@/api/employee'
import { getMedicineList } from '@/api/medicine'

import { getAppointIdList } from '@/api/appoint'
export default {
  name: 'AllPerscribeList',
  components: { tablePane },

  data() {
    return {
      userId: store.getters.userId,
      appointDialogVisible: false,
      serchPrescribe: {
        appointId: null,
        pet: {
          name: null
        },
        medicine: {
          name: null
        },
        status: null,
        employee: {
          name: null
        }
      },
      prescribe: {},
      prescribeDialogVisible: false,
      medicinelodading: false,
      submitType: '',
      title: '',
      appointOptions: [],
      medicineOptions: [],
      medicinerOptions: [],
      rules: {
        appointId: [
          { required: true, message: '请选择预约id', trigger: 'change' }
        ],
        medicineid: [
          { required: true, message: '请选择药品', trigger: 'change' }
        ],
        employeeid: [
          { required: true, message: '请选择药师', trigger: 'change' }
        ],
        count: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { type: 'number', trigger: 'blur', message: '请输入数字' },
          {
            validator(rule, value, callback) {
              if (value > 0) {
                callback()
              } else {
                callback(new Error('请输入正整数'))
              }
            },
            trigger: 'blur'
          }
          // 这里还需要再做一个验证,查询数据库库存数量够不够
        ],
        status: [
          { required: true, message: '请选择一项', trigger: 'blur' }
        ]
      },
      // 表格配置
      dataSource: {
        tool: [
          {
            name: '添加配药',
            key: 'addPrescribe',
            // permission: 'AddPrescribe',
            handleClick: this.addPrescribe
          },
          {
            name: '批量删除',
            key: 'batchDelete',
            // permission: 'AddPrescribe',
            handleClick: this.batchDelete
          }
        ],
        data: [], // 表格数据
        cols: [
          {
            label: '配药id',
            prop: 'prescribeid',
            width: 100
          },

          {
            label: '预约id',
            prop: 'appointId',
            width: 100

          },

          {
            label: '宠物名',
            prop: 'pet.name',
            width: 100

          },

          {
            label: '药名',
            prop: 'medicine.name',
            width: 200
          },
          {
            label: '数量',
            prop: 'count',
            width: 200
          },
          {
            label: '单位',
            prop: 'medicine.unit',
            width: 200
          },

          {
            label: '负责药师',
            prop: 'employee.name',
            width: 200
          },
          {
            label: '状态',
            prop: 'status',
            width: 200,
            filter: function(val) {
              if (val === 1) {
                return '已完成'
              } else {
                return '待配药'
              }
            },
            isIcon: true,
            icon: function(val) {
              if (val === 1) {
                return 'el-icon-check'
              } else {
                return 'el-icon-close'
              }
            }
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
              //   permission: '2010702', // 后期这个操作的权限，用来控制权限
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
    handleClose(done) {
      this.resetForm()
      // 这里userid未绑定rules的prop无法用resetField重置

      done()
    },
    resetForm() {
      this.$refs.prescribeForm.resetFields()
      this.prescribe = {}
    },
    resetFilter() {
      this.serchPrescribe.appointId = null
      this.serchPrescribe.pet.name = null
      this.serchPrescribe.medicine.name = null
      this.serchPrescribe.employee.name = null
      this.serchPrescribe.status = null
    },
    search() {
      this.getList()
    },
    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum,
        appointId: this.serchPrescribe.appointId,
        pet: {
          name: this.serchPrescribe.pet.name
        },
        medicine: {
          name: this.serchPrescribe.medicine.name
        },
        employee: {
          name: this.serchPrescribe.employee.name
        },
        status: this.serchPrescribe.status

      }
      this.dataSource.loading = true
      console.log('getMedicalRecordList')
      getPrescribeList(data).then(res => {
        this.dataSource.loading = false

        if (res.total > 0) {
          this.dataSource.pageData.total = res.total
          this.dataSource.data = res.data
          this.getMedicinerList()
          this.getAppointIdList()
          // console.log(res.data)
        } else {
          this.dataSource.data = []
          this.dataSource.pageData.total = 0
        }
        // }
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.medicinelodading = false
          const data = { name: query }
          getMedicineList(data).then(res => {
            if (res.total > 0) {
              this.medicineOptions = res.data
            }
          })
        }, 200)
      } else {
        this.options = []
      }
    },
    getMedicinerList() {
      getMedicinerList().then(res => {
        if (res.total > 0) {
          this.medicinerOptions = res.data
        }
      })
    },
    getAppointIdList() {
      getAppointIdList().then(res => {
        if (res.total > 0) {
          this.appointOptions = res.data
        }
      })
    },
    deletePrescribe(index, row) {
      deletePrescribeById(row.prescribeid).then(res => {
        if (res.total > 0) {
          this.getList()
        }
      })
    },
    batchDelete() {
      const ids = this.selected.map((prescribe) => prescribe.prescribeid)
      deletePrescribeByIds(ids).then(res => {
        if (res.total > 0) {
          this.getList()
        }
      })
    },
    addPrescribe() {
      this.title = '添加配药'
      this.prescribeDialogVisible = true
      this.prescribe = {}
      this.submitType = 'add'
    },
    editPrescribe(index, row) {
      this.title = '修改配药'
      this.prescribeDialogVisible = true
      this.submitType = 'edit'
      this.medicineOptions = []
      this.medicineOptions.push({ medicineid: row.medicineid, name: row.medicine.name })
      this.$nextTick(() => {
        // 赋值
        this.prescribe = JSON.parse(JSON.stringify(row))
      })
    },
    submitForm() {
      this.$refs.prescribeForm.validate(valid => {
        if (valid) {
          this.loading = true
          const prescribe = this.prescribe
          if (this.submitType === 'add') {
            addPrescribe(prescribe).then(res => {
              if (res.total > 0) {
                this.resetForm()
                this.prescribeDialogVisible = false
                this.loading = false
                this.getList()
              }
            }).catch(() => {
              this.loading = false
            })
          } else if (this.submitType === 'edit') {
            this.loading = true
            updatePrescribeById(prescribe).then(res => {
              if (res.total > 0) {
                this.resetForm()
                this.prescribeDialogVisible = false
                this.loading = false
                this.getList()
              }
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
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

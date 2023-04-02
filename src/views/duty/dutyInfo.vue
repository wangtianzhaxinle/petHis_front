<template>
  <div> <table-pane
          :data-source="dataSource"
          @changeSize="changeSize"
          @changeNum="changeNum"
        />
    <el-dialog
      title="修改值班"
      :visible.sync="editDutyDialogVisible"
      width="30%"
    >
      <el-form ref="editDutyForm" :model="duty" label-width="100px" class="demo-ruleForm">
        <el-form-item label="dutyid" hidden>
          <el-input v-model="duty.dutyid" />
        </el-form-item>

        <el-form-item label="employeeid" hidden>
          <el-input v-model="duty.employeeid" />
        </el-form-item>

        <el-form-item label="名字">
          <el-input v-model="duty.user.name" :disabled="true" />
        </el-form-item>

        <el-form-item label="周一是否值班">
          <el-radio-group v-model="duty.monday" :disabled="dutyDisable.monday">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="周二是否值班">
          <el-radio-group v-model="duty.tuesday" :disabled="dutyDisable.tuesday">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="周三是否值班">
          <el-radio-group v-model="duty.wednesday" :disabled="dutyDisable.wednesday">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="周四是否值班">
          <el-radio-group v-model="duty.thursday" :disabled="dutyDisable.thursday">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="周五是否值班">
          <el-radio-group v-model="duty.friday" :disabled="dutyDisable.friday">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="周六是否值班">
          <el-radio-group v-model="duty.saturday" :disabled="dutyDisable.saturday">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="周日是否值班">
          <el-radio-group v-model="duty.sunday" :disabled="dutyDisable.sunday">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">添加</el-button>
          <!-- <el-button @click="resetForm('addMedicineForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>

import { getDutyList, updateDutyByDutyId } from '@/api/duty'
import tablePane from '@/components/tablePane.vue'
import moment from 'moment'

export default {
  name: 'DutyInfo',
  components: { tablePane },
  data() {
    return {
      // 搜索栏配置
      editDutyDialogVisible: false,
      duty: {
        name: '',
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: '',
        user: {}
      },
      dutyDisable: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
      // 表格配置
      dataSource: {
        tool: [],
        data: [], // 表格数据
        cols: [
          {
            label: 'id',
            prop: 'dutyid',
            width: 40

          },
          {
            label: '名字',
            prop: 'user.name',
            width: 100
          },

          {
            label: '周一',
            prop: 'monday',
            width: 100,

            // isIcon: true,
            isCodeTableFormatter: function(val) {
              if (val.monday === 1) {
                return '上班'
              } else {
                return '休息'
              }
            } },
          /*,
            isTemplateClass: function(val) {
              if (val.mondayam === 1) {
                return 'color-red'
              } else {
                return 'color-green'
              }
            }*/

          /* filter: function(val) {
              if (val === 4) {
                return '特定用户'
              } else if (val === 3) {
                return '新注册用户'
              } else if (val === 2) {
                return '标签用户'
              } else if (val === 1) {
                return '全部用户'
              }
            },

            icon: function(val) {
              if (val.mondayam === 1) {
                console.log('1')
                return 'el-icon-checke'
              } else {
                console.log(val)
                return 'el-icon-close'
              }
            }*/

          {
            label: '周二',
            prop: 'tuesday',
            width: 100,
            isCodeTableFormatter: function(val) {
              if (val.tuesday === 1) {
                return '上班'
              } else {
                return '休息'
              }
            }

          },

          {
            label: '周三',
            prop: 'wednesday',
            width: 100,
            isCodeTableFormatter: function(val) {
              if (val.wednesday === 1) {
                return '上班'
              } else {
                return '休息'
              }
            }
          },

          {
            label: '周四',
            prop: 'thursday',
            width: 100,
            isCodeTableFormatter: function(val) {
              if (val.thursday === 1) {
                return '上班'
              } else {
                return '休息'
              }
            }
          },

          {
            label: '周五',
            prop: 'friday',
            width: 100,
            isCodeTableFormatter: function(val) {
              if (val.friday === 1) {
                return '上班'
              } else {
                return '休息'
              }
            }
          },

          {
            label: '周六',
            prop: 'saturday',
            width: 100,
            isCodeTableFormatter: function(val) {
              if (val.saturday === 1) {
                return '上班'
              } else {
                return '休息'
              }
            }
          },

          {
            label: '周日',
            prop: 'sunday',
            width: 100,
            isCodeTableFormatter: function(val) {
              if (val.sunday === 1) {
                return '上班'
              } else {
                return '休息'
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
          // 根据实际情况给宽度
          data: [

            {
              label: '修改', // 操作名称
              type: 'warming',
              permission: 'editDuty', // 后期这个操作的权限，用来控制权限
              handleRow: this.editDuty
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
      var today = moment().day()
      var tomorrow = moment().add(1, 'days').day()
      // 设置本日和明天的值班不可更改
      this.setDisabled(today)
      this.setDisabled(tomorrow)
      this.dataSource.loading = true
      // console.log('getAllPetInfoList')
      getDutyList(data).then(res => {
        this.dataSource.loading = false
        // if (res.succeed) {
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
    editDuty(index, row) {
      this.editDutyDialogVisible = true
      this.duty = JSON.parse(JSON.stringify(row))
      // console.log(this.duty)
    },
    setDisabled(val) {
      switch (val) {
        case 1:
          this.dutyDisable.monday = true
          break
        case 2:
          this.dutyDisable.tuesday = true
          break
        case 3:
          this.dutyDisable.wednesday = true
          break
        case 4:
          this.dutyDisable.thursday = true
          break
        case 5:
          this.dutyDisable.friday = true
          break
        case 6:
          this.dutyDisable.saturday = true
          break
        case 7:
          this.dutyDisable.sunday = true
          break
      }
    },
    submitForm() {
      /*
      var data = {
        dutyId: this.duty.dutyid,
        employeeId: this.duty.employeeid,
        monday: this.duty.monday,
        tuesday: this.duty.tuesday,
        wednesday: this.duty.wednesday,
        thursday: this.duty.thursday,
        friday: this.duty.friday,
        saturday: this.duty.saturday,
        sunday: this.duty.sunday

      }
      */
      const data = this.duty
      updateDutyByDutyId(data).then(res => {
        alert(res.message)
        if (res.total > 0) {
          this.getList()
          this.editDutyDialogVisible = false
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
    }

  }
}
</script>


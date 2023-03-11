<template>

  <div class="app-container"> <table-pane
                                :data-source="dataSource"
                                @changeSize="changeSize"
                                @changeNum="changeNum"
                              />
    <el-dialog
      title="添加项目"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="itemForm" :model="item" :rules="rules" label-width="100px" class="demo-ruleForm">

        <el-form-item label="名字" prop="name">
          <el-input v-model="item.name" />
        </el-form-item>

        <el-form-item label="价格" prop="price">
          <el-input v-model.number="item.price" />
        </el-form-item>

        <el-form-item label="收费方式" prop="chargingmethod">
          <el-input v-model="item.chargingmethod" />
        </el-form-item>
        <el-form-item label="负责职位" prop="roleid">
          <el-select v-model="item.roleid" placeholder="请选择">
            <el-option
              v-for=" i in options"
              :key="i.roleid"
              :label="i.description"
              :value="i.roleid"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">添加</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <!-- <el-dialog
      title="预约时间"
      :visible.sync="apponitDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="apponitForm" :model="appoint" :rules="rules" label-width="100px" class="demo-ruleForm">

        <el-form-item label="预约时间" prop="apponittime">
          <el-date-picker
            v-model="appoint.apponittime"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">添加</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog> -->

  </div></template>
<script>

import tablePane from '@/components/tablePane.vue'
import { getItemInfoList, addItem, deleteItembyId, updateItemById } from '@/api/item'
import { getAllRoleList } from '@/api/role'
// import { addAppoint } from '@/api/appoint'
// import moment from 'moment'
import store from '@/store'
export default {
  name: 'ItemInfo',
  components: { tablePane },

  data() {
    return {
      userId: store.getters.userId,
      dialogVisible: false,
      apponitDialogVisible: false,
      dialogtype: '',
      options: {
      },
      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],

        price: [

          { required: true, message: '请输入价格', trigger: 'blur' },
          { type: 'number', message: '请输入正确的价格', trigger: ['blur', 'change'] }

        ],

        chargingmethod: [
          { required: true, message: '请输入收费方式', trigger: 'blur' }

        ],
        roleid: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        apponittime: [
          { type: 'datetime', required: true, message: '请选择时间', trigger: 'change' }
        ]

      },
      item: {
        /*
        itemid: '',
        name: '',
        price: '',
        chargingmethod: '',
        roleid: ''
*/
      },
      appoint: {
        itemid: '',
        userid: '',
        status: '',
        appointtime: '',
        employeeid: '',
        count: '',
        totalPrice: '',
        createtime: ''
      },
      // 表格配置
      dataSource: {
        tool: [{
          name: '新增项目',
          key: 'addItem',
          permission: 'addItem',
          handleClick: this.addItem
        },
        {
          name: '全部删除',
          key: 'deleteAllItem',
          permission: 'deleteAllItem',
          handleClick: this.deleteAllItem
        }
        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'id',
            prop: 'itemid'

          },

          {
            label: '项目名',
            prop: 'name'

          },
          {
            label: '价格',
            prop: 'price'

          },

          {
            label: '收费方式',
            prop: 'chargingmethod',
            width: 300
          },
          {
            label: '负责职位',
            prop: 'role.description',
            width: 300
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
              label: '删除', // 操作名称
              type: 'danger',
              permission: 'deleteItem', // 后期这个操作的权限，用来控制权限
              handleRow: this.deleteItem
            }, {
              label: '预约', // 操作名称
              type: 'info',
              permission: 'apponit', // 后期这个操作的权限，用来控制权限
              handleRow: this.apponit
            },
            {
              label: '修改', // 操作名称
              type: 'warning',
              permission: 'editItem', // 后期这个操作的权限，用来控制权限
              handleRow: this.editItem
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
    this.getRoleList()
    this.getList()
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.resetForm()

          done()
        })
        .catch(_ => {})
    },
    resetForm() {
      if (this.dialogVisible === true) {
        this.$refs.itemForm.resetFields()
        // this.medicine.medicineid = ''
        this.item.itemid = ''
      } else if (this.apponitDialogVisible === true) {
        this.$refs.apponitForm.resetFields()
      }
    },
    submitForm() {
      this.$refs.itemForm.validate(valid => {
        if (valid) {
          this.loading = true
          const item = this.item
          // console.log(item)
          if (this.dialogtype === 'create') {
            addItem(item).then(res => {
            // alert(this.$route.path)
              alert(res.message)
              this.dialogVisible = false
              this.resetForm()
              // this.$router.go(0)
              // this.$router.push({ path: this.$route.path || '/' })
              this.loading = false
              this.getList()
            }).catch(() => {
              this.loading = false
            })
          } else if (this.dialogtype === 'edit') {
            this.loading = true
            // const MedicineInfo = this.medicine
            // console.log(MedicineInfo)
            updateItemById(item).then(res => {
            // alert(this.$route.path)
              alert(res.message)
              this.dialogVisible = false
              this.resetForm()
              // this.$router.go(0)
              // this.$router.push({ path: this.$route.path || '/' })
              this.loading = false
              this.getList()
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
    getRoleList() {
      // console.log('getRoleList')
      getAllRoleList().then(res => {
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
      getItemInfoList(data).then(res => {
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
    addItem() {
      this.dialogtype = 'create'
      this.dialogVisible = true
    },
    deleteAllItem() {

    },
    deleteItem(index, row) {
      console.log('deleteItem')
      console.log(row)
      deleteItembyId(row.itemid).then(res => {
        alert(res.message)
        if (res.total > 0) {
          this.getList()
        }
      })
    },

    apponit(index, row) {
      console.log('预约按钮')
      console.log(row)
      if (row.roleid === 4) {
        // 选择医生预约看病
        this.$router.push({ path: '/doctorInfo/' + row.itemid })
      } else {
        this.$router.push({ path: '/appointform/' + row.itemid })
      }

      /*
      if (row.roleid === 4) {
        // 选择医生预约看病
        this.$router.push({ path: '/doctorInfo/' + row.itemid })
      } else if (row.itemid === 1) {
        // 选择托管开始和结束日期

      }

      else {
        this.appoint.itemid = row.itemid
        this.appoint.userid = this.userId
        // this.appoint.status = 0
        // this.appoint.appointtime = moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
        // this.appoint.employeeid = ''
        this.appoint.count = 1
        // this.appoint.totalPrice = ''
        // this.appoint.createtime = moment().format('YYYY-MM-DD HH:mm:ss')
        // console.log(this.appoint)

        var form = new FormData()
        form.append('itemId', row.itemid)
        form.append('userId', this.userId)
        form.append('status', 0)
        form.append('appointTime', new Date() + 1)

        form.append('count', 1)

        form.append('createtime', new Date())

        const data = this.appoint
        this.apponitDialogVisible = true
        addAppoint(data).then(res => {
          // alert(res.mesage)
        })
      }*/
    },
    editItem(index, row) {
      this.dialogtype = 'edit'
      this.dialogVisible = true
      this.$nextTick(() => {
        // 赋值
        this.item = JSON.parse(JSON.stringify(row))
        // console.log(this.medicine)
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

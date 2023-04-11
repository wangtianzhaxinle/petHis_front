<template>
  <div> <table-pane
          :data-source="dataSource"
          @changeSize="changeSize"
          @changeNum="changeNum"
        />
    <el-dialog
      :title="title"
      :visible.sync="petDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="petForm" :model="petInfo" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="宠物id" hidden>
          <el-input v-model="petInfo.petid" />
        </el-form-item>

        <el-form-item label="宠物名" prop="name">
          <el-input v-model="petInfo.name" />
        </el-form-item>
        <el-form-item label="品种" prop="breed">
          <el-input v-model="petInfo.breed" />
        </el-form-item>
        <el-form-item label="是否健康" prop="ishealth">
          <el-radio-group v-model="petInfo.ishealth">
            <el-radio :label="1">健康</el-radio>
            <el-radio :label="0">生病</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="petInfo.age" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="petInfo.sex">
            <el-radio :label="1">公</el-radio>
            <el-radio :label="0">母</el-radio>
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
import { getPetListByUserId, addPet, updatePetById, deletePetById, deletePetByIds } from '@/api/pet'
import tablePane from '@/components/tablePane.vue'
import store from '@/store'
export default {
  name: 'PersonalPetInfo',
  components: { tablePane },
  data() {
    return {
      // 搜索栏配置
      userId: store.getters.userId,
      petInfo: {},
      title: '',
      petDialogVisible: false,
      submitType: '',
      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
        ],

        sex: [
          { required: true, message: '请选择性别', trigger: 'blur' }

        ],
        breed: [
          { required: true, message: '请输入品种', trigger: 'blur' }
        ],
        ishealth: [
          { required: true, message: '请选择一项', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '请输入年龄', trigger: 'change' },
          { type: 'number', required: true, trigger: 'blur', message: '请输入数字' },
          {
            validator(rule, value, callback) {
              if (value > 0) {
                callback()
              } else {
                callback(new Error('年龄范围不正确'))
              }
            },
            trigger: 'blur'
          }
        ]
      },
      // 表格配置
      dataSource: {
        tool: [{
          name: '新增宠物',
          key: 'addPet',
          // permission: 2010701,
          handleClick: this.addPet
        },
        {
          name: '批量删除',
          key: 'batchDelete',
          // permission: 2010701,
          handleClick: this.batchDelete
        }

        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'id',
            prop: 'petid'

          },
          {
            label: '名字',
            prop: 'name'
          },
          {
            label: '主人',
            prop: 'user.name'
          },
          {
            label: '年龄',
            prop: 'age'

          },
          {
            label: '品种',
            prop: 'breed'

          },
          {
            label: '是否健康',
            prop: 'ishealth',
            width: 300,
            isCodeTableFormatter: function(val) {
              if (val.ishealth === 1) {
                return '健康'
              } else {
                return '生病'
              }
            }
          },
          {
            label: '性别',
            prop: 'sex',
            isCodeTableFormatter: function(val) {
              if (val.sex === 1) {
                return '公'
              } else {
                return '母'
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
          width: '100', // 根据实际情况给宽度
          data: [
            {
              label: '修改', // 操作名称
              type: 'warning',
              // permission: '2010702', // 后期这个操作的权限，用来控制权限
              handleRow: this.editPet
            },
            {
              label: '删除', // 操作名称
              type: 'danger',
              // permission: '2010702', // 后期这个操作的权限，用来控制权限
              handleRow: this.deletePet
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
        pageNum: this.dataSource.pageData.pageNum,
        userId: this.userId
      }

      this.dataSource.loading = true
      console.log('getAllPetInfoList')
      getPetListByUserId(data).then(res => {
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
    handleClose(done) {
      this.resetForm()
      done()
    },
    resetForm() {
      this.$refs.petForm.resetFields()
      // 这里userid未绑定rules的prop无法用resetField重置
      this.petInfo = {}
    },
    addPet() {
      this.title = '添加宠物'
      this.petDialogVisible = true
      this.submitType = 'add'
      this.petInfo = {}
    },
    editPet(index, row) {
      this.title = '修改宠物'
      this.petDialogVisible = true
      this.submitType = 'edit'

      this.$nextTick(() => {
        // 赋值
        this.petInfo = JSON.parse(JSON.stringify(row))
      })
    },
    deletePet(index, row) {
      deletePetById(row.petid).then(res => {
        if (res.total > 0) {
          this.getList()
        }
      })
    },
    batchDelete() {
      const ids = this.selected.map((pet) => pet.petid)
      deletePetByIds(ids).then(res => {
        if (res.total > 0) {
          this.getList()
        }
      })
    },
    submitForm() {
      this.$refs.petForm.validate(valid => {
        if (valid) {
          this.loading = true
          const pet = this.petInfo
          if (this.submitType === 'add') {
            addPet(pet).then(res => {
              if (res.total > 0) {
                this.resetForm()
                this.petDialogVisible = false
                this.loading = false
                this.getList()
              }
            }).catch(() => {
              this.loading = false
            })
          } else if (this.submitType === 'edit') {
            this.loading = true
            updatePetById(pet).then(res => {
              if (res.total > 0) {
                this.resetForm()
                this.petDialogVisible = false
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
    },
    //
    // 表格上方工具栏回调
    handleAdd(index, row) {
      this.dialogAdd = true
    }

  }
}
</script>


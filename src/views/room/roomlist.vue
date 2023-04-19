<template>

  <div class="app-container">
    <div>
      <div class="filter-container">
        <el-input v-model="searchRoom.name" style="width:200px" class="filter-item" placeholder="请输入房间名" />
        <el-input v-model="searchRoom.appointid" style="width:200px" class="filter-item" placeholder="请输入预约id" />
        <el-select v-model="searchRoom.status" style="width:200px" class="filter-item" placeholder="房间状态">

          <el-option label="未使用" value="0" />
          <el-option label="已预订" value="1" />
          <el-option label="使用中" value="2" />
          <el-option label="超时" value="3" />
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
            v-permission="['editRoom']"
            type="warning"
            size="mini"
            @click.native.prevent="editRoom(scopedata.scope.$index, scopedata.scope.row)"
          >
            修改
          </el-button>
          <el-button

            v-permission="['deleteRoom']"
            type="danger"
            size="mini"
            @click.native.prevent="deleteRoom(scopedata.scope.$index, scopedata.scope.row)"
          >
            删除
          </el-button>
          <el-button
            v-if="scopedata.scope.row.status!==0&&scopedata.scope.row.status!==1"
            type="success"
            size="mini"
            @click.native.prevent="takeBackPet(scopedata.scope.$index, scopedata.scope.row)"
          >
            领回宠物
          </el-button>
        </div>

      </template>

    </table-pane>
    <el-dialog
      title="title"
      :visible.sync="roomDialogVisible"
      width="30%"
      append-to-body
      :before-close="handleClose"
    >
      <el-form ref="RoomForm" :model="room" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="roomid" hidden>
          <el-input v-model="room.roomid" />
        </el-form-item>
        <el-form-item label="房间名" prop="name">
          <el-input v-model="room.name" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>

</template>
<script>

import tablePane from '@/components/tablePane2.vue'
import permission from '@/directive/permission/index.js' // 权限判断指令
import { getRoomList, addRoom, updateRoomById, deleteRoomById, deleteRoomByIds, takeBackPetById } from '@/api/room'
import moment from 'moment'
import 'moment/locale/zh-cn'
import store from '@/store'

export default {
  name: 'RoomList',
  components: { tablePane },
  directives: { permission },
  data() {
    return {
      userId: store.getters.userId,
      roomid: '',
      title: '',
      roomDialogVisible: false,
      submitType: '',
      room: {
        roomid: '',
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
        ]
      },
      searchRoom: {
        name: null,
        status: null,
        appointid: null
      },
      // 表格配置
      dataSource: {
        tool: [
          {
            name: '新增房间',
            key: 'addRoom',
            permission: 'addRoom',
            handleClick: this.addRoom
          },
          {
            name: '批量删除',
            key: 'batchDelete',
            permission: 'batchDeleteRoom',
            handleClick: this.batchDelete
          }
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
            label: '预约id',
            prop: 'appointid',
            width: 100

          },
          {
            label: '开始时间',
            prop: 'startdate',
            width: 200
          },
          {
            label: '结束时间',
            prop: 'enddate',
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
          width: '250', // 根据实际情况给宽度
          data: [
            {
              label: '选择', // 操作名称
              type: 'info',
              //    permission: '2010702', // 后期这个操作的权限，用来控制权限
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
    resetFilter() {
      this.searchRoom.name = null
      this.searchRoom.status = null
      this.searchRoom.appointid = null
      this.getList()
    },
    search() {
      this.getList()
    },
    takeBackPet(index, row) {
      takeBackPetById(row.roomid).then(res => {
        if (res.total > 0) {
          this.getList()
        }
      })
    },
    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum,
        name: this.searchRoom.name,
        status: this.searchRoom.status,
        appointid: this.searchRoom.appointid

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
    editRoom(index, row) {
      // alert(666)
      this.roomDialogVisible = true
      this.title = '修改房间信息'
      this.submitType = 'edit'
      this.$nextTick(() => {
        // 赋值
        this.room = JSON.parse(JSON.stringify(row))
        // console.log(this.medicine)
      })
    },
    addRoom() {
      this.roomDialogVisible = true
      this.submitType = 'add'
      this.title = '添加房间'
    },
    deleteRoom(index, row) {
      this.$confirm('确认删除该房间?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>
        deleteRoomById(row.roomid).then(res => {
          if (res.total > 0) {
            this.getList()
          }
        })
      )
    },
    batchDelete() {
      const ids = this.selected.map((room) => room.roomid)
      console.log(ids)
      this.$confirm('确认删除选中房间?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => deleteRoomByIds(ids).then(res => {
        if (res.total > 0) {
          this.getList()
        }
      })
      )
    },
    resetForm() {
      this.$refs.RoomForm.resetFields()
    },
    submitForm() {
      const data = this.room
      this.$refs.RoomForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.submitType === 'add') {
            addRoom(data).then(res => {
              if (res.total > 0) {
                this.roomDialogVisible = false
                this.resetForm()
                this.loading = false
                this.getList()
              }
            }).catch(() => {
              this.loading = false
            })
          } else if (this.submitType === 'edit') {
            this.loading = true
            updateRoomById(data).then(res => {
              if (res.total > 0) {
                this.roomDialogVisible = false
                this.resetForm()
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


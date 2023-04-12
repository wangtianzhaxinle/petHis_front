<template>
  <div>
    <div>
      <div class="filter-container">
        <el-input v-model="searchAppoint.appointid" style="width:200px" class="filter-item" placeholder="预约id" />

        <el-input v-model="searchAppoint.pet.name" style="width:200px" class="filter-item" placeholder="宠物名" />
        <el-input v-model="searchAppoint.emp.name" style="width:200px" class="filter-item" placeholder="员工名" />
        <el-date-picker
          v-model="searchAppoint.appointdate"
          type="date"
          format="yyyy/MM/dd"
          value-format="yyyy/MM/dd"
          style="width:200px"
          class="filter-item"
          placeholder="预约时间"
        />
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

    </div>
    <table-pane
      :data-source="dataSource"
      @changeSize="changeSize"
      @changeNum="changeNum"
    />
  </div>
</template>

<script>

import { getAppointList } from '@/api/appoint'
import tablePane from '@/components/tablePane.vue'
import store from '@/store'

export default {
  name: 'ApponitInfo',
  components: { tablePane },
  data() {
    return {
      userId: store.getters.userId,
      // 搜索栏配置
      searchAppoint: {
        appointid: null,
        pet: {
          name: null
        },
        appointdate: null,
        status: null,
        emp: {
          name: null
        }

      },
      // 表格配置
      dataSource: {
        tool: [
          // {
          //   name: '批量删除',
          //   key: 'batchDeleteApponit',
          //   permission: 'batchDeleteApponit',
          //   handleClick: this.batchDeleteApponit
          // }
        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'appointid',
            prop: 'appointid',
            width: 100
          },
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

          {
            label: '员工名',
            prop: 'emp.name',
            width: 100
          },
          {
            label: 'status',
            prop: 'status',
            isCodeTableFormatter: function(val) { // 过滤器
              if (val.status === 0) {
                return '未确定'
              } else if (val.status === 1) {
                return '已确定'
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
          width: '100', // 根据实际情况给宽度
          data: [
            // {
            //   label: '删除', // 操作名称
            //   type: 'danger',
            //   permission: 'deleteRow', // 后期这个操作的权限，用来控制权限
            //   handleRow: this.deleteRow
            // },
            // {
            //   label: '修改', // 操作名称
            //   type: 'warming',
            //   permission: 'editRow', // 后期这个操作的权限，用来控制权限
            //   handleRow: this.editRow
            // }
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
    resetFilter() {
      this.searchAppoint.appointid = null
      this.searchAppoint.pet.name = null
      this.searchAppoint.emp.name = null
      this.searchAppoint.appointdate = null
      this.searchAppoint.status = null
    },
    search() {
      this.getList()
    },
    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum,
        appointid: this.searchAppoint.appointid,
        appointdate: this.searchAppoint.appointdate,
        status: this.searchAppoint.status,
        pet: {
          name: this.searchAppoint.pet.name
        },
        emp: {
          name: this.searchAppoint.emp.name
        }

      }

      this.dataSource.loading = true
      console.log('getAppointList')
      getAppointList(data).then(res => {
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

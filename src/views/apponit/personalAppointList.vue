<template>
  <div>
    <div>
      <div class="filter-container">
        <el-input v-model="searchAppoint.appointid" style="width:200px" class="filter-item" placeholder="预约id" />

        <el-input v-model="searchAppoint.pet.name" style="width:200px" class="filter-item" placeholder="宠物名" />
        <el-date-picker v-model="searchAppoint.appointdate" type="date" value-format="yyyy/MM/dd" style="width:200px" class="filter-item" placeholder="预约时间" />
        <el-select v-model="searchAppoint.itemid" style="width:200px" class="filter-item" placeholder="选择项目">
          <el-option
            v-for="item in itemOptions"
            :key="item.itemid"
            :label="item.name"
            :value="item.itemid"
          />
        </el-select>
        <el-select v-model="searchAppoint.status" style="width:200px" class="filter-item" placeholder="预约状态">
          <el-option label="待确认" value="0" />
          <el-option label="已确认" value="1" />
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
    >
      <template v-slot:operator="scopedata">

        <div class="btn">
          <el-button
            v-if="scopedata.scope.row.status===0"
            type="success"
            size="mini"
            @click.native.prevent="confirm(scopedata.scope.$index, scopedata.scope.row)"
          >

            确认
          </el-button>
          <el-button
            v-if="scopedata.scope.row.status===0"
            type="warning"
            size="mini"
            @click.native.prevent="cnacel(scopedata.scope.$index, scopedata.scope.row)"
          >

            取消预约
          </el-button>
          <el-button
            v-if="scopedata.scope.row.status===3&&scopedata.scope.row.itemid===2"
            type="warning"
            size="mini"
            @click.native.prevent="downloadMedicalRecord(scopedata.scope.$index, scopedata.scope.row)"
          >

            下载病历
          </el-button>
        </div>

      </template>
    </table-pane>
  </div>

</template>

<script>

import { getUserAppointList, confirmAppoint, cancelAppoint } from '@/api/appoint'
import tablePane from '@/components/tablePane2.vue'
import store from '@/store'
import { getItemInfoList } from '@/api/item'

export default {
  name: 'CheckApponitList',
  components: { tablePane },
  data() {
    return {
      userId: store.getters.userId,
      searchAppoint: {
        appointid: null,
        itemid: null,
        pet: {
          name: null
        },
        appointdate: null,
        status: null

      },
      itemOptions: [],
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
          {
            label: '宠物名',
            prop: 'pet.name',
            width: 100
          },
          {
            label: '项目名',
            prop: 'item.name',
            width: 100
          },

          {
            label: '主人名',
            prop: 'user.name',
            width: 100

          },

          // {
          //   label: '医生',
          //   prop: 'employeeid',
          //   width: 100
          // },
          {
            label: '负责员工',
            prop: 'emp.name',
            width: 100,
            isCodeTableFormatter: function(val) {
              if (val.emp === null) {
                return '无'
              } else {
                return val.emp.name
              }
            }
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
          width: '250', // 根据实际情况给宽度
          data: [

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
      this.searchAppoint.appointdate = null
      this.searchAppoint.status = null
      this.searchAppoint.itemid = null
      this.getList()
    },
    search() {
      this.getList()
    },
    // 获取列表数据
    getList() {
      this.dataSource.loading = true
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum,
        appointid: this.searchAppoint.appointid,
        itemid: this.searchAppoint.itemid,
        user: {
          userid: this.userId
        },
        pet: {
          name: this.searchAppoint.pet.name
        },
        appointdate: this.searchAppoint.appointdate,
        status: this.searchAppoint.status
      }

      getUserAppointList(data).then(res => {
        this.dataSource.loading = false
        // if (res.succeed) {
        if (res.total > 0) {
          this.dataSource.pageData.total = res.total
          this.dataSource.data = res.data
          this.getItemOptionsList()
          console.log(res.data)
        } else {
          this.dataSource.data = []
          this.dataSource.pageData.total = 0
        }
        // }
      })
    },
    getItemOptionsList() {
      const data = {
        pageNum: null,
        pageSize: null
      }
      getItemInfoList(data).then(res => {
        if (res.total > 0) {
          this.itemOptions = res.data
        }
      })
    },
    confirm(index, row) {
      const appointid = row.appointid

      confirmAppoint(appointid).then(res => {
        if (res.total > 0) {
          // alert(res.message)
          this.getList()
        }
      })
    },
    cnacel(index, row) {
      const appointid = row.appointid
      cancelAppoint(appointid).then(res => {
        if (res.total > 0) {
          this.getList()
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


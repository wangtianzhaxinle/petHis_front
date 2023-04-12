<template>

  <div class="app-container">
    <table-pane
      :data-source="dataSource"
      @changeSize="changeSize"
      @changeNum="changeNum"
    >
      <template v-slot:operator="scopedata">
        <div class="btn">
          <el-button
            type="info"
            size="mini"
            @click.native.prevent="editRoom(scopedata.scope.$index, scopedata.scope.row)"
          >

            完成配药
          </el-button>

        </div>

      </template>

    </table-pane>

  </div>

</template>
<script>

import tablePane from '@/components/tablePane2.vue'

// import moment from 'moment'
import 'moment/locale/zh-cn'
import store from '@/store'
import { getPrescribeListByUserId } from '@/api/prescribe'
export default {
  name: 'AllPerscribeList',
  components: { tablePane },

  data() {
    return {
      userId: store.getters.userId,
      appointDialogVisible: false,

      // 表格配置
      dataSource: {
        tool: [

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
                return '待完成'
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
    // moment.updateLocale()

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
      console.log('getMedicalRecordList')
      getPrescribeListByUserId(data).then(res => {
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


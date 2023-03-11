<template>
  <table-pane
    :data-source="dataSource"
    @changeSize="changeSize"
    @changeNum="changeNum"
  />

</template>

<script>

import { getDutyList } from '@/api/duty'
import tablePane from '@/components/tablePane.vue'

export default {
  name: 'DutyInfo',
  components: { tablePane },
  data() {
    return {
      // 搜索栏配置

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
            width: 40
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
          width: '100', // 根据实际情况给宽度
          data: [

            {
              label: '修改', // 操作名称
              type: 'warming',
              permission: 'editRow', // 后期这个操作的权限，用来控制权限
              handleRow: this.editRow
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

      this.dataSource.loading = true
      console.log('getAllPetInfoList')
      getDutyList(data).then(res => {
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


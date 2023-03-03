<template>
  <table-pane
    :data-source="dataSource"
    @changeSize="changeSize"
    @changeNum="changeNum"
  />

</template>

<script>
import { getPetListByUserId } from '@/api/pet'
import tablePane from '@/components/tablePane.vue'
import store from '@/store'
export default {
  name: 'PersonalPetInfo',
  components: { tablePane },
  data() {
    return {
      // 搜索栏配置
      userId: store.getters.userId,
      // 表格配置
      dataSource: {
        tool: [{
          name: '新增宠物',
          key: 1,
          permission: 2010701,
          handleClick: this.handleAdd
        }],
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
              label: '删除', // 操作名称
              type: 'danger',
              permission: '2010702', // 后期这个操作的权限，用来控制权限
              handleRow: this.handleRow
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


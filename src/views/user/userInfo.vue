<template>
  <div class="app-container"> <table-pane
    :data-source="dataSource"
    @changeSize="changeSize"
    @changeNum="changeNum"
  /></div>

</template>

<script>
import { getUserInfoList, deleteUserById } from '@/api/user'
import tablePane from '@/components/tablePane.vue'

export default {
  name: 'UserInfo',
  components: { tablePane },
  data() {
    return {
      // 搜索栏配置

      // 表格配置
      dataSource: {
        tool: [{
          name: '新增用户',
          key: 1,
          permission: 2010701,
          handleClick: this.handleAdd
        },
        {
          name: '全部删除',
          key: 2,
          permission: 2010701,
          handleClick: this.handleAdd
        }
        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'id',
            prop: 'userId'

          },
          {
            label: '名字',
            prop: 'name'
          },

          {
            label: '性别',
            prop: 'sex'

          },
          {
            label: '年龄',
            prop: 'age'

          },
          {
            label: '手机号',
            prop: 'phonenumber',
            width: 300
          },
          {
            label: '地址',
            prop: 'address'
          },
          {
            label: '用户名',
            prop: 'username'
          },
          {
            label: '密码',
            prop: 'password'
          },
          {
            label: '身份证号',
            prop: 'card'
          }, {
            label: '注册时间',
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
          width: '300', // 根据实际情况给宽度
          data: [
            {
              label: '删除', // 操作名称
              type: 'danger',
              permission: '2010702', // 后期这个操作的权限，用来控制权限
              handleRow: this.deleterow
            }, {
              label: '查看', // 操作名称
              type: 'info',
              permission: '2010702', // 后期这个操作的权限，用来控制权限
              handleRow: this.showrow
            },
            {
              label: '修改', // 操作名称
              type: 'warning',
              permission: '2010702', // 后期这个操作的权限，用来控制权限
              handleRow: this.editrow
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
      getUserInfoList(data).then(res => {
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
    },
    /*
    // 表格操作列回调
    handleRow(index, row, lable) {
      if (lable === '删除') {
        this.$confirm('确认删除该版本?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delVersion({ versionId: row.id }).then(res => {
            if (res.succeed) {
              this.$message.success('删除成功')
              this.getList()
            }
          })
        }).catch(() => {
        })
      }
    }
    **/
    deleterow(index, row) {
      console.log(row.id)
      deleteUserById(row.userId).then(res => {
        if (res.total > 0) {
          console.log(res.data)
          console.log('删除成功')
          this.getList
        }
      })
    }
  }
}
</script>


<template>

  <el-tabs
    v-model="menuTabsValue"
    type="card"
    @tab-click="handleClick"
  >
    <el-tab-pane
      v-for="item in menuTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >

      <div class="app-container">
        <table-pane
          :data-source="dataSource"
          @changeSize="changeSize"
          @changeNum="changeNum"
        />
      </div>
    </el-tab-pane>

  </el-tabs>
</template>
<script>

import tablePane from '@/components/tablePane.vue'
import { getEmployeeByDate } from '@/api/employee'
import { addAppoint } from '@/api/appoint'
import moment from 'moment'
import 'moment/locale/zh-cn'

export default {
  name: 'ApponitDoctor',
  components: { tablePane },

  data() {
    return {
      itemId: '',
      menuTabsValue: moment().add(1, 'days').format('L'),
      menuTabs: [
        {
          title: moment().add(1, 'days').format('L'),
          name: moment().add(1, 'days').format('L')

        },
        {
          title: moment().add(2, 'days').format('L'),
          name: moment().add(2, 'days').format('L')

        },
        {
          title: moment().add(3, 'days').format('L'),
          name: moment().add(3, 'days').format('L')

        }

      ],
      // 表格配置
      dataSource: {
        tool: [
        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'id',
            prop: 'employeeid',
            width: 100
          },
          {
            label: '名字',
            prop: 'user.name',
            width: 100
          },

          {
            label: '性别',
            prop: 'user.sex',
            width: 100

          },

          {
            label: '容量',
            prop: 'maxappoint',
            width: 100

          },
          {
            label: '入职时间',
            prop: 'hiredate'
          },

          {
            label: '学历',
            prop: 'educationbackground'
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
              permission: '2010702', // 后期这个操作的权限，用来控制权限
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
    this.getList(this.menuTabsValue)
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
      console.log(tab.name)
      this.getList(tab.name)
    },
    // 获取列表数据
    getList(appointtime) {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum,
        roleId: 4,
        appointtime: appointtime
      }
      this.dataSource.loading = true
      console.log('getItemInfoList')
      getEmployeeByDate(data).then(res => {
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
    apponitDoctor(index, row) {
      addAppoint().then(res => {

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


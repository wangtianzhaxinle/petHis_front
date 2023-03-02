<template>
  <div>
    <el-table
      :data="Sunday_AM"
      height="250"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="employeeName"
        label="星期天上午"
        width="180"
      /></el-table>

    <el-table
      :data="Monday_AM"
      height="250"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="employeeName"
        label="星期天上午"
        width="180"
      /></el-table>

    <el-table
      :data="Tuesday_AM"
      height="250"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="employeeName"
        label="星期一上午"
        width="180"
      /></el-table>

    <el-table
      :data="Wednesday_AM"
      height="250"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="employeeName"
        label="星期二上午"
      /></el-table>

    <el-table
      :data="Thursday_AM"
      height="250"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="employeeName"
        label="星期三上午"
      /></el-table>
    <el-table
      :data="Friday_AM"
      height="250"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="employeeName"
        label="星期四上午"
      /></el-table>

    <el-table
      :data="Saturday_AM"
      height="250"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="employeeName"
        label="星期五上午"
      /></el-table>
    <el-table
      :data="Sunday_AM"
      height="250"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="employeeName"
        label="星期六上午"
      /> </el-table>

    <!-- <el-table
      :data="PMData"
      height="250"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="Sunday_PM"
        label="星期天下午"
        width="180"
      />
      <el-table-column
        prop="Monday_PM"
        label="星期一下午"
        width="180"
      />
      <el-table-column
        prop="Tuesday_PM"
        label="星期二下午"
      />
      <el-table-column
        prop="Wednesday_PM"
        label="星期三下午"
      />
      <el-table-column
        prop="Thursday_PM"
        label="星期四下午"
      />
      <el-table-column
        prop="Friday_PM"
        label="星期五下午"
      />
      <el-table-column
        prop="Saturday_PM"
        label="星期六下午"
      />
    </el-table> -->
  </div>
</template>
<script>
import { getDutyList } from '@/api/duty'
export default {
  name: 'DutyeeInfo',
  data() {
    return {
      // 每当点击这个菜单项时vue都会卡死完全无法操作,只能强制退出,原因似乎是因为table需要一个array,可是:data绑定了一个对象

      Sunday_AM: [],
      Monday_AM: [],
      Tuesday_AM: [],
      Wednesday_AM: [],
      Thursday_AM: [],
      Friday_AM: [],
      Saturday_AM: [],

      Sunday_PM: [],
      Monday_PM: [],
      Tuesday_PM: [],
      Wednesday_PM: [],
      Thursday_PM: [],
      Friday_PM: [],
      Saturday_PM: []

    }
  },
  created() {
    this.getDutyList()
  }, methods: {
    getDutyList() {
      getDutyList().then(res => {
        // if (res.succeed) {
        if (res.total > 0) {
          this.Sunday_AM = res.data.sundayAMDuty
          // console.log(res.data)
          // console.log(res.data.sundayAMDuty)
          this.Monday_AM = res.data.Monday_AM
          this.Tuesday_AM = res.data.Tuesday_AM
          this.Wednesday_Am = res.data.Wednesday_Am
          this.Thursday_AM = res.data.Thursday_AM
          this.Friday_AM = res.data.Friday_AM
          this.Saturday_Am = res.data.Saturday_Am

          this.Monday_PM = res.data.Monday_PM
          this.Sunday_PM = res.data.Sunday_PM
          this.Monday_PM = res.data.Monday_PM
          this.Tuesday_PM = res.data.Tuesday_PM
          this.Wednesday_Pm = res.data.Wednesday_Pm
          this.Thursday_PM = res.data.Thursday_PM
          this.Friday_PM = res.data.Friday_PM
          this.Saturday_Pm = res.data.Saturday_Pm

          // console.log(res.data)
        }
        // }
      })
    }
  }
}
</script>

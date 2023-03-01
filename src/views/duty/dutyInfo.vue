<template>
  <div>
    <el-table
      :data="AMData"
      height="250"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="星期天上午"
        width="180"
      />
      <el-table-column
        prop="name"
        label="星期一上午"
        width="180"
      />
      <el-table-column
        prop="address"
        label="星期二上午"
      />
      <el-table-column
        prop="address"
        label="星期三上午"
      />
      <el-table-column
        prop="address"
        label="星期四上午"
      />
      <el-table-column
        prop="address"
        label="星期五上午"
      />
      <el-table-column
        prop="address"
        label="星期六上午"
      />
    </el-table>

    <el-table
      :data="PMData"
      height="250"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="星期天下午"
        width="180"
      />
      <el-table-column
        prop="name"
        label="星期一下午"
        width="180"
      />
      <el-table-column
        prop="address"
        label="星期二下午"
      />
      <el-table-column
        prop="address"
        label="星期三下午"
      />
      <el-table-column
        prop="address"
        label="星期四下午"
      />
      <el-table-column
        prop="address"
        label="星期五下午"
      />
      <el-table-column
        prop="address"
        label="星期六下午"
      />
    </el-table>
  </div>
</template>
<script>
import { getDutyList } from '@/api/duty'
export default {

  data() {
    return {
      AMData: {
        Sunday_AM: [],
        Monday_AM: [],
        Tuesday_AM: [],
        Wednesday_AM: [],
        Thursday_AM: [],
        Friday_AM: [],
        Saturday_AM: []

      }, PMData: {
        Sunday_PM: [],
        Monday_PM: [],
        Tuesday_PM: [],
        Wednesday_PM: [],
        Thursday_PM: [],
        Friday_PM: [],
        Saturday_PM: []
      }
    }
  },
  created() {
    this.getDutyList()
  }, methods: {
    getDutyList() {
      getDutyList().then(res => {
        this.dataSource.loading = false
        // if (res.succeed) {
        if (res.total > 0) {
          this.AMData.Monday_AM = res.data.Monday_AM
          this.AMData.Sunday_AM = res.data.Sunday_AM
          this.AMData.Monday_AM = res.data.Monday_AM
          this.AMData.Tuesday_AM = res.data.Tuesday_AM
          this.AMData.Wednesday_Am = res.data.Wednesday_Am
          this.AMData.Thursday_AM = res.data.Thursday_AM
          this.AMData.Friday_AM = res.data.Friday_AM
          this.AMData.Saturday_Am = res.data.Saturday_Am

          this.PMData.Monday_PM = res.data.Monday_PM
          this.PMData.Sunday_PM = res.data.Sunday_PM
          this.PMData.Monday_PM = res.data.Monday_PM
          this.PMData.Tuesday_PM = res.data.Tuesday_PM
          this.PMData.Wednesday_Pm = res.data.Wednesday_Pm
          this.PMData.Thursday_PM = res.data.Thursday_PM
          this.PMData.Friday_PM = res.data.Friday_PM
          this.PMData.Saturday_Pm = res.data.Saturday_Pm

          // console.log(res.data)
        }
        // }
      })
    }
  }
}
</script>

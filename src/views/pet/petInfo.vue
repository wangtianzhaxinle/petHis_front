<template>
  <div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        min-width="5%"
        type="selection"
      />

      <el-table-column label="id" min-width="5%">
        <template slot-scope="scope">
          {{ scope.row.pet_id }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="名字" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.pet_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="主人" min-width="5%">
        <template slot-scope="scope">
          {{ scope.row.master_id }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="年龄" min-width="5%">
        <template slot-scope="scope">
          {{ scope.row.age }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="品种" min-width="10%">
        <template slot-scope="scope">
          {{ scope.row.breed }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否健康" min-width="10%">
        <template slot-scope="scope">

          <p v-if="scope.row.ishealth==1">健康</p>
          <p v-else>不健康</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" min-width="10%">
        <template slot-scope="scope">
          <p v-if="scope.row.sex==1">公</p>
          <p v-else>母</p>

        </template>

      </el-table-column>
      <el-table-column align="center" label="操作" min-width="10%" />

    </el-table>
    <!--分页插件-->
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

</template>
<script>
import { getAllPetInfoList } from '@/api/pet'
export default {
  data() {
    return {
      currentPage: 1,
      list: null,
      listLoading: true
    }
  },
  created() {
    this.petData()
  },
  methods: {
    petData() {
      this.listLoading = true
      getAllPetInfoList().then(response => {
        // console.log(response.data.items)
        this.list = response.data
        console.log(this.list)
        this.listLoading = false
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }

}

</script>


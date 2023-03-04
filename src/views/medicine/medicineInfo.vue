<template>
  <div class="app-container">
    <table-pane
      :data-source="dataSource"
      @changeSize="changeSize"
      @changeNum="changeNum"
    />
    <el-dialog
      title="添加药物"
      :visible.sync="addDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="addMedicineForm" :model="medicine" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="名字" prop="name">
          <el-input v-model="medicine.name" />
        </el-form-item>

        <!-- <el-form-item label="头像" prop="desc">
          <el-avatar g :src="avatar" class="user-avatar" />
        </el-form-item> -->
        <!-- 上传图片这个地方花了我两个小时左右,一开始用action指定后台url传递图片显示图片为空
然后去改content-header怎么改都是application/json,后来发现改content-header后台就会报错:
"the request was rejected because no multipart boundary was found"
content-Type缺少boundry,不加就获取不到文件,最终在以下两个博客中得到了解决方法
https://www.jianshu.com/p/065ff72f483f
https://blog.csdn.net/weixin_44345975/article/details/123697991
前端真是个大坑 -->
        <el-form-item label="图像上传" prop="image">
          <!-- :on-success="onSuccess"
            :before-upload="beforeUpload"
             :show-file-list="false"
          -->
          <el-upload
            class="avatar-uploader"
            action="#"
            list-type="picture-card"
            limit="1"
            :http-request="uploadImg"
          >

            <!-- <div slot="file" slot-scope="{file}">
              <img
                :src="file.url"
                class="
                el-upload-list__item-thumbnail"
                alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in" />
                </span>
              </span>
            </div> -->
            <i slot="default" class="el-icon-plus" />
            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in" />
                </span>
              </span>
            </div>
          </el-upload>

        </el-form-item>

        <el-form-item label="公司" prop="company">
          <el-input v-model.number="medicine.company" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model.number="medicine.price" />
        </el-form-item>

        <el-form-item label="数量" prop="amount">
          <el-input v-model.number="medicine.amount" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="medicine.description" />
        </el-form-item>
        <el-form-item label="保质期" prop="Exp">
          <el-input v-model="medicine.Exp" />
        </el-form-item>
        <el-form-item label="批准文号" prop="authenticationcode">
          <el-input v-model="medicine.authenticationcode" />
        </el-form-item>
        <el-form-item label="是否处方药" prop="isprescription">

          <el-radio-group v-model="medicine.isprescription">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>

          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm">添加</el-button>
          <el-button @click="resetForm('addMedicineForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getMedicineList, addMedicineInfo } from '@/api/medicine'
import { upload } from '@/api/upload'

import tablePane from '@/components/tablePane.vue'
import store from '@/store'
export default {
  name: 'MedicineInfo',
  components: { tablePane },
  data() {
    return {
      // 搜索栏配置
      userId: store.getters.userId,
      addDialogVisible: false,
      editDialogVisible: false,
      previewVisible: '',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      baseurl: 'http://localhost:8080/petHis',
      rules: {
        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入公司', trigger: 'blur' }

        ],
        price: [

          { required: true, message: '请输入价格', trigger: 'blur' },
          { type: 'number', message: '请输入正确的价格', trigger: ['blur', 'change'] }

        ],
        amount: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { type: 'number', message: '请输入正确的数量', trigger: 'blur' }
        ],
        description: [
          { message: '请输入描述', trigger: 'blur' }
        ],
        Exp: [
          { required: true, message: '请输入保质期', trigger: 'blur' }

        ],
        authenticationcode: [
          { required: true, message: '请输入批准文号', trigger: 'blur' }

        ],
        isprescription: [
          { required: true, message: '请设置药品是否是处方药', trigger: 'change' }

        ]

      },
      medicine: {
        name: '',
        company: '',
        price: '',
        amount: '',
        description: '',
        Exp: '',
        authenticationcode: '',
        image: '',

        isprescription: ''
      },
      // 表格配置
      dataSource: {
        tool: [{
          name: '新增药物',
          key: 'addMedicine',
          permission: 'addMedicine',
          handleClick: this.addMedicine
        }],
        data: [], // 表格数据
        cols: [
          {
            label: 'id',
            prop: 'medicineid'

          },
          {
            label: '图片',
            prop: 'image'
          },
          {
            label: '名字',
            prop: 'name'
          },
          {
            label: '生产公司',
            prop: 'company'
          },
          {
            label: '价格',
            prop: 'price'

          },
          {
            label: '库存',
            prop: 'amount'

          },
          {
            label: '描述',
            prop: 'description',
            width: 100

          },
          {
            label: '保质期',
            prop: 'exp',
            width: 100

          },
          {
            label: '批准文号',
            prop: 'authenticationcode',
            width: 100

          },
          {
            label: '是否处方药别',
            prop: 'isprescription'

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
              type: 'deleteMedicine',
              permission: 'deleteMedicine', // 后期这个操作的权限，用来控制权限
              handleRow: this.deleteMedicine
            },
            {
              label: '修改', // 操作名称
              type: 'editMedicine',
              permission: 'editMedicine', // 后期这个操作的权限，用来控制权限
              handleRow: this.editMedicine
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
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.resetForm()
          done()
        })
        .catch(_ => {})
    },
    uploadImg(file) {
      /* const instance1 = axios.create({
        baseURL: 'localhost:8080/petHis',
        timeout: 6000,
        headers: {}
      })*/
      var form = new FormData()
      form.append('file', file.file)
      /* instance1.get('/upload/image', {
        data: form
      }).then(res => {
        console.log('res:', res.data)
      })*/
      upload(form).then(res => {
        if (res.total > 0) {
          alert(666)
          this.medicine.image = this.baseurl + res.data
        }
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = this.medicine.image
      this.dialogVisible = true
    },
    submitForm() {
      this.$refs.addMedicineForm.validate(valid => {
        if (valid) {
          this.loading = true
          const data = this.medicine
          console.log(data)
          addMedicineInfo(data).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addMedicine() {
      this.addDialogVisible = true
    },
    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum,
        userId: this.userId
      }

      this.dataSource.loading = true
      console.log('getAllPetInfoList')
      getMedicineList(data).then(res => {
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

    resetForm() { this.$refs.addMedicineForm.resetFields() },
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


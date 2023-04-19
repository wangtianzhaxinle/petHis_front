<template>
  <div class="app-container">
    <div>
      <div class="filter-container">
        <el-input v-model="searchMedicine.name" style="width:200px" class="filter-item" placeholder="药名" />
        <el-input v-model="searchMedicine.company" style="width:200px" class="filter-item" placeholder="公司" />
        <el-input v-model="searchMedicine.authenticationcode" style="width:200px" class="filter-item" placeholder="批准文号" />
        <el-select v-model="searchMedicine.isprescription" style="width:200px" class="filter-item" placeholder="是否处方药">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
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
    >  <template v-slot:image="data">
      <el-image
        style="width: 100px; height: 100px"
        :src="data.scope.row.image"
      />
    </template></table-pane>

    <el-dialog
      title="添加药物"
      :visible.sync="addDialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="MedicineForm" :model="medicine" :rules="rules" label-width="100px" class="demo-ruleForm">

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
            ref="pictureUpload"
            class="avatar-uploader"
            action="#"
            list-type="picture-card"
            :limit="1"
            :http-request="uploadImg"
            :file-list="filelist"
            :before-upload="beforeUpload"
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
                <span
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete" />
                </span>

              </span>
            </div>
          </el-upload>

        </el-form-item>

        <el-form-item label="公司" prop="company">
          <el-input v-model="medicine.company" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model.number="medicine.price" />
        </el-form-item>

        <el-form-item label="实际库存" prop="amount">
          <el-input v-model.number="medicine.amount" />
        </el-form-item>

        <el-form-item v-if="dialogtype==='edit'" label="当前库存" prop="nowAmount">
          <el-input v-model.number="medicine.nowAmount" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="medicine.unit" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="medicine.description" />
        </el-form-item>
        <el-form-item label="保质期" prop="exp">
          <el-input v-model="medicine.exp" />
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
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="resetForm('MedicineForm')">重置</el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { getMedicineList, addMedicineInfo, deleteMedicineById, updateMedicineInfo, deleteMedicineByIds } from '@/api/medicine'
import { upload } from '@/api/upload'
import rules from '@/utils/rules'
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
      isEditImage: false,
      dialogtype: '',
      baseurl: 'http://localhost:8080/petHis',

      filelist: [],
      searchMedicine: {
        name: null,
        company: null,
        authenticationcode: null,
        isprescription: null
      },
      editAuthenticationcode: '',
      rules: {

        name: [
          { required: true, message: '请输入名字', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '请输入公司', trigger: 'blur' }

        ],
        image: [
          { required: true, message: '请选择图片', trigger: 'change' }
        ],
        price: [

          { required: true, message: '请输入价格', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: ['blur', 'change'] },
          {
            validator(rule, value, callback) {
              if (value > 0) {
                callback()
              } else {
                callback(new Error('请输入正确的价格'))
              }
            },
            trigger: ['blur', 'change']
          }

        ],
        amount: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (value > 0) {
                callback()
              } else {
                callback(new Error('请输入正确的数量'))
              }
            },
            trigger: ['blur', 'change']
          }
        ],
        nowAmount: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' },
          {
            validator(rule, value, callback) {
              if (value > 0) {
                callback()
              } else {
                callback(new Error('请输入正确的数量'))
              }
            },
            trigger: ['blur', 'change']
          },
          { validator: (rule, value, callback) => {
            rules.checkMedicineNowAmount(value, callback, this.medicine.amount, this.medicine.nowAmount)
          },
          trigger: 'blur' }

        ],

        description: [
          { message: '请输入描述', trigger: 'blur' }
        ],
        exp: [
          { required: true, message: '请输入保质期', trigger: 'blur' }

        ],
        authenticationcode: [
          { required: true, message: '请输入批准文号', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              rules.checkAuthenticationcode(value, callback, this.editAuthenticationcode)
            },
            trigger: 'blur'
          }

        ],
        isprescription: [
          { required: true, message: '请设置药品是否是处方药', trigger: 'change' }

        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }

        ]

      },
      medicine: {
        medicineid: '',
        name: '',
        company: '',
        price: '',
        amount: '',
        description: '',
        nowAmount: '',
        exp: '',
        authenticationcode: '',
        image: '',
        isprescription: '',
        unit: ''
      },
      /*
      editMedicineInfo: {
        medicineid: '',
        name: '',
        company: '',
        price: '',
        amount: '',
        description: '',
        exp: '',
        authenticationcode: '',
        image: '',
        isprescription: ''
      },*/
      // 表格配置
      dataSource: {
        tool: [{
          name: '新增药物',
          key: 'addMedicine',
          // permission: 'addMedicine',
          handleClick: this.addMedicine
        },
        {
          name: '批量删除',
          key: 'batchDelete',
          // permission: 'addMedicine',
          handleClick: this.batchDelete
        }

        ],
        data: [], // 表格数据
        cols: [
          {
            label: 'id',
            prop: 'medicineid'

          },
          {
            label: '图片',
            prop: 'image',
            isTemplate: true // 这里要开启才能启用插槽
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
            label: '实际库存',
            prop: 'amount'

          },
          {
            label: '单位',
            prop: 'unit'

          },
          {
            label: '当前库存',
            prop: 'nowAmount'

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
            prop: 'isprescription',
            filter: function(val) {

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
          width: '100', // 根据实际情况给宽度
          data: [
            {
              label: '删除', // 操作名称
              type: 'danger',
              // permission: 'deleteMedicine', // 后期这个操作的权限，用来控制权限
              handleRow: this.deleteMedicine
            },
            {
              label: '修改', // 操作名称
              type: 'warning',
              //  permission: 'editMedicine', // 后期这个操作的权限，用来控制权限
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
    resetFilter() {
      this.searchMedicine.name = null
      this.searchMedicine.company = null
      this.searchMedicine.authenticationcode = null
      this.searchMedicine.isprescription = null
      this.getList()
    },
    search() {
      this.getList()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.resetForm()

          // this.$refs.pictureUpload.clearFiles()
          //  alert('filelist清空')
          this.filelist = []

          done()
        })
        .catch(_ => {})
    },
    beforeUpload(file) {
      // this.progressShow = true
      // this.fake = new FakeProgress({
      //   timeConstant: 10000,
      //   autoStart: true
      // })
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 < 200
      console.log(file.type)
      console.log(file.size)
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 200k!')
        return false
      }

      // console.log(isJPG && isLt2M)
      return isJPG && isLt2M
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
          // alert(res.message)
          this.medicine.image = this.baseurl + res.data
          console.log(this.medicine)
        }
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = this.medicine.image
      this.dialogVisible = true
    },
    handleRemove(file) {
      // this.$refs.upload.clearFiles()
      console.log('handleRemove')
      console.log(this.filelist)
      const uploadFiles = this.$refs.pictureUpload.uploadFiles
      for (const i in uploadFiles) {
        if (file.url === uploadFiles[i].url) {
          uploadFiles.splice(i, 1)
          this.medicine.image = ''
        }
      }
      console.log('handleRemove')
    },
    submitForm() {
      this.$refs.MedicineForm.validate(valid => {
        if (valid) {
          this.loading = true
          const MedicineInfo = this.medicine
          console.log(MedicineInfo)
          if (this.dialogtype === 'create') {
            addMedicineInfo(MedicineInfo).then(res => {
            // alert(this.$route.path)
              // alert(res.message)
              this.addDialogVisible = false
              this.resetForm()
              // this.$router.go(0)
              // this.$router.push({ path: this.$route.path || '/' })
              this.loading = false
              this.getList()
            }).catch(() => {
              this.loading = false
            })
          } else if (this.dialogtype === 'edit') {
            this.loading = true
            const MedicineInfo = this.medicine

            console.log(MedicineInfo)
            updateMedicineInfo(MedicineInfo).then(res => {
              this.addDialogVisible = false
              this.resetForm()
              // this.$router.go(0)
              // this.$router.push({ path: this.$route.path || '/' })
              this.loading = false
              this.getList()
            }).catch(() => {
              this.loading = false
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /*
    submitEditForm() {
      this.$refs.editMedicineForm.validate(valid => {
        if (valid) {
          this.loading = true
          const data = this.medicine
          console.log(data)
          updateMedicineInfo(data).then(res => {
            // alert(this.$route.path)
            alert(res.message)
            this.editDialogVisible = false
            this.resetForm()
            this.filelist = []
            // this.$router.go(0)
            // this.$router.push({ path: this.$route.path || '/' })
            this.loading = false
            this.getList()
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },*/
    addMedicine() {
      // this.addDialogVisible = true
      this.dialogtype = 'create'
      this.addDialogVisible = true
    },

    editMedicine(index, row) {
      // this.editDialogVisible = true
      // this.medicine = row
      // this.isEditImage = true
      // this.filelist.push({ 'url': this.medicine.image })
      this.dialogtype = 'edit'
      console.log('editMedicine')
      this.editAuthenticationcode = row.authenticationcode
      this.addDialogVisible = true
      // console.log('row')
      // console.log(row)
      // console.log('row')
      //
      // this.medicine = row 这里如果这样写会导致表格的行与medicine绑定,一旦重置表单,或是修改时添加行数据,都会导致列表数据变化
      // 当进入页面,先点击添加再点击编辑,会导致重置表单时将对应的行数据清空
      // 如果进入页面时,先点击编辑再点击添加,会导致进入添加时是第一次点击修改的行对应的数据,且重置会把数据恢复到第一次点击编辑的对应的行的数据
      // 上面的原因在于重置表单的初始值是进入页面第一次进入表单的初始值,添加使初始值都是空,所以能正常;
      // 可编辑时会先获取对应的行的数据赋值,所以导致初值固定在这个值了
      // this.medicine = row
      /* //this.medicine = row会导致列表行和medicine数据绑定,medicine变化时带动列表对应的行也一起变化
      //参考https://blog.csdn.net/u011096919/article/details/120369981
      //只能单独一个个赋值,如下,或是这样this.medicine = JSON.parse(JSON.stringify(row))
      this.medicine.medicineid = row.medicineid
      this.medicine.name = row.name
      this.medicine.company = row.company
      this.medicine.price = row.price
      this.medicine.amount = row.amount
      this.medicine.description = row.description
      this.medicine.exp = row.exp
      this.medicine.authenticationcode = row.authenticationcode
      this.medicine.image = row.image
      this.medicine.isprescription = row.isprescription

*/
      // this.medicine = JSON.parse(JSON.stringify(row))
      // 编辑时赋初值会导致表单初始值固定为这个,这样重置表单时无法重置到空,所以用this.$nextTick(()=>{})把赋初值的时间拖到medicine赋值为空之后
      // 参考https://www.jianshu.com/p/9b636f4b2c30
      this.$nextTick(() => {
        // 赋值
        this.medicine = JSON.parse(JSON.stringify(row))
        // console.log(this.medicine)
        this.filelist.push({ 'url': this.medicine.image })
      })
      // console.log(this.medicine)
      // this.filelist.push({ 'url': this.medicine.image })
    },
    deleteMedicine(index, row) {
      this.$confirm('确定要删除该药品信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMedicineById(row.medicineid
        ).then(res => {
          if (res.total > 0) {
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    batchDelete() {
      this.$confirm('确定要删除选中的药品信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const ids = this.selected.map((medicine) => medicine.medicineid)
        deleteMedicineByIds(ids).then(res => {
          if (res.total > 0) {
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取列表数据
    getList() {
      const data = {
        pageSize: this.dataSource.pageData.pageSize,
        pageNum: this.dataSource.pageData.pageNum,
        name: this.searchMedicine.name,
        company: this.searchMedicine.company,
        authenticationcode: this.searchMedicine.authenticationcode,
        isprescription: this.searchMedicine.isprescription
      }

      this.dataSource.loading = true
      //  console.log('getAllPetInfoList')
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

    resetForm() {
      // 当加入修改药品信息的对话框后,如果先打开添加药品对话框,再打开修改对话框,可以关闭,但是对应的药品信息的行会内容变空
      // 如果先打开修改对话框则无法退出对话框挑时候发现问题在 this.$refs.addMedicineForm.resetFields()
      // console.log(55555)
      this.$refs.MedicineForm.resetFields()
      // console.log(6666)
      this.$refs.pictureUpload.clearFiles()

      this.medicine.medicineid = ''
      // alert(this.medicine.medicineid)
      // console.log('filelist')
      console.log(this.filelist)
      this.filelist = []// 不加这行,在修改时删掉原先图片在上传新的图片,提交成功后,再点击修改进去表单会发现有两张图片
      // alert(this.medicineid)
      /* this.$refs.editMedicineForm.resetFields()
      this.filelist = []*/
    },
    /*
    reseteditForm() {
      // 当加入修改药品信息的对话框后,如果先打开添加药品对话框,再打开修改对话框,可以关闭,但是对应的药品信息的行会内容变空
      // 如果先打开修改对话框则无法退出对话框挑时候发现问题在 this.$refs.addMedicineForm.resetFields()
      console.log('edit66666')
      this.$refs.editMedicineForm.resetFields()

      // this.$refs.addMedicineForm.resetFields()
      console.log('edit7777')
      this.$refs.editpictureUpload.clearFiles()
      // this.$refs.editMedicineForm.resetFields()
      this.filelist = []
      this.filelist.push({ 'url': this.medicine.image })
    },
*/
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

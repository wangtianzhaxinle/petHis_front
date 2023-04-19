import { checkUsername, checkMedicineAmount, checkAuthenticationCode, checkPermissionCode } from '@/utils/validate'

// 验证纯数字
// const regNumber = /^[0-9]*$/

// 验证身份证
const IDRe18 = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
const IDre15 = /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/

// 验证邮箱
// const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/// 验证邮箱的正则表达式
var reg = /^1[3-9]\d{9}$/
export default {

  // 验证用户名
  //   checkRepeatUserName: function(rule, value, callback, test) {
  //     return async function(rule, value, callback) {
  //       // console.log('777')
  //       console.log(test)
  //       // console.log(rule.row)
  //       var flag = await checkUsername(value)
  //       // console.log('666')
  //       // console.log(flag)
  //       if (!flag) {
  //         callback()
  //       } else {
  //         callback(new Error('用户名已存在'))
  //       }
  //     }
  //   },
  checkRepeatUserName: async(value, callback, username) => {
    console.log('rules: ' + username)
    if (username !== null && value === username) {
      callback()
    }
    var flag = await checkUsername(value)
    if (!flag) {
      callback()
    } else {
      callback(new Error('用户名已存在'))
    }
  },

  checkMedicineAmount: async(value, callback, medicineid, count) => {
    // console.log(111)
    const data = {
      medicineid: medicineid,
      nowAmount: count
    }
    console.log(data)
    if (medicineid === null || medicineid === '' || medicineid === undefined) {
      callback(new Error('请先选择药品'))
    }
    // console.log(data)
    var flag = await checkMedicineAmount(data)
    console.log(flag)
    if (!flag) {
      callback()
    } else {
      callback(new Error('库存不足'))
    }
  },
  checkMedicineNowAmount: (value, callback, amount, nowAmount) => {
    console.log('amount' + amount)
    console.log('nowAmount' + nowAmount)
    if (amount < nowAmount) {
      callback(new Error('当前库存不能大于实际库存'))
    } else {
      callback()
    }
  },
  // 校验批准文号是否在数据库已存在
  checkAuthenticationcode: async(value, callback, Authenticationcode) => {
    console.log(Authenticationcode)
    if (Authenticationcode !== null && value === Authenticationcode) {
      callback()
    }
    var flag = await checkAuthenticationCode(value)
    if (!flag) {
      callback()
    } else {
      callback(new Error('批准文号已存在'))
    }
  },
  checkPermissionCode: async(value, callback, permissionCode) => {
    console.log(permissionCode)
    if (permissionCode !== null && value === permissionCode) {
      callback()
    }
    var flag = await checkPermissionCode(value)
    if (!flag) {
      callback()
    } else {
      callback(new Error('权限码已存在'))
    }
  },
  // 验证身份证
  checkIdCard: (rule, value, callback) => {
    // 校验身份证：
    if (IDRe18.test(value) || IDre15.test(value)) {
      callback()
    } else {
      callback(new Error('身份证不合法！！！'))
    }
  },

  // 验证手机号
  checkPhone: (rule, value, callback) => {
    // value = value.replace(/\s*/g, '')// 去除空格
    if (value.toString().length !== 11) {
      return callback(new Error('手机号码必须是11位数字'))
    } else if (!reg.test(value)) {
      return callback(new Error('请输入有效的手机号码'))
    } else {
      callback()
    }
  }
}


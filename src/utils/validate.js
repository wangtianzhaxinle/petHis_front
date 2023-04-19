import { isRepeatUsername } from '@/api/user'
import { checkAmountByMedicineId, isRepeatAuthenticationCode } from '@/api/medicine'
import { isRepeatPermissionCode } from '@/api/permission'
/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
// 判断字符串是否是https?:|mailto:|tal: 开头的
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
// 校验是否是有效的用户名
export function validUsername(str) {
  // const valid_map = ['admin', 'editor']

  // return valid_map.indexOf(str.trim()) >= 0
  return true
}

export function validPhoneNumber(phoneNumber) {
  // 手机号格式正确返回true,否则返回false
  return /^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(phoneNumber)
}

export async function checkUsername(username) {
  // const data = JSON.stringify(username)
  var flag = true
  return new Promise((resolve, reject) => {
    isRepeatUsername(username).then(res => {
    // console.log('res.toal' + res.total)
      if (res.total > 0) {
        // console.log('return false')
        flag = false
      } else {
      //  console.log('return true')
        flag = true
      }
      resolve(flag)
    })
  })
  // return flag
}

export async function checkAuthenticationCode(authenticationCode) {
  // const data = JSON.stringify(username)
  var flag = true
  return new Promise((resolve, reject) => {
    isRepeatAuthenticationCode(authenticationCode).then(res => {
      if (res.total > 0) {
        flag = false
      } else {
        flag = true
      }
      resolve(flag)
    })
  })
  // return flag
}

export async function checkPermissionCode(permissionCode) {
  // const data = JSON.stringify(username)
  var flag = true
  return new Promise((resolve, reject) => {
    isRepeatPermissionCode(permissionCode).then(res => {
    // console.log('res.toal' + res.total)
      if (res.total > 0) {
        // console.log('return false')
        flag = false
      } else {
      //  console.log('return true')
        flag = true
      }
      resolve(flag)
    })
  })
  // return flag
}
export async function checkMedicineAmount(data) {
  // const data = JSON.stringify(username)
  var flag = true
  return new Promise((resolve, reject) => {
    checkAmountByMedicineId(data).then(res => {
      if (res.total > 0) {
        flag = false
      } else {
        flag = true
      }
      resolve(flag)
    })
  // return flag
  })
}
export async function checkCard(card) {
  // const data = JSON.stringify(username)
  var flag = true
  return new Promise((resolve, reject) => {
    checkCard(card).then(res => {
    // console.log('res.toal' + res.total)
      if (res.total > 0) {
        // console.log('return false')
        flag = false
      } else {
      //  console.log('return true')
        flag = true
      }
      resolve(flag)
    })
  })
  // return flag
}

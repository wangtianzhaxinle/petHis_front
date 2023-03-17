import { isRepeatUsername } from '@/api/user'

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

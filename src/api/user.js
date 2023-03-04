import request from '@/utils/request'

export function getUserInfoList(data) {
  return request({
    url: '/user/getUserInfoList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum
    }

  })
} export function getPersonalUserInfo(userId) {
  return request({
    url: '/user/getPersonalUserInfo',
    method: 'get',
    params: {
      userId
    }

  })
}
export function deleteUserById(userId) {
  return request({
    url: '/user/deleteUserById/' + userId,
    method: 'delete'

  })
}
export function deleteUserByIds(data) {
  return request({
    url: '/user/deleteUserByIds',
    method: 'post',
    data
  })
}
// 这里又把url写错了,后端是/user/RegisterUser,前端是/user/registerUser
export function registerUser(data) {
  return request({
    url: '/user/registerUser',
    method: 'post',
    data
  })
}

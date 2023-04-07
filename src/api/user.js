import request from '@/utils/request'

export function getUserInfoList(data) {
  return request({
    url: '/user/getUserInfoList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum,
      name: data.name,
      username: data.username,
      address: data.address,
      sex: data.sex,
      isEmployee: data.isEmployee,
      isDelete: data.isDelete
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
    url: '/user/deleteUserById',
    method: 'delete',
    params: { userId: userId }
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
export function addUser(data) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data
  })
}
export function updateUserById(data) {
  return request({
    url: '/user/updateUserById',
    method: 'post',
    data
  })
}

export async function isRepeatUsername(username) {
  return request({
    url: '/user/isRepeatUsername',
    method: 'post',
    data: { username }
  })
}


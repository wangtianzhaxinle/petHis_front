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
} export function getPersonalUserInfo(user_id) {
  return request({
    url: '/user/getPersonalUserInfo',
    method: 'get',
    params: {
      user_id
    }

  })
}
export function deleteUserById(user_id) {
  return request({
    url: '/user/deleteUserById/' + user_id,
    method: 'delete'

  })
}

import request from '@/utils/request'

export function getPermissionList(data) {
  return request({
    url: '/permission/getPermissionList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum
    }

  })
}
export function deletePermissionById(id) {
  return request({
    url: '/permission/deletePermissionById',
    method: 'delete',
    params: {
      id: id
    }

  })
}
export function deletePermissionByIds(data) {
  return request({
    url: '/permission/deletePermissionByIds',
    method: 'post',
    data
  })
}
export function getPermissionTree() {
  return request({
    url: '/permission/getPermissionTree',
    method: 'get'

  })
}

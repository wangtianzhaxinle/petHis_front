import request from '@/utils/request'

export function getPermissionList(data) {
  return request({
    url: '/permission/getPermissionList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum,
      name: data.name,
      url: data.url,
      permissioncode: data.permissionCode,
      type: data.type,
      parentid: data.parentid
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

export function getFatherPermissionList() {
  return request({
    url: '/permission/getFatherPermissionList',
    method: 'get'

  })
}

export function updatePermissionById(data) {
  return request({
    url: '/permission/updatePermissionById',
    method: 'post',
    data
  })
}
export function addPermission(data) {
  return request({
    url: '/permission/addPermission',
    method: 'post',
    data
  })
}

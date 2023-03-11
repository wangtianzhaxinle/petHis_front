
import request from '@/utils/request'

export function getRoleList(data) {
  return request({
    url: '/role/getRoleList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum
    }

  })
}
export function deleteRoleById(id) {
  return request({
    url: '/role/deleteRoleById',
    method: 'delete',
    params: {
      id: id
    }
  })
}

export function getPermissionByRoleId(roleId) {
  return request({
    url: '/role/getPermissionByRoleId',
    method: 'get',
    params: {
      roleId
    }

  })
}

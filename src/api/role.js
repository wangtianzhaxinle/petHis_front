
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

export function getAllRoleList() {
  return request({
    url: '/role/getAllRoleList',
    method: 'get'

  })
}

export function getRoleByUserId(userId) {
  return request({
    url: '/role/getRoleByUserId',
    method: 'get',
    params: {
      userId: userId

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

export function updatePermissionByRoleId(data) {
  return request({
    url: '/role/updatePermissionByRoleId',
    method: 'post',
    data
  })
}

export function addRole(data) {
  return request({
    url: '/role/addRole',
    method: 'post',
    data
  })
}

export function updateRoleByRoleId(data) {
  return request({
    url: '/role/updateRoleByRoleId',
    method: 'post',
    data
  })
}

export async function updateRoleByUserId(data) {
  return request({
    url: '/role/updateRoleByUserId',
    method: 'post',
    data
  })
}

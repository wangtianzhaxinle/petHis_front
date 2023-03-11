import request from '@/utils/request'

export function getEmployeeList(data) {
  return request({
    url: '/employee/getEmployeeList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum
    }

  })
}
export function getEmployeePersonalInfo(userId) {
  return request({
    url: '/employee/getEmployeeInfoById',
    method: 'get',
    params: {
      userId
    }

  })
}
export function getEmployeeListByRoleId(data) {
  return request({
    url: '/employee/getEmployeeListByRoleId',
    method: 'get',
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      roleId: data.roleId
    }

  })
}

export function getEmployeeByTomorrow(data) {
  return request({
    url: '/employee/getEmployeeByTomorrow',
    method: 'get',
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      roleId: data.roleId
    }

  })
}

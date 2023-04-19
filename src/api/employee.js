import request from '@/utils/request'

export function getEmployeeList(data) {
  return request({
    url: '/employee/getEmployeeList',
    method: 'post',
    data

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
// export function getEmployeeListByRoleId(data) {
//   return request({
//     url: '/employee/getEmployeeListByRoleId',
//     method: 'get',
//     params: {
//       pageNum: data.pageNum,
//       pageSize: data.pageSize,
//       roleId: data.roleId
//     }

//   })
// }

export function getEmployeeByDate(data) {
  return request({
    url: '/employee/getEmployeeByDate',
    method: 'get',
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      roleId: data.roleId,
      appointtime: data.appointtime
    }

  })
}

export function addEmployee(data) {
  return request({
    url: '/employee/addEmployee',
    method: 'post',
    data

  })
}

export function updateEmployeeById(data) {
  return request({
    url: '/employee/updateEmployeeById',
    method: 'post',
    data

  })
}

export function deleteEmployeeById(params) {
  return request({
    url: '/employee/deleteEmployeeById',
    method: 'delete',
    params

  })
}
export function deleteEmployeeByIds(data) {
  return request({
    url: '/employee/deleteEmployeeByIds',
    method: 'post',
    data

  })
}

export function getMedicinerList() {
  return request({
    url: '/employee/getMedicinerList',
    method: 'get'

  })
}

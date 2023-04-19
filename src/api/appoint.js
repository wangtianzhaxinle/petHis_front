import request from '@/utils/request'

export function getAppointList(data) {
  return request({
    url: '/appoint/getAppointList',
    method: 'post',
    data

  })
}

export function getAppointIdList() {
  return request({
    url: '/appoint/getAppointIdList',
    method: 'get'

  })
}
// export function getAppointPersonalInfo(data) {
//   return request({
//     url: '/appoint/getAppointPersonalInfo',
//     method: 'post',
//     data

//   })
// }

export function addAppoint(data) {
  return request({
    url: '/appoint/addAppoint',
    method: 'post',
    data

  })
}

// export function getAppointListByEmpAndItem(data) {
//   return request({
//     url: '/appoint/getAppointListByEmpAndItem',
//     method: 'get',
//     params: {
//       pageSize: data.pageSize,
//       pageNum: data.pageNum,
//       itemId: data.itemid,
//       employeeid: data.employeeid
//     }

//   })
// }

export function getAppointListByEmp(data) {
  return request({
    url: '/appoint/getAppointListByEmp',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum,
      employeeid: data.employeeid,
      status: data.status
    }

  })
}

export function addCheck(data) {
  return request({
    url: '/appoint/addCheck',
    method: 'post',
    data

  })
}

export function getUserAppointList(data) {
  return request({
    url: '/appoint/getUserAppointList',
    method: 'post',
    data

  })
}

export function getTodayAppointList(data) {
  return request({
    url: '/appoint/getTodayAppointList',
    method: 'post',
    data

  })
}

export function addDeposit(data) {
  return request({
    url: '/appoint/addDeposit',
    method: 'post',
    data

  })
}

export function confirmAppoint(appointid) {
  return request({
    url: '/appoint/confirmAppoint',
    method: 'get',
    params: {
      appointid: appointid
    }

  })
}
export function getAppointNumber(data) {
  return request({
    url: '/appoint/getAppointNumber',
    method: 'post',
    data

  })
}

export function cancelAppoint(id) {
  return request({
    url: '/appoint/cancelAppoint',
    method: 'get',
    params: {
      appointid: id
    }

  })
}

export function diagnoses(params) {
  return request({
    url: '/appoint/diagnoses',
    method: 'get',
    params

  })
}
export function finishInjection(params) {
  return request({
    url: '/appoint/finishInjection',
    method: 'get',
    params

  })
}
export function endDiagnoses(params) {
  return request({
    url: '/appoint/endDiagnoses',
    method: 'get',
    params

  })
}

export function remind(params) {
  return request({
    url: '/appoint/remind',
    method: 'get',
    params

  })
}
export function deleteAppointById(params) {
  return request({
    url: '/appoint/deleteAppointById',
    method: 'get',
    params

  })
}
export function deleteAppointByIds(data) {
  return request({
    url: '/appoint/deleteAppointByIds',
    method: 'post',
    data

  })
}
export function finishDeposit(params) {
  return request({
    url: '/appoint/finishDeposit',
    method: 'get',
    params

  })
}

import request from '@/utils/request'

export function getAppointList(data) {
  return request({
    url: '/appoint/getAppointList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum
    }

  })
}
export function getAppointPersonalInfo(userId) {
  return request({
    url: '/appoint/getAppointPersonalInfo',
    method: 'get',
    params: {
      userId
    }

  })
}

export function addAppoint(data) {
  return request({
    url: '/appoint/addAppoint',
    method: 'post',
    data

  })
}

export function getAppointListByEmpAndItem(data) {
  return request({
    url: '/appoint/getAppointListByEmpAndItem',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum,
      itemId: data.itemid,
      employeeid: data.employeeid
    }

  })
}

export function getAppointListByEmp(data) {
  return request({
    url: '/appoint/getAppointListByEmp',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum,
      employeeid: data.employeeid
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
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum,
      userId: data.userId
    }

  })
}

export function getTodayAppointList(data) {
  return request({
    url: '/appoint/getTodayAppointList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum
    }

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

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

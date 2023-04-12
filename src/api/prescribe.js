import request from '@/utils/request'

export function getPrescribeList(data) {
  return request({
    url: '/prescribe/getPrescribeList',
    method: 'post',
    data
  })
}

export function getPrescribeListByUserId(data) {
  return request({
    url: '/prescribe/getPrescribeListByUserId',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum,
      userId: data.userId
    }
  })
}
export function deletePrescribeById(id) {
  return request({
    url: '/prescribe/deletePrescribeById',
    method: 'delete',
    params: {
      id: id
    }
  })
}
export function deletePrescribeByIds(data) {
  return request({
    url: '/prescribe/deletePrescribeByIds',
    method: 'post',
    data
  })
}

export function updatePrescribeById(data) {
  return request({
    url: '/prescribe/updatePrescribeById',
    method: 'post',
    data
  })
}

export function addPrescribe(data) {
  return request({
    url: '/prescribe/addPrescribe',
    method: 'post',
    data
  })
}

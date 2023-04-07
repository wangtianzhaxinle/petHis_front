import request from '@/utils/request'

export function getPrescribeList(data) {
  return request({
    url: '/prescribe/getPrescribeList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum
    }
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

import request from '@/utils/request'

export function getPetList(data) {
  return request({
    url: '/pet/getPetList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum
    }

  })
}
export function getPetListByUserId(data) {
  return request({
    url: '/pet/getPetListByUserId',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum,
      userId: data.userId
    }

  })
}

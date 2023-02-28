import request from '@/utils/request'

export function getAllPetInfoList(data) {
  return request({
    url: '/pet/getAllPetInfoList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum
    }

  })
}

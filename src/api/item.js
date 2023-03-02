import request from '@/utils/request'

export function getItemInfoList(data) {
  return request({
    url: '/item/getItemInfoList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum
    }
  })
}

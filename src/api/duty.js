import request from '@/utils/request'

export function getDutyList(data) {
  return request({
    url: '/duty/getDutyList',
    method: 'get',
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize
    }

  })
}

export function updateDutyByDutyId(data) {
  return request({
    url: '/duty/updateDutyByDutyId',
    method: 'post',
    data

  })
}

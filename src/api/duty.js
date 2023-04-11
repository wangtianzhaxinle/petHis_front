import request from '@/utils/request'

export function getDutyList(data) {
  return request({
    url: '/duty/getDutyList',
    method: 'post',
    data: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      user: {
        name: data.name
      }
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

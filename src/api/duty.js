import request from '@/utils/request'

export function getDutyList() {
  return request({
    url: '/duty/getDutyList',
    method: 'get'

  })
}

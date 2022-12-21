import request from '@/utils/request'

export function getAllPetInfoList() {
  return request({
    url: '/vue-admin-template/pet/getAllPetInfoList',
    method: 'get'

  })
}

import request from '@/utils/request'

export function getPetList(data) {
  return request({
    url: '/pet/getPetList',
    method: 'post',
    data
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

export function deletePetById(id) {
  return request({
    url: '/pet/deletePetById',
    method: 'delete',
    params: {
      id: id
    }

  })
}

export function deletePetByIds(data) {
  return request({
    url: '/pet/deletePetByIds',
    method: 'post',
    data

  })
}

export function addPet(data) {
  return request({
    url: '/pet/addPet',
    method: 'post',
    data

  })
}
export function updatePetById(data) {
  return request({
    url: '/pet/updatePetById',
    method: 'post',
    data

  })
}

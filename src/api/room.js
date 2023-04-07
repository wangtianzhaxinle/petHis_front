import request from '@/utils/request'

export function getRoomList(data) {
  return request({
    url: '/room/getRoomList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum,
      name: data.name,
      status: data.status,
      appointid: data.appointid
    }

  })
}
export function addRoom(data) {
  return request({
    url: '/room/addRoom',
    method: 'post',
    data

  })
}
export function updateRoomById(data) {
  return request({
    url: '/room/updateRoomById',
    method: 'post',
    data
  })
}
export function deleteRoomById(id) {
  return request({
    url: '/room/deleteRoomById',
    method: 'get',
    params: { id: id }
  })
}
export function deleteRoomByIds(data) {
  return request({
    url: '/room/deleteRoomByIds',
    method: 'post',
    data
  })
}

export function takeBackPetById(id) {
  return request({
    url: '/room/takeBackPetById',
    method: 'get',
    params: { id: id }
  })
}

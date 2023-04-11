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
export function addItem(data) {
  return request({
    url: '/item/addItem',
    method: 'post',
    data
  })
}
export function deleteItembyId(id) {
  return request({
    url: '/item/deleteItembyId',
    method: 'delete',
    params: {
      id
    }
  })
}
export function updateItemById(data) {
  return request({
    url: '/item/updateItemById',
    method: 'post',
    data
  })
}
export function deleteItemByIds(data) {
  return request({
    url: '/item/deleteItemByIds',
    method: 'post',
    data
  })
}

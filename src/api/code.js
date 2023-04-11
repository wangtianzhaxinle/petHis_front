import request from '@/utils/request'

export function getCodeImage(data) {
  return request({
    url: '/code/getCodeImage/' + data,
    method: 'get'
  })
}

export function getCode(data) {
  return request({
    url: '/code/getCodeImage',
    method: 'post',
    data
  })
}

export function submitCode(data) {
  return request({
    url: '/code/getCodeImage',
    method: 'post',
    data
  })
}

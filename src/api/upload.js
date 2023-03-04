import request from '@/utils/request'

export function upload(form) {
  return request({
    url: '/upload/image',
    method: 'post',

    data: form
  })
}

import request from '@/utils/request'

export function getMedicineList(data) {
  return request({
    url: '/medicine/getMedicineList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum
    }

  })
}
export function getMedicineInfoById(medicineId) {
  return request({
    url: '/medicine/getMedicineInfoById',
    method: 'get',
    params: {

      medicineId
    }

  })
}

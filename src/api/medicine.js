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
export function addMedicineInfo(data) {
  return request({
    url: '/medicine/addMedicineInfo',
    method: 'post',

    data

  })
}
export function deleteMedicineById(id) {
  return request({
    url: '/medicine/deleteMedicineById/' + id,
    method: 'delete'

  })
}
export function updateMedicineInfo(data) {
  return request({
    url: '/medicine/updateMedicineInfo',
    method: 'post',

    data

  })
}
export function getMedicineListByName(name) {
  return request({
    url: '/medicine/getMedicineListByName',
    method: 'get',
    params: {
      name: name
    }

  })
}

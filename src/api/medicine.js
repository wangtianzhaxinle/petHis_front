import request from '@/utils/request'

export function getMedicineList(params) {
  return request({
    url: '/medicine/getMedicineList',
    method: 'get',
    params
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

export function deleteMedicineByIds(data) {
  return request({
    url: '/medicine/deleteMedicineByIds',
    method: 'post',
    data
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

export function checkAmountByMedicineId(data) {
  return request({
    url: '/medicine/checkAmountByMedicineId',
    method: 'post',
    data

  })
}

export function isRepeatAuthenticationCode(AuthenticationCode) {
  return request({
    url: '/medicine/isRepeatAuthenticationCode',
    method: 'get',
    params: {
      authenticationCode: AuthenticationCode
    }

  })
}

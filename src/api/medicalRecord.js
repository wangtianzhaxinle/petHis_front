import request from '@/utils/request'

export function getMedicalRecordList(data) {
  return request({
    url: '/MedicalRecord/getMedicalRecordList',
    method: 'post',
    data
  })
}
export function updateMedicalRecordById(data) {
  return request({
    url: '/MedicalRecord/updateMedicalRecordById',
    method: 'post',
    data
  })
}

export function downloadMedicalRecord(appointid) {
  return request({
    url: '/downloading/PDF/' + appointid,
    method: 'get'

  })
}

export function getMedicineRecordById(params) {
  return request({
    url: '/MedicalRecord/getMedicineRecordById',
    method: 'get',
    params

  })
}
export function addMedicalRecord(data) {
  return request({
    url: '/MedicalRecord/addMedicalRecord',
    method: 'post',
    data

  })
}

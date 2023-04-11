import request from '@/utils/request'

export function getMedicalRecordList(data) {
  return request({
    url: '/MedicalRecord/getMedicalRecordList',
    method: 'get',
    params: {
      pageSize: data.pageSize,
      pageNum: data.pageNum
    }
  })
}
export function updateMedicalRecordById(data) {
  return request({
    url: '/MedicalRecord/updateMedicalRecordById',
    method: 'post',
    data
  })
}

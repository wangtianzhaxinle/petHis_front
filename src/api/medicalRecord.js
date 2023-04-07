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

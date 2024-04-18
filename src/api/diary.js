import request from '@/utils/request'

// 添加日记
export const addDiaryAPI = (data) => {
  return request.post('/diary/add', data)
}

// 查询日记
export const getDiaryAPI = (data) => {
  return request.post('/diary/list', data)
}

// 根据diaryId获取日记
export const getDiaryByIdAPI = (diaryId) => {
  return request.get(`/diary/get/${diaryId}`)
}

// 根据diaryId修改日记
export const updateDiaryAPI = (data) => {
  return request.put('/diary/update', data)
}

// 分享日记
export const shareDiaryAPI = (data) => {
  return request.post('/diary/share', data)
}

// 删除日记
export const falseDeleteDiaryAPI = (diaryId) => {
  return request.put(`/diary/update/${diaryId}`)
}

// 收到的日记
export const getReceivedDiaryAPI = (data) => {
  return request.post('/diary/received', data)
}

// 根据id查询收到的日记详情
export const getReceivedDiaryByIdAPI = (diaryId) => {
  return request.get(`/diary/received/${diaryId}`)
}

// 根据需要恢复的日记
export const getNeedRestoreDiaryAPI = (data) => {
  return request.post('/diary/recycle', data)
}

// 根据id查询需要恢复日记详情
export const getNeedRestoreDiaryByIdAPI = (diaryId) => {
  return request.get(`/diary/recycle/${diaryId}`)
}

// 根据id恢复日记
export const restoreDiaryAPI = (diaryId) => {
  return request.put(`/diary/restore/${diaryId}`)
}

// 根据id删除日记
export const deleteDiaryAPI = (diaryId) => {
  return request.delete(`/diary/delete/${diaryId}`)
}

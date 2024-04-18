import request from "@/utils/request";

// 获取图形验证码
export const getCodeBase = (username) => {
  return request.get('/common/code?username=' + username)
}
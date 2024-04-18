import request from "@/utils/request";

// 用户登录
export const loginApi = (username, password, code, authType) => {
  return request.get("/user/login", { params: { username, password, code, authType } });
}

// 用户注册
export const registerApi = (data) => {
  return request.post("/user/register", data);
}

// 退出登录
export const logoutApi = () => {
  return request.post("/user/logout");
}
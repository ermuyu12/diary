import axios from "axios";
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus';
import { getInfo } from '@/utils/storage'

// 创建 Loading 实例
let loadingInstance;

// 后端基地址
const baseURL = '/api';
// 请求实例
const instance = axios.create({
  baseURL,
});
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const result = getInfo()
  config.headers['token'] = result.token
  // 在发送请求之前显示加载动画
  loadingInstance = ElLoading.service({ fullscreen: true });
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  // 在响应完成后隐藏加载动画
  loadingInstance.close();
  if (response.data.code === 500 && response.data.msg === 'NOTLOGIN') {
    // 登录过期
    ElMessageBox.confirm('您登录过期，是否跳转到登录页面？', '提示', {
      confirmButtonText: '确定',
      showCancelButton: false,
      closeOnClickModal: false, // 允许点击遮罩层关闭弹框
      type: 'warning'
    }).then(() => {
      // 用户点击确定，跳转到登录页面
      window.location.href = '/login';
    }).catch(() => {
      window.location.href = '/login';
    });
    return Promise.reject(response.data)
  }
  if (response.data.code === 200) {
    return response.data;
  }

  ElMessage({ message: response.data.msg || '服务异常', type: 'error' })
  return Promise.reject(response.data);
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  // 在响应完成后隐藏加载动画
  loadingInstance.close();

  ElMessage({ message: error.response.data.msg || '服务异常', type: 'error' })
  return Promise.reject(error);
});

export default instance
export { baseURL }

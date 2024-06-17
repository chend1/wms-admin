import axios from 'axios';
import { ElMessage } from 'element-plus';
// import { getStorage } from '@/utils/storage';
import { useMainStore } from '@/store';

const baseUrl = import.meta.env.MODE === 'development'
  ? '/api'
  : import.meta.env.VITE_BASE_URL;

const request = axios.create({
  baseURL: baseUrl,
  timeout: 35000,
});
// 请求前拦截
request.interceptors.request.use((config) => {
  const baseStore = useMainStore();
  const { token } = baseStore;
  const companyId = baseStore.companyInfo.show_company_id || baseStore.companyInfo.company_id;
  const roleLevel = baseStore.userInfo.role_level;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.company_id = companyId || -1;
    config.headers.role_level = roleLevel || 1;
  }
  return config;
});
// 请求成功拦截
const successCallback = (response) => {
  const {
    message, code, data,
  } = response.data;
  if (code === 200) {
    return data;
  }
  ElMessage.error(`错误码${code}，${message}`);
  if (code === 401) {
    const baseStore = useMainStore();
    baseStore.logOut();
    return Promise.reject(response);
  }
  return Promise.reject(response);
};

// 请求失败拦截
const errorCallback = (error) => {
  ElMessage.error(error.message);
  return Promise.reject(error);
};
request.interceptors.response.use(successCallback, errorCallback);
export default request;

import request from '../request';
// 获取公司列表
export const companyList = (params) => request.get('/company/list', { params });

// 新增公司信息
export const addCompany = (data) => request.post('/company/add', data);

// 修改公司信息
export const editCompany = (data) => request.post('/company/edit', data);

// 签约公司
export const signCompany = (data) => request.post('/company/sign', data);

// 删除公司信息
export const deleteCompany = (data) => request.post('/company/delete', data);

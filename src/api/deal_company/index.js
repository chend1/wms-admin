import request from '../request';
// 获取往来公司列表
export const dealCompanyList = params =>
  request.get('/company/deal/list', { params });

// 新增往来公司信息
export const addDealCompany = data => request.post('/company/deal/add', data);

// 修改往来公司信息
export const editDealCompany = data => request.post('/company/deal/edit', data);

// 删除往来公司信息
export const deleteDealCompany = data =>
  request.post('/company/deal/delete', data);


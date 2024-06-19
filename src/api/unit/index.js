import request from '../request';
// 获取单位列表
export const unitList = (params) => request.get('/product/unit/list', { params });

// 修改单位信息
export const editUnit = (data) => request.post('/product/unit/edit', data);

// 新增单位信息
export const addUnit = (data) => request.post('/product/unit/add', data);

// 删除单位信息
export const deleteUnit = (data) => request.post('/product/unit/delete', data);

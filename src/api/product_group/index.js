import request from '../request';
// 获取产品分类列表
export const groupList = (params) => request.get('/product/class/list', { params });

// 修改产品分类信息
export const editGroup = (data) => request.post('/product/class/edit', data);

// 新增产品分类信息
export const addGroup = (data) => request.post('/product/class/add', data);

// 删除产品分类信息
export const deleteGroup = (data) => request.post('/product/class/delete', data);

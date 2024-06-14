import request from '../request';
// 获取账号列表
export const userList = (params) => request.get('/account/list', { params });

// 修改账号信息
export const editUser = (data) => request.post('/account/edit', data);

// 重置密码
export const resetPassword = (data) => request.post('/account/password/reset', data);

// 新增账号信息
export const addUser = (data) => request.post('/account/add', data);

// 删除账号信息
export const deleteUser = (data) => request.post('/account/delete', data);

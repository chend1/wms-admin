import request from '../request';
// 获取商品列表
export const productList = (params) => request.get('/product/list', { params });

// 修改商品信息
export const editProduct = (data) => request.post('/product/edit', data);

// 新增商品信息
export const addProduct = (data) => request.post('/product/add', data);

// 删除商品信息
export const deleteProduct = (data) => request.post('/product/delete', data);

// 获取随机数
export const getProductCode = () => request.get('/product/code');

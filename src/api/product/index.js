import request from '../request';
// 获取产品列表
export const productList = params => request.get('/product/list', { params });

// 修改产品信息
export const editProduct = data => request.post('/product/edit', data);

// 新增产品信息
export const addProduct = data => request.post('/product/add', data);

// 删除产品信息
export const deleteProduct = data => request.post('/product/delete', data);

// 获取随机数
export const getProductCode = () => request.get('/product/code');

// 修改产品规格信息
export const editProductSpec = data => request.post('/product/spec/edit', data);

// 新增产品规格信息
export const addProductSpec = data => request.post('/product/spec/add', data);

// 删除产品规格信息
export const deleteProductSpec = data =>
  request.post('/product/spec/delete', data);


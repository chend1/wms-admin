import request from '../request';
// 获取入库单列表
export const removeStorageList = params =>
  request.get('/remove/storage/list', { params });

// 获取入库单单号
export const getRemoveStorageCode = () => request.get('/remove/storage/code');

// 新增入库单
export const addRemoveStorage = data => request.post('/remove/storage/add', data);

// 修改入库单
export const editRemoveStorage = data => request.post('/remove/storage/edit', data);

// 删除入库单
export const deleteRemoveStorage = data => request.post('/remove/storage/delete', data);

// 获取入库单详情
export const getRemoveStorageDetail = params =>
  request.get('/remove/storage/details', { params });

// 修改入库单状态
export const editRemoveStorageStatus = data =>
  request.post('/remove/storage/audit', data);

// 新增入库单详情产品
export const addRemoveStorageDetail = data =>
  request.post('/remove/storage/details/add', data);

// 修改入库单详情产品
export const editRemoveStorageDetail = data =>
  request.post('/remove/storage/details/edit', data);

// 删除入库单详情产品
export const deleteRemoveStorageDetail = data =>
  request.post('/remove/storage/details/delete', data);

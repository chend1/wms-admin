import request from '../request';
// 获取入库单列表
export const addStorageList = params =>
  request.get('/add/storage/list', { params });

// 获取入库单单号
export const getAddStorageCode = () => request.get('/add/storage/code');

// 新增入库单
export const addAddStorage = data => request.post('/add/storage/add', data);

// 修改入库单
export const editAddStorage = data => request.post('/add/storage/edit', data);

// 删除入库单
export const deleteAddStorage = data => request.post('/add/storage/delete', data);

// 获取入库单详情
export const getAddStorageDetail = params =>
  request.get('/add/storage/details', { params });

// 修改入库单状态
export const editAddStorageStatus = data =>
  request.post('/add/storage/audit', data);

// 新增入库单详情产品
export const addAddStorageDetail = data =>
  request.post('/add/storage/details/add', data);

// 修改入库单详情产品
export const editAddStorageDetail = data =>
  request.post('/add/storage/details/edit', data);

// 删除入库单详情产品
export const deleteAddStorageDetail = data =>
  request.post('/add/storage/details/delete', data);

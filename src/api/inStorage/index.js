import request from '../request';
// 获取入库单列表
export const inStorageList = params =>
  request.get('/instorage/list', { params });

// 获取入库单单号
export const getInstorageCode = () => request.get('/instorage/code');

// 新增入库单
export const addInstorage = data => request.post('/instorage/add', data);

// 修改入库单
export const editInstorage = data => request.post('/instorage/edit', data);

// 删除入库单
export const deleteInstorage = data => request.post('/instorage/delete', data);

// 获取入库单详情
export const getInstorageDetail = params =>
  request.get('/instorage/details', { params });

// 修改入库单状态
export const editInstorageStatus = data =>
  request.post('/instorage/audit', data);

// 新增入库单详情产品
export const addInstorageDetail = data =>
  request.post('/instorage/details/add', data);

// 修改入库单详情产品
export const editInstorageDetail = data =>
  request.post('/instorage/details/edit', data);

// 删除入库单详情产品
export const deleteInstorageDetail = data =>
  request.post('/instorage/details/delete', data);

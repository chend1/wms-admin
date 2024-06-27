import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  removeStorageList,
  addRemoveStorage,
  editRemoveStorage,
  deleteRemoveStorage,
  getRemoveStorageDetail,
  addRemoveStorageDetail,
  editRemoveStorageDetail,
  deleteRemoveStorageDetail,
  getRemoveStorageCode,
  editRemoveStorageStatus
} from '@/api';

export default function useRemoveStorageData() {
  const removeStorageData = ref([]);
  const total = ref(0);
  let searchInfo = {};
  // 获取出库单列表
  const getRemoveStorageList = async (params, callback) => {
    searchInfo = params;
    const res = await removeStorageList(params);
    removeStorageData.value = res.list;
    total.value = res.total;
    callback && callback();
  };
  // 获取出库单单号
  const getRemoveStorageCodeClick = async (params) => {
    const res = await getRemoveStorageCode(params);
    return res;
  }
  // 新增出库单
  const addRemoveStorageClick = async (params, callback) => {
    try {
      await addRemoveStorage(params);
      getRemoveStorageList(searchInfo);
      callback && callback();
      ElMessage({
        type: 'success',
        message: '新增成功',
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 修改出库单
  const editRemoveStorageClick = async (params, callback) => {
    try {
      await editRemoveStorage(params);
      callback && callback();
      getRemoveStorageList(searchInfo);
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 删除出库单
  const deleteRemoveStorageClick = (params) => {
    ElMessageBox.confirm('确认删除该出库单吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          await deleteRemoveStorage(params);
          getRemoveStorageList(searchInfo);
          ElMessage({
            type: 'success',
            message: '删除成功',
          });
        } catch (err) {
          console.error(err);
        }
      })
      .catch(() => {});
  };
  // 审核出库单
  const editRemoveStorageStatusClick = async (params, callback) => {
    try {
      await editRemoveStorageStatus(params);
      callback && callback();
      getRemoveStorageList(searchInfo);
      ElMessage({
        type: 'success',
        message: '审核成功',
      });
    } catch (err) {
      console.error(err);
    }
  }
  // 获取出库单详情
  const getRemoveStorageDetailClick = async(params) => {
    const res = await getRemoveStorageDetail(params);
    return res;
  }

  // 新增出库单详情
  const addRemoveStorageDetailClick = async (params, callback) => {
    try {
      await addRemoveStorageDetail(params);
      callback && callback();
      ElMessage({
        type: 'success',
        message: '新增成功',
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 修改出库单详情
  const editRemoveStorageDetailClick = async (params, callback) => {
    try {
      await editRemoveStorageDetail(params);
      callback && callback();
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 删除出库单详情
  const deleteRemoveStorageDetailClick = (params) => {
    ElMessageBox.confirm('确认删除该出库单详情吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          await deleteRemoveStorageDetail(params);
          ElMessage({
            type: 'success',
            message: '删除成功',
          });
        } catch (err) {
          console.error(err);
        }
      })
      .catch(() => {});
  };
  return {
    removeStorageData,
    total,
    getRemoveStorageList,
    getRemoveStorageCodeClick,
    addRemoveStorageClick,
    editRemoveStorageClick,
    deleteRemoveStorageClick,
    getRemoveStorageDetailClick,
    addRemoveStorageDetailClick,
    editRemoveStorageDetailClick,
    deleteRemoveStorageDetailClick,
    editRemoveStorageStatusClick
  };
}

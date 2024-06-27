import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  addStorageList,
  addAddStorage,
  editAddStorage,
  deleteAddStorage,
  getAddStorageDetail,
  addAddStorageDetail,
  editAddStorageDetail,
  deleteAddStorageDetail,
  getAddStorageCode,
  editAddStorageStatus
} from '@/api';

export default function useAddStorageData() {
  const addStorageData = ref([]);
  const total = ref(0);
  let searchInfo = {};
  // 获取入库单列表
  const getAddStorageList = async (params, callback) => {
    searchInfo = params;
    const res = await addStorageList(params);
    addStorageData.value = res.list;
    total.value = res.total;
    callback && callback();
  };
  // 获取入库单单号
  const getAddStorageCodeClick = async (params) => {
    const res = await getAddStorageCode(params);
    return res;
  }
  // 新增入库单
  const addAddStorageClick = async (params, callback) => {
    try {
      await addAddStorage(params);
      getAddStorageList(searchInfo);
      callback && callback();
      ElMessage({
        type: 'success',
        message: '新增成功',
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 修改入库单
  const editAddStorageClick = async (params, callback) => {
    try {
      await editAddStorage(params);
      callback && callback();
      getAddStorageList(searchInfo);
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 删除入库单
  const deleteAddStorageClick = (params) => {
    ElMessageBox.confirm('确认删除该入库单吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          await deleteAddStorage(params);
          getAddStorageList(searchInfo);
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
  // 审核入库单
  const editAddStorageStatusClick = async (params, callback) => {
    try {
      await editAddStorageStatus(params);
      callback && callback();
      getAddStorageList(searchInfo);
      ElMessage({
        type: 'success',
        message: '审核成功',
      });
    } catch (err) {
      console.error(err);
    }
  }
  // 获取入库单详情
  const getAddStorageDetailClick = async(params) => {
    const res = await getAddStorageDetail(params);
    return res;
  }

  // 新增入库单详情
  const addAddStorageDetailClick = async (params, callback) => {
    try {
      await addAddStorageDetail(params);
      callback && callback();
      ElMessage({
        type: 'success',
        message: '新增成功',
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 修改入库单详情
  const editAddStorageDetailClick = async (params, callback) => {
    try {
      await editAddStorageDetail(params);
      callback && callback();
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 删除入库单详情
  const deleteAddStorageDetailClick = (params) => {
    ElMessageBox.confirm('确认删除该入库单详情吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          await deleteAddStorageDetail(params);
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
    addStorageData,
    total,
    getAddStorageList,
    getAddStorageCodeClick,
    addAddStorageClick,
    editAddStorageClick,
    deleteAddStorageClick,
    getAddStorageDetailClick,
    addAddStorageDetailClick,
    editAddStorageDetailClick,
    deleteAddStorageDetailClick,
    editAddStorageStatusClick
  };
}

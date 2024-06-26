import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  inStorageList,
  addInstorage,
  editInstorage,
  deleteInstorage,
  getInstorageDetail,
  addInstorageDetail,
  editInstorageDetail,
  deleteInstorageDetail,
  getInstorageCode
} from '@/api';

export default function useInStorageData() {
  const inStorageData = ref([]);
  const total = ref(0);
  let searchInfo = {};
  // 获取入库单列表
  const getInStorageList = async (params, callback) => {
    searchInfo = params;
    const res = await inStorageList(params);
    inStorageData.value = res.list;
    total.value = res.total;
    callback && callback();
  };
  // 获取入库单单号
  const getInStorageCodeClick = async (params) => {
    const res = await getInstorageCode(params);
    return res;
  }
  // 新增入库单
  const addInstorageClick = async (params, callback) => {
    try {
      await addInstorage(params);
      getInStorageList(searchInfo);
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
  const editInstorageClick = async (params, callback) => {
    try {
      await editInstorage(params);
      callback && callback();
      getInStorageList(searchInfo);
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 删除入库单
  const deleteInstorageClick = (params) => {
    ElMessageBox.confirm('确认删除该入库单吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          await deleteInstorage(params);
          getInStorageList(searchInfo);
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

  // 获取入库单详情
  const getInstorageDetailClick = async(params) => {
    const res = await getInstorageDetail(params);
    return res;
  }

  // 新增入库单详情
  const addInstorageDetailClick = async (params, callback) => {
    try {
      await addInstorageDetail(params);
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
  const editInstorageDetailClick = async (params, callback) => {
    try {
      await editInstorageDetail(params);
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
  const deleteInstorageDetailClick = (params) => {
    ElMessageBox.confirm('确认删除该入库单详情吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          await deleteInstorageDetail(params);
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
    inStorageData,
    total,
    getInStorageList,
    getInStorageCodeClick,
    addInstorageClick,
    editInstorageClick,
    deleteInstorageClick,
    getInstorageDetailClick,
    addInstorageDetailClick,
    editInstorageDetailClick,
    deleteInstorageDetailClick,
  };
}

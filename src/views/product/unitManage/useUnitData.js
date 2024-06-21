import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  unitList, editUnit, addUnit, deleteUnit,
} from '@/api';

export default function useUnitData() {
  const unitData = ref([]);
  let searchInfo = {};
  // 获取产品单位列表
  const getUnitList = async (params, callback) => {
    searchInfo = params;
    const res = await unitList(params);
    unitData.value = res.list;
    callback && callback();
  };

  // 新增产品单位
  const addUnitClick = async (params, callback) => {
    try {
      await addUnit(params);
      getUnitList(searchInfo);
      callback && callback();
      ElMessage({
        type: 'success',
        message: '新增成功',
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 修改产品单位
  const editUnitClick = async (params, callback) => {
    try {
      await editUnit(params);
      callback && callback();
      getUnitList(searchInfo);
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 删除产品单位
  const deleteUnitClick = (params) => {
    ElMessageBox.confirm('确认删除该产品单位吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          await deleteUnit(params);
          getUnitList(searchInfo);
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

  // 获取单位名称
  const getUnitName = (id) => {
    const unit = unitData.value.find((item) => item.id === id);
    return unit && (unit.name || unit.unit);
  }
  return {
    unitData,
    getUnitList,
    addUnitClick,
    editUnitClick,
    deleteUnitClick,
    getUnitName,
  };
}

import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  groupList, editGroup, addGroup, deleteGroup,
} from '@/api';
import { flatArray } from '@/utils';

export default function useGroupData() {
  const groupData = ref([]);
  const groupOptions = ref([]);
  let searchInfo = {};
  // 获取产品分类列表
  const getGroupList = async (params, callback) => {
    searchInfo = params;
    const res = await groupList(params);
    // 一维菜单列表
    groupOptions.value = flatArray(res.list);
    console.log(groupOptions.value);
    groupData.value = res.list;
    callback && callback();
  };

  // 新增产品分类
  const addGroupClick = async (params, callback) => {
    try {
      await addGroup(params);
      getGroupList(searchInfo);
      callback && callback();
      ElMessage({
        type: 'success',
        message: '新增成功',
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 修改产品分类
  const editGroupClick = async (params, callback) => {
    try {
      await editGroup(params);
      callback && callback();
      getGroupList(searchInfo);
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 删除产品分类
  const deleteGroupClick = (params) => {
    ElMessageBox.confirm('确认删除该产品分类吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          await deleteGroup(params);
          getGroupList(searchInfo);
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
    groupData,
    groupOptions,
    getGroupList,
    addGroupClick,
    editGroupClick,
    deleteGroupClick,
  };
}

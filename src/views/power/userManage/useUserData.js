import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  userList, editUser, addUser, deleteUser, resetPassword,
} from '@/api';

export default function useUserData() {
  const userData = ref([]);
  const total = ref(0);
  let searchInfo = {};
  // 获取账号列表
  const getUserList = async (params, callback) => {
    searchInfo = params;
    const res = await userList(params);
    userData.value = res.list;
    total.value = res.total;
    callback && callback();
  };
  // 新增账号
  const addUserClick = async (params, callback) => {
    try {
      await addUser(params);
      getUserList(searchInfo);
      callback && callback();
      ElMessage({
        type: 'success',
        message: '新增成功',
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 修改账号
  const editUserClick = async (params, callback) => {
    try {
      await editUser(params);
      callback && callback();
      getUserList(searchInfo);
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 重置密码
  const resetPasswordClick = (params) => {
    ElMessageBox.confirm('确认重置该账号密码吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          await resetPassword(params);
          getUserList(searchInfo);
          ElMessage({
            type: 'success',
            message: '重置成功',
          });
        } catch (err) {
          console.error(err);
        }
      })
      .catch(() => {});
  };
  // 删除账号
  const deleteUserClick = (params) => {
    ElMessageBox.confirm('确认删除该账号吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          await deleteUser(params);
          getUserList(searchInfo);
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
    userData,
    total,
    getUserList,
    addUserClick,
    editUserClick,
    deleteUserClick,
    resetPasswordClick,
  };
}

import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  companyList, addCompany, editCompany, signCompany, deleteCompany,
} from '@/api';

export default function useCompanyData() {
  const companyData = ref([]);
  const total = ref(0);
  let searchInfo = {};
  // 获取公司列表
  const getCompanyList = async (params, callback) => {
    searchInfo = params;
    const res = await companyList(params);
    companyData.value = res.list;
    total.value = res.total;
    callback && callback();
  };
  // 新增公司
  const addCompanyClick = async (params, callback) => {
    try {
      await addCompany(params);
      getCompanyList(searchInfo);
      callback && callback();
      ElMessage({
        type: 'success',
        message: '新增成功',
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 修改公司
  const editCompanyClick = async (params, callback) => {
    try {
      await editCompany(params);
      getCompanyList(searchInfo);
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
      callback && callback();
    } catch (err) {
      console.error(err);
    }
  };
  // 签约公司
  const signCompanyClick = async (params, callback) => {
    try {
      await signCompany(params);
      getCompanyList(searchInfo);
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
      callback && callback();
    } catch (err) {
      console.error(err);
    }
  };
  // 删除公司
  const deleteCompanyClick = (params) => {
    ElMessageBox.confirm('确认删除该公司吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          await deleteCompany(params);
          getCompanyList(searchInfo);
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
  // 获取公司名称
  const getCompanyName = (id) => {
    const list = companyData.value.filter((item) => item.id === id);
    return list[0] && (list[0].name || list[0].company_name);
  };
  return {
    companyData,
    total,
    getCompanyList,
    addCompanyClick,
    editCompanyClick,
    deleteCompanyClick,
    getCompanyName,
    signCompanyClick,
  };
}

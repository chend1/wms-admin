import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  dealCompanyList,
  addDealCompany,
  editDealCompany,
  deleteDealCompany
} from '@/api';

export default function useDealCompanyData() {
  const dealCompanyData = ref([]);
  const total = ref(0);
  let searchInfo = {};
  // 获取往来单位列表
  const getDealCompanyList = async (params, callback) => {
    searchInfo = params;
    const res = await dealCompanyList(params);
    dealCompanyData.value = res.list;
    total.value = res.total;
    callback && callback();
  };
  // 新增往来单位
  const addDealCompanyClick = async (params, callback) => {
    try {
      await addDealCompany(params);
      getDealCompanyList(searchInfo);
      callback && callback();
      ElMessage({
        type: 'success',
        message: '新增成功',
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 修改往来单位
  const editDealCompanyClick = async (params, callback) => {
    try {
      await editDealCompany(params);
      getDealCompanyList(searchInfo);
      ElMessage({
        type: 'success',
        message: '修改成功',
      });
      callback && callback();
    } catch (err) {
      console.error(err);
    }
  };
  // 删除往来单位
  const deleteDealCompanyClick = (params) => {
    ElMessageBox.confirm('确认删除该往来单位吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
      .then(async () => {
        try {
          await deleteDealCompany(params);
          getDealCompanyList(searchInfo);
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
  // 获取往来单位名称
  const getDealCompanyName = (id) => {
    const list = dealCompanyData.value.filter((item) => item.id === id);
    return list[0] && (list[0].name || list[0].company_name);
  };
  return {
    dealCompanyData,
    total,
    getDealCompanyList,
    addDealCompanyClick,
    editDealCompanyClick,
    deleteDealCompanyClick,
    getDealCompanyName,
  };
}

import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  productList,
  editProduct,
  addProduct,
  deleteProduct,
  getProductCode,
  editProductSpec,
  addProductSpec,
  deleteProductSpec
} from '@/api';

export default function useProductData() {
  const productData = ref([]);
  let searchInfo = {};
  // 获取产品列表
  const getProductList = async (params, callback) => {
    searchInfo = params;
    const res = await productList(params);
    productData.value = res.list;
    // console.log('productData.value', productData.value);
    callback && callback();
  };

  // 新增产品
  const addProductClick = async (params, callback) => {
    try {
      await addProduct(params);
      getProductList(searchInfo);
      callback && callback();
      ElMessage({
        type: 'success',
        message: '新增成功'
      });
    } catch (err) {
      console.error(err);
    }
  };
  // 修改产品
  const editProductClick = async (params, callback) => {
    try {
      await editProduct(params);
      callback && callback();
      getProductList(searchInfo);
      ElMessage({
        type: 'success',
        message: '修改成功'
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 删除产品
  const deleteProductClick = params => {
    ElMessageBox.confirm('确认删除该产品吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        try {
          await deleteProduct(params);
          getProductList(searchInfo);
          ElMessage({
            type: 'success',
            message: '删除成功'
          });
        } catch (err) {
          console.error(err);
        }
      })
      .catch(() => {});
  };

  // 获取产品编码
  const getProductCodeClick = async () => {
    const res = await getProductCode();
    return res;
  };
  // 新增产品规格
  const addProductSpecClick = async (params, callback) => {
    try {
      await addProductSpec(params);
      callback && callback();
      getProductList(searchInfo);
      ElMessage({
        type: 'success',
        message: '新增成功'
      });
    } catch (err) {
      console.error(err);
    }
  }
  // 修改产品规格
  const editProductSpecClick = async (params, callback) => {
    try {
      await editProductSpec(params);
      callback && callback();
      getProductList(searchInfo);
      ElMessage({
        type: 'success',
        message: '修改成功'
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 删除产品规格
  const deleteProductSpecClick = params => {
    ElMessageBox.confirm('确认删除该产品规格吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        try {
          await deleteProductSpec(params);
          getProductList(searchInfo);
          ElMessage({
            type: 'success',
            message: '删除成功'
          });
        } catch (err) {
          console.error(err);
        }
      })
      .catch(() => {});
  };
  return {
    productData,
    getProductList,
    addProductClick,
    editProductClick,
    deleteProductClick,
    getProductCodeClick,
    addProductSpecClick,
    editProductSpecClick,
    deleteProductSpecClick
  };
}

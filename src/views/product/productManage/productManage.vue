<script setup>
import { reactive, ref } from 'vue';
import useProductData from './useProductData';

const {
  productData,
  getProductList,
  addProductClick,
  editProductClick,
  deleteProductClick,
} = useProductData();
// 搜索信息
const searchInfo = reactive({
  keyword: '',
});
getProductList(searchInfo);
// 用户信息
const productInfo = ref({
  spec_list: [
    {
      code: '',
      spec: '',
      pay_price: '',
      sell_price: '',
      min__num: '',
      init__num: '',
    }
  ]
});
// 弹窗信息
const dialogVisible = ref(false);
const isAdd = ref(false);
// 新增用户
const handleAddProduct = () => {
  isAdd.value = true;
  dialogVisible.value = true;
};

// 修改用户
const handleEditProduct = (row) => {
  isAdd.value = false;
  dialogVisible.value = true;
  productInfo.value = { ...row };
};

// 删除用户
const handleDeleteProduct = (row) => {
  deleteProductClick({ id: row.id });
};
// 弹窗确认事件
const formRef = ref();
const confirmClick = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (isAdd.value) {
        addProductClick(productInfo.value, () => {
          dialogVisible.value = false;
        });
      } else {
        editProductClick(productInfo.value, () => {
          dialogVisible.value = false;
        });
      }
    }
  });
};
// 弹窗关闭事件
const handleClose = () => {
  productInfo.value = { status: 1 };
  formRef.value && formRef.value.resetFields();
};

const rules = {
  name: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
  ],
  unit: [
    {
      required: true,
      message: '请选择单位',
      trigger: 'blur',
    },
  ],
  group_id: [
    {
      required: true,
      message: '请选择分类',
      trigger: 'change',
    },
  ],
};
</script>

<template>
  <div class="product-manage">
    <div class="add-product">
      <el-button type="primary" @click="handleAddProduct">
        添加产品
      </el-button>
    </div>
    <div class="table">
      <el-table
        :data="productData"
        border
        :header-cell-style="{ 'background-color': '#DDE2EE' }"
        align="center"
        height="100%"
      >
        <el-table-column
          prop="name"
          label="产品名称"
          min-width="80"
          align="center"
        />
        <el-table-column prop="name" label="产品名称" align="center" />
        <el-table-column prop="spec" label="产品规格" align="center" />
        <el-table-column prop="group_id" label="产品分类" align="center" />
        <el-table-column prop="unit" label="单位" align="center" />
        <el-table-column prop="description" label="产品描述" align="center" />
        <el-table-column
          prop="create_time"
          width="180"
          label="创建时间"
          align="center"
        />
        <el-table-column prop="" label="操作" min-width="140" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEditProduct(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDeleteProduct(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="isAdd ? '添加产品' : '修改产品'"
    width="650px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="form">
      <el-form
        ref="formRef"
        :model="productInfo"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="productInfo.name" />
        </el-form-item>
        <el-form-item label="产品分类" prop="group_id">
          <el-input v-model="productInfo.group_id" />
        </el-form-item>
        <el-form-item label="产品单位" prop="unit">
          <el-input v-model="productInfo.unit" />
        </el-form-item>
        <el-form-item label="产品描述" prop="description">
          <el-input v-model="productInfo.description" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmClick"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.product-manage {
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .add-product {
    margin: 10px 0;
    box-sizing: border-box;
    padding: 0 10px;
    width: 100%;
  }
  .table {
    width: 100%;
    flex: 1;
    box-sizing: border-box;
    padding: 0 10px;
  }
  .paging {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
}
</style>

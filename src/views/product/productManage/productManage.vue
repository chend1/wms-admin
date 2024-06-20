<script setup>
import { reactive, ref } from 'vue';
import { Delete } from '@element-plus/icons-vue';
import useProductData from './useProductData';
import useGroupData from '../groupManage/useGroupData';
import useUnitData from '../unitManage/useUnitData';

const { groupOptions, getGroupList } = useGroupData();
getGroupList({ status: 1 });

const { unitData, getUnitList } = useUnitData();
getUnitList();

const {
  productData,
  getProductList,
  addProductClick,
  editProductClick,
  deleteProductClick,
  getProductCodeClick
} = useProductData();
// 搜索信息
const searchInfo = reactive({
  keyword: ''
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
      min_num: '',
      init_num: ''
    }
  ]
});
// 弹窗信息
const dialogVisible = ref(false);
const isAdd = ref(false);
// 新增用户
const handleAddProduct = async () => {
  const res = await getProductCodeClick();
  productInfo.value.spec_list[0].code = res.code;
  isAdd.value = true;
  dialogVisible.value = true;
};

// 修改用户
const handleEditProduct = row => {
  isAdd.value = false;
  dialogVisible.value = true;
  productInfo.value = { ...row };
};

// 删除用户
const handleDeleteProduct = row => {
  deleteProductClick({ id: row.id });
};
// 弹窗确认事件
const formRef = ref();
const confirmClick = () => {
  formRef.value.validate(valid => {
    if (valid) {
      if (isAdd.value) {
        const params = {
          ...productInfo.value,
          spec_list: JSON.stringify(productInfo.value.spec_list)
        };
        addProductClick(params, () => {
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
  productInfo.value = {
    spec_list: [
      {
        code: '',
        spec: '',
        pay_price: '',
        sell_price: '',
        min_num: '',
        init_num: ''
      }
    ]
  };
  formRef.value && formRef.value.resetFields();
};

// 添加规格
const handleAddSpec = () => {
  const len = productInfo.value.spec_list.length;
  productInfo.value.spec_list.push({
    code: productInfo.value.spec_list[0].code + `-${len}`,
    spec: '',
    pay_price: '',
    sell_price: '',
    min_num: '',
    init_num: ''
  });
};

// 删除规格
const handleDeleteSpec = index => {
  productInfo.value.spec_list.splice(index, 1);
};

const rules = {
  name: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  unit: [
    {
      required: true,
      message: '请选择单位',
      trigger: 'blur'
    }
  ],
  group_id: [
    {
      required: true,
      message: '请选择分类',
      trigger: 'change'
    }
  ],
  code: [
    {
      required: true,
      validator: (rule, value, callback) => {
        let flag = false
        productInfo.value.spec_list.forEach(item => {
          if(!item.code) {
            flag = true
          }
        })
        if(flag) {
          callback(new Error('请输入产品编码'));
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  spec: [
    {
      required: true,
      validator: (rule, value, callback) => {
        let flag = false
        productInfo.value.spec_list.forEach(item => {
          if(!item.spec) {
            flag = true
          }
        })
        if(flag) {
          callback(new Error('请输入产品规格'));
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
};
</script>

<template>
  <div class="product-manage">
    <div class="add-product">
      <el-button type="primary" @click="handleAddProduct"> 添加产品 </el-button>
    </div>
    <div class="table">
      <el-table
        :data="productData"
        border
        :header-cell-style="{ 'background-color': '#DDE2EE' }"
        align="center"
        height="100%"
      >
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
    <el-dialog
      v-model="dialogVisible"
      :title="isAdd ? '添加产品' : '修改产品'"
      width="750px"
      top="80px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <div class="form">
        <el-form
          ref="formRef"
          :model="productInfo"
          label-width="90px"
          :rules="rules"
        >
          <el-form-item label="产品名称" prop="name">
            <el-input v-model="productInfo.name" />
          </el-form-item>
          <el-form-item label="产品分类" prop="group_id">
            <el-select v-model="productInfo.group_id">
              <el-option
                v-for="item in groupOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品单位" prop="unit">
            <el-select v-model="productInfo.unit">
              <el-option
                v-for="item in unitData"
                :key="item.id"
                :label="item.unit"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品描述" prop="description">
            <el-input v-model="productInfo.description" />
          </el-form-item>
          <div class="box-wrap">
            <div
              class="box"
              v-for="(item, index) in productInfo.spec_list"
              :key="index"
            >
              <div
                class="del"
                v-if="index !== 0"
                @click="handleDeleteSpec(index)"
              >
                <el-icon><Delete /></el-icon>
              </div>
              <el-form-item label="产品编码" prop="code">
                <el-input v-model="item.code" />
              </el-form-item>
              <el-form-item label="产品规格" prop="spec">
                <el-input v-model="item.spec" />
              </el-form-item>
              <el-form-item label="入库价格" prop="pay_price">
                <el-input v-model="item.pay_price" />
              </el-form-item>
              <el-form-item label="出库价格" prop="sell_price">
                <el-input v-model="item.sell_price" />
              </el-form-item>
              <el-form-item label="最低库存" prop="min_num">
                <el-input v-model="item.min_num" />
              </el-form-item>
              <el-form-item label="初始库存" prop="init_num">
                <el-input v-model="item.init_num" />
              </el-form-item>
            </div>
            <div class="btn">
              <el-button type="primary" @click="handleAddSpec">
                添加规格
              </el-button>
            </div>
          </div>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmClick"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
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
.box-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 340px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  .box {
    min-width: calc(33.33% - 10px);
    flex: 1;
    box-sizing: border-box;
    padding: 20px 10px 0;
    margin: 0 4px 8px 4px;
    border: 1px solid #ccc;
    position: relative;
    &:nth-child(3n + 1) {
      margin-left: 0;
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
    .del {
      position: absolute;
      top: 0;
      left: 0;
      width: 25px;
      height: 25px;
      background-color: #e6a23c;
      cursor: pointer;
      font-size: 18px;
      color: #fff;
      border-radius: 0 0 5px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover {
        background-color: #f56c6c;
      }
    }
  }
}
</style>

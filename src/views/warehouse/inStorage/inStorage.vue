<script setup>
import { reactive, ref, computed } from 'vue';
import useDealCompanyData from '@/views/product/dealCompanyManage/useDealCompanyData';
import useProductData from '@/views/product/productManage/useProductData';
import useInStorageData from './useInStorageData';
import useUserData from '@/views/power/userManage/useUserData';
import { useMainStore } from '@/store';

const { dealCompanyData, getDealCompanyList, getDealCompanyName } =
  useDealCompanyData();
getDealCompanyList({ page: 1, size: 100, type: 1 });

const { productSelectData, getProductList } = useProductData();
getProductList();

const { getUserName, getUserList } = useUserData();
getUserList({ page: 1, size: 100 });

const {
  inStorageData,
  total,
  getInStorageList,
  addInstorageClick,
  editInstorageClick,
  deleteInstorageClick,
  getInstorageDetailClick,
  getInStorageCodeClick
} = useInStorageData();

const mainStore = useMainStore();
const userInfo = computed(() => mainStore.userInfo);
// 搜索信息
const searchInfo = reactive({
  keyword: '',
  page: 1,
  size: 10
});
getInStorageList(searchInfo);
// 入库单信息
const inStorageInfo = ref({});

// 弹窗信息
const dialogVisible = ref(false);
const isAdd = ref(false);

// 新增入库单
const handleAddInStorage = async () => {
  const res = await getInStorageCodeClick();
  inStorageInfo.value.add_code = res.code;
  isAdd.value = true;
  dialogVisible.value = true;
};

// 修改入库单
const oldProductList = ref([]);
const handleEditInStorage = async row => {
  const ids = new Set();
  const res = await getInstorageDetailClick({ id: row.id });
  res.list.forEach(item => {
    ids.add(item.product_spec_id);
  });
  isAdd.value = false;
  inStorageInfo.value = { ...row };
  inStorageInfo.value.selectId = [...ids];
  oldProductList.value = res.list;
  handleProductSelect();
  dialogVisible.value = true;
};

// 删除入库单
const handleDeleteInStorage = row => {
  deleteInstorageClick({ id: row.id });
};
// 弹窗确认事件
const formRef = ref();
const confirmClick = () => {
  const list = inStorageInfo.value.productList.map(item => {
    const product = {
      product_id: item.product_id || item.id,
      product_spec_id: item.product_spec_id || item.spec_id,
      product_price: parseFloat(item.product_price),
      product_num: parseInt(item.product_num),
      desc: item.desc,
      id: item.id || null
    };
    return product;
  });
  const params = {
    add_code: inStorageInfo.value.add_code,
    add_time: inStorageInfo.value.add_time,
    deal_company_id: inStorageInfo.value.deal_company_id,
    description: inStorageInfo.value.description,
    productList: JSON.stringify(list)
  };
  // console.log(params, inStorageInfo.value);
  formRef.value.validate(valid => {
    if (valid) {
      if (isAdd.value) {
        params.register_id = userInfo.value.id;
        addInstorageClick(params, () => {
          dialogVisible.value = false;
        });
      } else {
        params.id = inStorageInfo.value.id;
        params.update_id = userInfo.value.id;
        const deleteIds = oldProductList.value
          .filter(item => {
            const idx = list.findIndex(product => product.id === item.id);
            return idx === -1;
          })
          .map(item => item.id);
        params.deleteIds = JSON.stringify(deleteIds);
        // console.log('params', params);
        editInstorageClick(params, () => {
          dialogVisible.value = false;
        });
      }
    }
  });
};
// 弹窗关闭事件
const handleClose = () => {
  inStorageInfo.value = {};
  formRef.value && formRef.value.resetFields();
};

// 产品选择
const handleProductSelect = () => {
  inStorageInfo.value.productList = inStorageInfo.value.selectId.map(item => {
    const product = productSelectData.value.find(
      product => product.spec_id === item
    );
    const newProduct = oldProductList.value.find(
      product => product.product_spec_id === item
    );
    const myProduct = isAdd.value
      ? { ...product, product_price: product.pay_price }
      : {
          ...product,
          ...newProduct
        };
    return { ...myProduct };
  });
  console.log(inStorageInfo.value.productList);
};

const rules = {
  add_time: [
    {
      required: true,
      message: '请选择入库时间',
      trigger: 'blur'
    }
  ],
  deal_company_id: [
    {
      required: true,
      message: '请选择往来公司',
      trigger: 'blur'
    }
  ]
};
</script>

<template>
  <div class="in-storage-manage">
    <div class="add-in-storage">
      <el-button type="primary" @click="handleAddInStorage">
        添加入库单
      </el-button>
    </div>
    <div class="table">
      <el-table
        :data="inStorageData"
        border
        :header-cell-style="{ 'background-color': '#DDE2EE' }"
        align="center"
        height="100%"
      >
        <el-table-column
          prop="add_code"
          label="入库单号"
          min-width="80"
          align="center"
        />
        <el-table-column
          prop="add_time"
          label="入库时间"
          width="120"
          align="center"
        />
        <el-table-column
          prop="deal_company_id"
          label="往来公司"
          min-width="80"
          align="center"
        >
          <template #default="scope">
            {{ getDealCompanyName(scope.row.deal_company_id) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          min-width="80"
          align="center"
        />

        <el-table-column
          prop="register_id"
          label="创建人"
          min-width="80"
          align="center"
        >
          <template #default="scope">
            {{ getUserName(scope.row.register_id) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="audit_id"
          label="审核人"
          min-width="80"
          align="center"
        />
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            {{ ['待审批', '入库完成', '已驳回'][scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          width="170"
          label="创建时间"
          align="center"
        />
        <el-table-column prop="" label="操作" width="220" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              v-if="scope.row.status === 0"
              @click="handleEditInStorage(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              v-if="scope.row.status === 0"
              @click="handleDeleteInStorage(scope.row)"
            >
              删除
            </el-button>
            <el-button
              type="success"
              size="small"
              v-if="scope.row.status === 0"
              @click="handleDeleteInStorage(scope.row)"
            >
              审批
            </el-button>
            <!-- <el-button
              type="primary"
              size="small"
              @click="handleEditInStorage(scope.row)"
            >
              查看
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="total > 0" class="paging">
      <el-pagination
        v-model:current-page="searchInfo.page"
        v-model:page-size="searchInfo.length"
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[5, 10, 15, 20]"
        :total="total"
        @size-change="getInStorageList(searchInfo)"
        @current-change="getInStorageList(searchInfo)"
      />
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="isAdd ? '添加入库单' : '修改入库单'"
    width="650px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="form">
      <el-form
        ref="formRef"
        :model="inStorageInfo"
        label-width="90px"
        :rules="rules"
      >
        <el-form-item label="入库单号" prop="add_code">
          <el-input v-model="inStorageInfo.add_code" disabled />
        </el-form-item>
        <el-form-item label="入库时间" prop="add_time">
          <el-date-picker
            v-model="inStorageInfo.add_time"
            type="date"
            placeholder="请选择入库时间"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="往来公司" prop="deal_company_id">
          <el-select v-model="inStorageInfo.deal_company_id">
            <el-option
              v-for="item in dealCompanyData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="inStorageInfo.description" />
        </el-form-item>
        <el-form-item label="产品选择" prop="deal_company_id">
          <el-select
            v-model="inStorageInfo.selectId"
            multiple
            collapse-tags
            @change="handleProductSelect"
          >
            <el-option
              v-for="item in productSelectData"
              :key="item.spec_id"
              :label="item.name + '（规格：' + item.spec_id + '）'"
              :value="item.spec_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="spec-table">
          <el-table
            :data="inStorageInfo.productList"
            border
            :header-cell-style="{ 'background-color': '#DDE2EE' }"
          >
            <el-table-column
              prop="name"
              label="产品名称"
              min-width="80"
              align="center"
            />
            <el-table-column
              prop="spec"
              label="产品规格"
              min-width="80"
              align="center"
            />
            <el-table-column
              prop="product_price"
              label="入库价格"
              min-width="80"
              align="center"
            >
              <template #default="scope">
                <span>
                  <el-input
                    v-model="scope.row.product_price"
                    placeholder="请输入价格"
                  />
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="product_num"
              label="入库数量"
              min-width="80"
              align="center"
            >
              <template #default="scope">
                <span>
                  <el-input
                    v-model="scope.row.product_num"
                    placeholder="请输入数量"
                  />
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="desc"
              label="描述"
              min-width="80"
              align="center"
            >
              <template #default="scope">
                <span>
                  <el-input v-model="scope.row.desc" placeholder="请输入描述" />
                </span>
              </template>
            </el-table-column>
          </el-table>
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
</template>

<style scoped lang="less">
.in-storage-manage {
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .add-in-storage {
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


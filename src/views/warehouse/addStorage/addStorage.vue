<script setup>
import { reactive, ref, computed } from 'vue';
import useDealCompanyData from '@/views/product/dealCompanyManage/useDealCompanyData';
import useProductData from '@/views/product/productManage/useProductData';
import useAddStorageData from './useAddStorageData';
import useUnitData from '@/views/product/unitManage/useUnitData';
import useUserData from '@/views/power/userManage/useUserData';
import { useMainStore } from '@/store';
import { ElMessage } from 'element-plus';

// 往来公司
const { dealCompanyData, getDealCompanyList, getDealCompanyName } =
  useDealCompanyData();
getDealCompanyList({ page: 1, size: 100, type: 1 });

// 产品列表
const { productSelectData, getProductList } = useProductData();
getProductList();

// 用户列表
const { userData, getUserName, getUserList } = useUserData();
getUserList({ page: 1, size: 100 });

// 单位列表
const { getUnitList, getUnitName } = useUnitData();
getUnitList();

const {
  addStorageData,
  total,
  getAddStorageList,
  addAddStorageClick,
  editAddStorageClick,
  deleteAddStorageClick,
  getAddStorageDetailClick,
  getAddStorageCodeClick,
  editAddStorageStatusClick
} = useAddStorageData();

const mainStore = useMainStore();
const userInfo = computed(() => mainStore.userInfo);
// 搜索信息
const searchInfo = reactive({
  keyword: '',
  page: 1,
  size: 10
});
getAddStorageList(searchInfo);
const timeChange = () => {
  searchInfo.strat_time = searchInfo.times[0] || '';
  searchInfo.end_time = searchInfo.times[1] || '';
};
// 入库单信息
const addStorageInfo = ref({});

// 弹窗信息
const dialogVisible = ref(false);
const isAdd = ref(false);

// 新增入库单
const handleAddAddStorage = async () => {
  const res = await getAddStorageCodeClick();
  addStorageInfo.value.add_code = res.code;
  isAdd.value = true;
  dialogVisible.value = true;
};

// 修改入库单
const oldProductList = ref([]);
const handleEditAddStorage = async row => {
  const ids = new Set();
  const res = await getAddStorageDetailClick({ id: row.id });
  res.list.forEach(item => {
    ids.add(item.product_spec_id);
  });
  isAdd.value = false;
  addStorageInfo.value = { ...row };
  addStorageInfo.value.selectId = [...ids];
  oldProductList.value = res.list;
  handleProductSelect();
  dialogVisible.value = true;
};

// 删除入库单
const handleDeleteAddStorage = row => {
  deleteAddStorageClick({ id: row.id });
};
// 弹窗确认事件
const formRef = ref();
const confirmClick = () => {
  let isOver = false;
  const list = addStorageInfo.value.productList.map(item => {
    if (
      !item.product_num ||
      item.product_num === 0 ||
      !item.product_price ||
      item.product_price === 0
    ) {
      isOver = true;
      return {};
    }
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
  if (isOver) {
    return ElMessage.warning('产品价格和数量不能为零或者为空！');
  }
  const params = {
    add_code: addStorageInfo.value.add_code,
    add_time: addStorageInfo.value.add_time,
    deal_company_id: addStorageInfo.value.deal_company_id,
    description: addStorageInfo.value.description,
    productList: JSON.stringify(list)
  };
  formRef.value.validate(valid => {
    if (valid) {
      if (isAdd.value) {
        params.register_id = userInfo.value.id;
        addAddStorageClick(params, () => {
          dialogVisible.value = false;
        });
      } else {
        params.id = addStorageInfo.value.id;
        params.update_id = userInfo.value.id;
        const deleteIds = oldProductList.value
          .filter(item => {
            const idx = list.findIndex(product => product.id === item.id);
            return idx === -1;
          })
          .map(item => item.id);
        params.deleteIds = JSON.stringify(deleteIds);
        // console.log('params', params);
        editAddStorageClick(params, () => {
          dialogVisible.value = false;
        });
      }
    }
  });
};
// 审核入库单
const checkInfo = ref({});
const checkDialogVisible = ref(false);
const status = ref(1);
const isAudit = ref(false);
const handleCheckAddStorage = async (row, type) => {
  isAudit.value = type;
  const res = await getAddStorageDetailClick({ id: row.id });
  status.value = row.status;
  res.list.forEach(item => {
    const product = productSelectData.value.find(
      product => product.spec_id === item.product_spec_id
    );
    item.name = product.name;
    item.spec = product.spec;
    item.unit_id = product.unit_id;
  });
  checkInfo.value = { ...row, productList: res.list };
  checkDialogVisible.value = true;
};

// 确认审批
const confirmCheckClick = async () => {
  if(checkInfo.value.status === 2 && !checkInfo.value.refuse_reason) {
    return ElMessage.warning('请输入拒绝原因');
  }
  const params = {
    id: checkInfo.value.id,
    status: checkInfo.value.status,
    productList: JSON.stringify(checkInfo.value.productList),
    audit_id: userInfo.value.id,
    refuse_reason: checkInfo.value.refuse_reason
  };
  editAddStorageStatusClick(params, () => {
    checkDialogVisible.value = false;
  });
};

// 弹窗关闭事件
const handleClose = () => {
  addStorageInfo.value = {};
  checkInfo.value = {};
  oldProductList.value = [];
  formRef.value && formRef.value.resetFields();
};

// 产品选择
const handleProductSelect = () => {
  addStorageInfo.value.productList = addStorageInfo.value.selectId.map(item => {
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
          id: null,
          ...newProduct
        };
    return { ...myProduct };
  });
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
  <div class="add-storage-manage">
    <div class="head">
      <div class="search-wrap">
        <div class="option" style="width: 120px">
          <div class="value">
            <el-input
              v-model="searchInfo.add_code"
              placeholder="请输入入库单号"
              clearable
            />
          </div>
        </div>
        <div class="option" style="width: 130px">
          <div class="value">
            <el-select
              v-model="searchInfo.deal_company_id"
              placeholder="请选择往来公司"
              clearable
            >
              <el-option
                v-for="item in dealCompanyData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="option" style="width: 115px">
          <div class="value">
            <el-select
              v-model="searchInfo.status"
              placeholder="请选择状态"
              clearable
            >
              <el-option label="待审批" :value="0" />
              <el-option label="入库完成" :value="1" />
              <el-option label="已驳回" :value="2" />
            </el-select>
          </div>
        </div>
        <div class="option" style="width: 115px">
          <div class="value">
            <el-select
              v-model="searchInfo.user_id"
              placeholder="请选择用户名"
              clearable
            >
              <el-option
                v-for="item in userData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="option">
          <div class="value">
            <el-date-picker
              v-model="searchInfo.times"
              value-format="YYYY-MM-DD"
              @change="timeChange"
              type="daterange"
              range-separator="至"
              start-placeholder="入库开始时间"
              end-placeholder="入库结束时间"
            />
          </div>
        </div>
      </div>
      <div class="btn">
        <el-button type="primary" @click="getAddStorageList(searchInfo)" plain>
          查询
        </el-button>
      </div>
      <div class="btn">
        <el-button type="primary" @click="handleAddAddStorage">
          添加入库单
        </el-button>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="addStorageData"
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
        >
          <template #default="scope">
            {{ getUserName(scope.row.audit_id) }}
          </template>
        </el-table-column>
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
              type="success"
              size="small"
              v-if="scope.row.status === 1 || scope.row.status === 2"
              @click="handleCheckAddStorage(scope.row, false)"
            >
              查看
            </el-button>
            <el-button
              :type="scope.row.status !== 2 ? 'primary' : 'warning'"
              size="small"
              :disabled="scope.row.status === 1"
              @click="handleEditAddStorage(scope.row)"
            >
              {{ scope.row.status === 0 ? '编辑' : '重检' }}
            </el-button>
            <el-button
              type="success"
              size="small"
              v-if="scope.row.status === 0"
              @click="handleCheckAddStorage(scope.row, true)"
            >
              审批
            </el-button>
            <el-button
              type="danger"
              size="small"
              :disabled="scope.row.status === 1"
              @click="handleDeleteAddStorage(scope.row)"
            >
              删除
            </el-button>
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
        @size-change="getAddStorageList(searchInfo)"
        @current-change="getAddStorageList(searchInfo)"
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
        :model="addStorageInfo"
        label-width="90px"
        :rules="rules"
      >
        <el-form-item label="入库单号" prop="add_code">
          <el-input v-model="addStorageInfo.add_code" disabled />
        </el-form-item>
        <el-form-item label="入库时间" prop="add_time">
          <el-date-picker
            v-model="addStorageInfo.add_time"
            type="date"
            placeholder="请选择入库时间"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="往来公司" prop="deal_company_id">
          <el-select v-model="addStorageInfo.deal_company_id">
            <el-option
              v-for="item in dealCompanyData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="addStorageInfo.description" />
        </el-form-item>
        <el-form-item label="产品选择" prop="deal_company_id">
          <el-select
            v-model="addStorageInfo.selectId"
            multiple
            collapse-tags
            @change="handleProductSelect"
          >
            <el-option
              v-for="item in productSelectData"
              :key="item.spec_id"
              :label="item.name + '（规格：' + item.spec + '）'"
              :value="item.spec_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <div class="spec-table">
          <el-table
            :data="addStorageInfo.productList"
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
              prop="unit_id"
              label="产品单位"
              min-width="80"
              align="center"
            >
              <template #default="scope">
                <span>{{ getUnitName(scope.row.unit_id) }}</span>
              </template>
            </el-table-column>
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
  <el-dialog
    v-model="checkDialogVisible"
    :title="isAudit ? '审核入库单' : '查看入库单'"
    width="650px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="status-form">
      <div class="option">
        <div class="label">当前状态：</div>
        <div class="value">
          <el-tag type="info" size="large" v-if="status === 0">待审核</el-tag>
          <el-tag type="warning" size="large" v-if="status === 2"
            >已驳回</el-tag
          >
          <el-tag type="success" size="large" v-if="status === 1"
            >入库完成</el-tag
          >
        </div>
      </div>
      <div class="option">
        <div class="label">入库单内容：</div>
        <div class="value">
          <div class="spec-table">
            <el-table
              :data="checkInfo.productList"
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
                prop="unit_id"
                label="产品单位"
                min-width="80"
                align="center"
              >
                <template #default="scope">
                  <span>{{ getUnitName(scope.row.unit_id) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="product_price"
                label="入库价格"
                min-width="80"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="product_num"
                label="入库数量"
                min-width="80"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="desc"
                label="描述"
                min-width="80"
                align="center"
              ></el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="option" v-if="isAudit">
        <div class="label">更改状态：</div>
        <div class="value">
          <el-radio-group v-model="checkInfo.status">
            <el-radio-button :label="2">驳回</el-radio-button>
            <el-radio-button :label="1">确认入库</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="option" v-if="checkInfo.status === 2">
        <div class="label">驳回原因：</div>
        <div class="value">
          <el-input
            v-model="checkInfo.refuse_reason"
            :disabled="!isAudit"
            type="textarea"
            :rows="4"
            resize="none"
            placeholder="请输入内容"
          />
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="checkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCheckClick" v-if="isAudit">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.add-storage-manage {
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .head {
    margin: 10px 0;
    box-sizing: border-box;
    padding: 0 15px 0px;
    width: 100%;
    border-bottom: 1px solid #eee;
    display: flex;
    flex-wrap: wrap;
    .search-wrap {
      display: flex;
      flex-wrap: wrap;
      .option {
        display: flex;
        align-items: center;
        margin-right: 15px;
        margin-bottom: 10px;
        .label {
          margin-right: 10px;
          font-size: 14px;
          color: #666;
          width: 70px;
        }
        .value {
          flex: 1;
        }
      }
    }
    .btn {
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
  .table {
    width: 100%;
    flex: 1;
    box-sizing: border-box;
    padding: 0 15px;
  }
  .paging {
    width: 100%;
    display: flex;
    justify-content: center;
    margin: 20px 0;
  }
}
.status-form {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  padding: 10px;
  .option {
    width: 100%;
    display: flex;
    margin-bottom: 15px;
    .spec-table {
      width: 100%;
    }
    .label {
      margin-right: 10px;
      font-size: 14px;
      color: #666;
      width: 85px;
    }
    .value {
      flex: 1;
    }
  }
}
</style>


<script setup>
import { reactive, ref } from 'vue';
import useDealCompanyData from './useDealCompanyData';

const {
  dealCompanyData,
  total,
  getDealCompanyList,
  addDealCompanyClick,
  editDealCompanyClick,
  deleteDealCompanyClick
} = useDealCompanyData();
// 搜索信息
const searchInfo = reactive({
  page: 1,
  size: 10,
  keyword: ''
});
getDealCompanyList(searchInfo);
// 往来单位信息
const companyInfo = ref({});
// 弹窗信息
const dialogVisible = ref(false);
const isAdd = ref(false);
// 新增往来单位
const handleAddRole = () => {
  isAdd.value = true;
  dialogVisible.value = true;
};

// 修改往来单位
const handleEditCompany = row => {
  isAdd.value = false;
  dialogVisible.value = true;
  companyInfo.value = { ...row };
};

// 弹窗确认事件
const formRef = ref();
const confirmClick = () => {
  formRef.value.validate(valid => {
    if (valid) {
      if (isAdd.value) {
        addDealCompanyClick(companyInfo.value, () => {
          dialogVisible.value = false;
        });
      } else {
        editDealCompanyClick(companyInfo.value, () => {
          dialogVisible.value = false;
        });
      }
    }
  });
};
// 弹窗关闭事件
const handleClose = () => {
  companyInfo.value = {};
};

// 删除往来单位
const handleDeleteCompany = row => {
  deleteDealCompanyClick({ id: row.id });
};
const rules = {
  name: [
    {
      required: true,
      message: '请输入往来单位名称',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    }
  ],
  class_id: [
    {
      required: true,
      message: '请选择分类',
      trigger: 'blur'
    }
  ]
};
</script>

<template>
  <div class="company-manage">
    <div class="head">
      <div class="search-wrap">
        <div class="option" style="width: 130px">
          <!-- <div class="label">：</div> -->
          <div class="value">
            <el-input
              v-model="searchInfo.phone"
              placeholder="请输入手机号"
              clearable
            />
          </div>
        </div>
        <div class="option" style="width: 150px">
          <!-- <div class="label">：</div> -->
          <div class="value">
            <el-input
              v-model="searchInfo.product_name"
              placeholder="请输入往来单位名称"
              clearable
            />
          </div>
        </div>
        <div class="option" style="width: 230px">
          <!-- <div class="label">：</div> -->
          <div class="value">
            <el-input
              v-model="searchInfo.keyword"
              placeholder="地址，业务，描述的关键字查询"
              clearable
            />
          </div>
        </div>
      </div>
      <div class="btn">
        <el-button type="primary" @click="getDealCompanyList(searchInfo)"> 查询 </el-button>
      </div>
      <div class="btn">
        <el-button type="primary" @click="handleAddRole">
          添加往来单位
        </el-button>
      </div>
    </div>
    <div class="table">
      <el-table
        :data="dealCompanyData"
        border
        :header-cell-style="{ 'background-color': '#DDE2EE' }"
        align="center"
        height="100%"
      >
        <el-table-column
          prop="name"
          label="往来单位名称"
          min-width="100"
          align="center"
        />
        <el-table-column
          prop="phone"
          width="120"
          label="手机号"
          align="center"
        />
        <el-table-column prop="local_phone" label="400电话" align="center" />
        <el-table-column prop="address" label="公司地址" align="center" />
        <el-table-column prop="business" label="主营业务" align="center" />
        <el-table-column prop="description" label="描述" align="center" />
        <el-table-column
          prop="create_time"
          width="170"
          label="创建时间"
          align="center"
        />
        <el-table-column prop="class_id" label="所属分类" align="center">
          <template #default="scope">
            {{ scope.row.class_id === 1 ? '入库' : '出库' }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="160" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEditCompany(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDeleteCompany(scope.row)"
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
        @size-change="getCompanyList(searchInfo)"
        @current-change="getCompanyList(searchInfo)"
      />
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="isAdd ? '添加往来单位' : '修改往来单位'"
    width="650px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="form">
      <el-form
        ref="formRef"
        :model="companyInfo"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="往来单位名称" prop="name">
          <el-input
            v-model="companyInfo.name"
            placeholder="请输入往来单位名称"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="companyInfo.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="400电话" prop="local_phone">
          <el-input
            v-model="companyInfo.local_phone"
            placeholder="请输入400电话"
          />
        </el-form-item>
        <el-form-item label="主营业务" prop="business">
          <el-input
            v-model="companyInfo.business"
            placeholder="请输入主营业务"
          />
        </el-form-item>
        <el-form-item label="公司地址" prop="address">
          <el-input
            v-model="companyInfo.address"
            placeholder="请输入公司地址"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="companyInfo.description"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item label="分类" prop="class_id">
          <el-radio-group v-model="companyInfo.class_id">
            <el-radio :label="1"> 入库 </el-radio>
            <el-radio :label="2"> 出库 </el-radio>
          </el-radio-group>
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
.company-manage {
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
    }
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

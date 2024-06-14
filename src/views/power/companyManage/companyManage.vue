<script setup>
import { reactive, ref } from 'vue';
import useCompanyData from './useCompanyData';

const {
  companyData,
  total,
  getCompanyList,
  addCompanyClick,
  editCompanyClick,
  deleteCompanyClick,
  // signCompanyClick,
} = useCompanyData();
// 搜索信息
const searchInfo = reactive({
  page: 1,
  size: 10,
  keyword: '',
});
getCompanyList(searchInfo);
// 公司信息
const companyInfo = ref({});
// 弹窗信息
const dialogVisible = ref(false);
const isAdd = ref(false);
// 新增公司
const handleAddRole = () => {
  isAdd.value = true;
  dialogVisible.value = true;
};

// 修改公司
const handleEditCompany = (row) => {
  isAdd.value = false;
  dialogVisible.value = true;
  companyInfo.value = { ...row };
};

// 弹窗确认事件
const confirmClick = () => {
  if (isAdd.value) {
    addCompanyClick(companyInfo.value);
  } else {
    editCompanyClick(companyInfo.value);
  }
  dialogVisible.value = false;
};
// 弹窗关闭事件
const handleClose = () => {
  companyInfo.value = {};
};

// 删除公司
const handleDeleteCompany = (row) => {
  deleteCompanyClick({ id: row.id });
};
</script>

<template>
  <div class="company-manage">
    <div class="add-company">
      <el-button type="primary" @click="handleAddRole">
        添加公司
      </el-button>
    </div>
    <div class="table">
      <el-table
        :data="companyData"
        border
        :header-cell-style="{ 'background-color': '#DDE2EE' }"
        align="center"
        height="100%"
      >
        <el-table-column
          prop="name"
          label="公司名称"
          min-width="80"
          align="center"
        />
        <el-table-column
          prop="business"
          label="主营业务"
          align="center"
        />
        <el-table-column
          prop="description"
          label="描述"
          align="center"
        />
        <el-table-column prop="create_time" label="创建时间" align="center" />
        <el-table-column prop="scope" label="状态" align="center">
          <template #default="scope">
            {{ scope.row.status === 1 ? '启用' : '禁用' }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="220" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEditCompany(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              size="small"
              plain
              @click="handleAuthCompany(scope.row)"
            >
              授权
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
    :title="isAdd ? '添加公司' : '修改公司'"
    width="650px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="form">
      <el-form :model="companyInfo" label-width="120px">
        <el-form-item label="公司名称">
          <el-input v-model="companyInfo.name" />
        </el-form-item>
        <el-form-item label="主营业务">
          <el-input v-model="companyInfo.business" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="companyInfo.description" />
        </el-form-item>
        <!-- <el-form-item label="公司名称">
          <el-input v-model="companyInfo.name" />
        </el-form-item> -->
        <el-form-item label="是否启用">
          <el-radio-group v-model="companyInfo.status">
            <el-radio :label="1">
              启用
            </el-radio>
            <el-radio :label="0">
              禁用
            </el-radio>
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
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .add-company {
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
./usecompanyData

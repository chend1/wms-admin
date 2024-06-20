<script setup>
import { reactive, ref } from 'vue';
import useUnitData from './useUnitData';

const { unitData, getUnitList, addUnitClick, editUnitClick, deleteUnitClick } =
  useUnitData();
// 搜索信息
const searchInfo = reactive({
  keyword: ''
});
getUnitList(searchInfo);
// 产品单位信息
const unitInfo = ref({});
// 弹窗信息
const dialogVisible = ref(false);
const isAdd = ref(false);
// 新增产品单位
const handleAddUnit = () => {
  isAdd.value = true;
  dialogVisible.value = true;
};

// 修改产品单位
const handleEditUnit = row => {
  isAdd.value = false;
  dialogVisible.value = true;
  unitInfo.value = { ...row };
};

// 删除产品单位
const handleDeleteUnit = row => {
  deleteUnitClick({ id: row.id });
};
// 弹窗确认事件
const formRef = ref();
const confirmClick = () => {
  formRef.value.validate(valid => {
    if (valid) {
      if (isAdd.value) {
        addUnitClick(unitInfo.value, () => {
          dialogVisible.value = false;
        });
      } else {
        editUnitClick(unitInfo.value, () => {
          dialogVisible.value = false;
        });
      }
    }
  });
};
// 弹窗关闭事件
const handleClose = () => {
  unitInfo.value = { status: 1 };
  formRef.value && formRef.value.resetFields();
};

const rules = {
  unit: [
    {
      required: true,
      message: '请输入产品单位名',
      trigger: 'blur'
    }
  ]
};
</script>

<template>
  <div class="unit-manage">
    <div class="add-unit">
      <el-button type="primary" @click="handleAddUnit"> 添加产品单位 </el-button>
    </div>
    <div class="table">
      <el-table
        :data="unitData"
        border
        :header-cell-style="{ 'background-color': '#DDE2EE' }"
        align="center"
        height="100%"
      >
        <el-table-column
          prop="unit"
          label="产品单位"
          min-width="80"
          align="center"
        />
        <el-table-column
          prop="create_time"
          label="创建时间"
          align="center"
        />
        <el-table-column prop="" label="操作" width="180" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEditUnit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDeleteUnit(scope.row)"
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
        :model="unitInfo"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="产品名称" prop="unit">
          <el-input v-model="unitInfo.unit" />
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
.unit-manage {
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .add-unit {
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

<script setup>
import { reactive, ref } from 'vue';
import useGroupData from './useGroupData';

const {
  groupData,
  getGroupList,
  addGroupClick,
  editGroupClick,
  deleteGroupClick
} = useGroupData();
// 搜索信息
const searchInfo = reactive({
  keyword: ''
});
getGroupList(searchInfo);
// 分类信息
const groupInfo = ref({
  status: 1
});
// 弹窗信息
const dialogVisible = ref(false);
const isAdd = ref(false);
// 新增分类
const handleAddGroup = row => {
  groupInfo.value.parent_id = row.id || 0;
  isAdd.value = true;
  dialogVisible.value = true;
};

// 修改分类
const handleEditGroup = row => {
  isAdd.value = false;
  dialogVisible.value = true;
  groupInfo.value = { ...row };
};

// 删除分类
const handleDeleteGroup = row => {
  deleteGroupClick({ id: row.id });
};
// 弹窗确认事件
const formRef = ref();
const confirmClick = () => {
  formRef.value.validate(valid => {
    if (valid) {
      if (isAdd.value) {
        addGroupClick(groupInfo.value);
      } else {
        editGroupClick(groupInfo.value);
      }
      dialogVisible.value = false;
    }
  });
};
// 弹窗关闭事件
const handleClose = () => {
  groupInfo.value = { status: 1 };
  formRef.value && formRef.value.resetFields();
};

const rules = {
  title: [
    {
      required: true,
      message: '请输入分类名称',
      trigger: 'blur'
    }
  ],
  path: [
    {
      required: true,
      message: '请输入分类路径',
      trigger: 'blur'
    }
  ]
};
</script>

<template>
  <div class="group-manage">
    <div class="add-group">
      <el-button type="primary" @click="handleAddGroup"> 添加分类 </el-button>
    </div>
    <div class="table">
      <el-table
        :data="groupData"
        border
        :header-cell-style="{ 'background-color': '#DDE2EE' }"
        align="center"
        height="100%"
        row-key="id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="Group_name" label="分类名称" />
        <el-table-column prop="path" label="路径" align="center" />
        <el-table-column prop="sort" label="排序" align="center" />
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            {{ scope.row.status === 1 ? '显示' : '隐藏' }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="220" align="center">
          <template #default="scope">
            <el-button
              type="success"
              color="#28C69F"
              style="color: #fff"
              size="small"
              @click="handleAddGroup(scope.row)"
            >
              新增
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="handleEditGroup(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="small"
              :disabled="scope.row.children && scope.row.children.length > 0"
              @click="handleDeleteGroup(scope.row)"
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
    :title="isAdd ? '添加分类' : '修改分类'"
    width="650px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="form">
      <el-form
        ref="formRef"
        :model="groupInfo"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="上级分类">
          <el-select
            v-model="groupInfo.parent_id"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in GroupOptions"
              :key="item.id"
              :label="item.Group_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="Group_name">
          <el-input v-model="groupInfo.Group_name" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="前端路径" prop="path">
          <el-input v-model="groupInfo.path" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="groupInfo.sort" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="groupInfo.icon" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="groupInfo.status">
            <el-radio :label="1"> 显示 </el-radio>
            <el-radio :label="0"> 隐藏 </el-radio>
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
.group-manage {
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .add-group {
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

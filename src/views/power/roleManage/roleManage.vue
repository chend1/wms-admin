<script setup>
import { reactive, ref, nextTick } from 'vue';
import useRoleData from './useRoleData';
import useMenuData from '../menuManage/useMenuData';

const {
  roleData,
  total,
  getRoleList,
  addRoleClick,
  editRoleClick,
  deleteRoleClick,
  grantRoleClick,
} = useRoleData();
// 搜索信息
const searchInfo = reactive({
  page: 1,
  size: 10,
  keyword: '',
});
getRoleList(searchInfo);
// 角色信息
const roleInfo = ref({});
// 弹窗信息
const dialogVisible = ref(false);
const isAdd = ref(false);
// 新增角色
const handleAddRole = () => {
  isAdd.value = true;
  dialogVisible.value = true;
};

// 修改角色
const handleEditRole = (row) => {
  isAdd.value = false;
  dialogVisible.value = true;
  roleInfo.value = { ...row };
};

// 删除角色
const handleDeleteRole = (row) => {
  deleteRoleClick({ id: row.id });
};
// 弹窗确认事件
const confirmClick = () => {
  if (isAdd.value) {
    addRoleClick(roleInfo.value);
  } else {
    editRoleClick(roleInfo.value);
  }
  dialogVisible.value = false;
};
// 弹窗关闭事件
const handleClose = () => {
  roleInfo.value = {};
};
// -----------------------------------------------------
const ruleDialogVisible = ref(false);
// 默认选中的权限
const ruleList = ref([]);
// 选中的权限列表
const selectAuthList = ref([]);
// 授权树
const menuAuthTree = ref();
const { menuData, menuOptions, getMenuList } = useMenuData();
getMenuList();
const defaultProps = ref({
  children: 'children',
  label: 'menu_name',
});
// 授权角色
const handleAuthRole = async (row) => {
  roleInfo.value = row;
  const list = row.auth_list ? row.auth_list.split(',') : [];
  ruleList.value = list;
  ruleDialogVisible.value = true;
  await nextTick();
  const menuTree = menuAuthTree.value.getCheckedNodes();
  selectAuthList.value = menuTree;
  // console.log('selectAuthList', selectAuthList.value);
};
// 确认点击
const ruleConfirmClick = () => {
  const rules = selectAuthList.value.map((item) => item.id);
  grantRoleClick({
    id: roleInfo.value.id,
    auth_list: rules.toString(),
  }, () => {
    ruleDialogVisible.value = false;
  });
};

// 授权弹窗关闭
const handleRuleClose = () => {
  ruleList.value = [];
  menuAuthTree.value.setCheckedNodes([]);
};
// 节点点击事件
function nodeClick(node, all) {
  // console.log(node, all);
  const list = all.checkedNodes;
  const ids = all.checkedKeys;
  if (ids.indexOf(node.id) !== -1) {
    // 选中节点
    selectAuthList.value = [...list];
    // 选中父级
    if (node.parent_id !== 0 && ids.indexOf(node.parent_id) === -1) {
      const menu = menuOptions.value.filter((item) => item.id === node.parent_id);
      selectAuthList.value.push(menu[0]);
      menuAuthTree.value.setCheckedNodes(selectAuthList.value);
    }
    // 选中子级
    if (node.children && node.children.length > 0) {
      node.children.forEach((item) => {
        if (ids.indexOf(item.id) === -1) {
          selectAuthList.value.push(item);
        }
      });
      menuAuthTree.value.setCheckedNodes(selectAuthList.value);
    }
  } else {
    // 未选中节点
    selectAuthList.value = list;
    // 取消子级选中
    if (node.children && node.children.length > 0) {
      selectAuthList.value = [];
      list.forEach((item) => {
        let flag = false;
        node.children.forEach((menu) => {
          if (item.id === menu.id) {
            flag = true;
          }
        });
        if (!flag) {
          selectAuthList.value.push(item);
        }
      });
    }
    menuAuthTree.value.setCheckedNodes(selectAuthList.value);
  }
}
</script>

<template>
  <div class="role-manage">
    <div class="add-role">
      <el-button
        type="primary"
        @click="handleAddRole"
      >
        添加角色
      </el-button>
    </div>
    <div class="table">
      <el-table
        :data="roleData"
        border
        :header-cell-style="{ 'background-color': '#DDE2EE' }"
        align="center"
        height="100%"
      >
        <el-table-column
          prop="role_name"
          label="角色名"
          min-width="80"
          align="center"
        />
        <el-table-column
          prop="role_level"
          label="角色等级"
          min-width="80"
          align="center"
        />
        <el-table-column
          prop="create_time"
          label="创建时间"
          align="center"
        />
        <el-table-column
          prop="principal"
          label="状态"
          align="center"
        >
          <template #default="scope">
            {{ scope.row.status === 1 ? '启用' : '禁用' }}
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="操作"
          width="220"
          align="center"
        >
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEditRole(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="primary"
              size="small"
              plain
              @click="handleAuthRole(scope.row)"
            >
              授权
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDeleteRole(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div
      v-if="total > 0"
      class="paging"
    >
      <el-pagination
        v-model:current-page="searchInfo.page"
        v-model:page-size="searchInfo.length"
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[5, 10, 15, 20]"
        :total="total"
        @size-change="getRoleList(searchInfo)"
        @current-change="getRoleList(searchInfo)"
      />
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="isAdd ? '添加角色' : '修改角色'"
    width="650px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="form">
      <el-form
        :model="roleInfo"
        label-width="120px"
      >
        <el-form-item label="角色名">
          <el-input v-model="roleInfo.role_name" />
        </el-form-item>
        <el-form-item label="角色等级">
          <el-input v-model="roleInfo.role_level" placeholder="角色等级为1-99，默认为1" />
        </el-form-item>
        <el-form-item label="是否启用">
          <el-radio-group v-model="roleInfo.status">
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
        <el-button
          type="primary"
          @click="confirmClick"
        > 确认 </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="ruleDialogVisible"
    title="授权角色"
    width="650px"
    :close-on-click-modal="false"
    @close="handleRuleClose"
  >
    <div class="tree">
      <el-tree
        ref="menuAuthTree"
        :data="menuData"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="ruleList"
        :props="defaultProps"
        :check-strictly="true"
        @check="nodeClick"
      ></el-tree>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="ruleDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="ruleConfirmClick"
        > 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
.role-manage {
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .add-role {
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

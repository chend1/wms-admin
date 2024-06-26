// 登录
export { login, getUserInfo } from './login/index';

// 成员
export {
  memberList,
  editMember,
  addMember,
  deleteMember
} from './member/index';

// 账号
export {
  userList,
  editUser,
  addUser,
  deleteUser,
  resetPassword,
  switchCompany
} from './user/index';

// 角色
export {
  roleList,
  editRole,
  addRole,
  deleteRole,
  grantRole,
  roleSelectList
} from './role/index';

// 菜单
export { menuList, editMenu, addMenu, deleteMenu } from './menu/index';

// 公司
export {
  companyList,
  addCompany,
  editCompany,
  signCompany,
  deleteCompany
} from './company/index';

// 往来公司
export {
  dealCompanyList,
  addDealCompany,
  editDealCompany,
  deleteDealCompany
} from './deal_company/index';

// 产品
export {
  productList,
  editProduct,
  addProduct,
  deleteProduct,
  getProductCode,
  editProductSpec,
  addProductSpec,
  deleteProductSpec
} from './product/index';

// 产品单位
export { unitList, editUnit, addUnit, deleteUnit } from './unit/index';

// 产品分类
export {
  groupList,
  editGroup,
  addGroup,
  deleteGroup
} from './product_group/index';

// 入库单
export {
  addStorageList,
  getAddStorageCode,
  addAddStorage,
  editAddStorage,
  deleteAddStorage,
  getAddStorageDetail,
  editAddStorageStatus,
  addAddStorageDetail,
  editAddStorageDetail,
  deleteAddStorageDetail
} from './addStorage/index';

// 出库单
export {
  removeStorageList,
  getRemoveStorageCode,
  addRemoveStorage,
  editRemoveStorage,
  deleteRemoveStorage,
  getRemoveStorageDetail,
  editRemoveStorageStatus,
  addRemoveStorageDetail,
  editRemoveStorageDetail,
  deleteRemoveStorageDetail
} from './removeStorage/index';

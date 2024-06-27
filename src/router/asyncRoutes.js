export const asyncRoutes = [
  {
    path: '/home',
    component: () => import('@/views/home/home.vue'),
    name: 'home',
    meta: { title: '首页', isLayout: true },
  },
  {
    path: '/power',
    redirect: '/power/userManage',
    meta: { title: '权限管理', isLayout: true },
    name: 'power',
    children: [
      {
        path: '/power/userManage',
        component: () => import('@/views/power/userManage/userManage.vue'),
        meta: { title: '账号管理', isLayout: true },
        name: 'userManage',
      },
      {
        path: '/power/roleManage',
        component: () => import('@/views/power/roleManage/roleManage.vue'),
        meta: { title: '角色管理', isLayout: true },
        name: 'roleManage',
      },
      {
        path: '/power/menuManage',
        component: () => import('@/views/power/menuManage/menuManage.vue'),
        meta: { title: '菜单管理', isLayout: true },
        name: 'menuManage',
      },
      {
        path: '/power/companyManage',
        component: () => import('@/views/power/companyManage/companyManage.vue'),
        meta: { title: '公司管理', isLayout: true },
        name: 'companyManage',
      },
    ],
  },
  {
    path: '/product',
    redirect: '/product/productManage',
    meta: { title: '产品管理', isLayout: true },
    name: 'product',
    children: [
      {
        path: '/product/productManage',
        component: () => import('@/views/product/productManage/productManage.vue'),
        meta: { title: '产品管理', isLayout: true },
        name: 'productManage',
      },
      {
        path: '/product/unitManage',
        component: () => import('@/views/product/unitManage/unitManage.vue'),
        meta: { title: '产品单位管理', isLayout: true },
        name: 'unitManage',
      },
      {
        path: '/product/dealCompanyManage',
        component: () => import('@/views/product/dealCompanyManage/dealCompanyManage.vue'),
        meta: { title: '往来单位管理', isLayout: true },
        name: 'dealCompanyManage',
      },
      {
        path: '/product/groupManage',
        component: () => import('@/views/product/groupManage/groupManage.vue'),
        meta: { title: '产品分类管理', isLayout: true },
        name: 'groupManage',
      }
    ],
  },
  {
    path: '/warehouse',
    redirect: '/warehouse/addStorage',
    meta: { title: '仓储管理', isLayout: true },
    name: 'warehouse',
    children: [
      {
        path: '/warehouse/addStorage',
        component: () => import('@/views/warehouse/addStorage/addStorage.vue'),
        meta: { title: '入库单', isLayout: true },
        name: 'addStorage',
      },
      {
        path: '/warehouse/removeStorage',
        component: () => import('@/views/warehouse/removeStorage/removeStorage.vue'),
        meta: { title: '出库单', isLayout: true },
        name: 'removeStorage',
      },
    ],
  },
];

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/doRegister',
    component: () => import('@/views/login/doRegister'),
    hidden: true
  },
  {
    path: '/forgetPassword',
    component: () => import('@/views/login/forgetPassword'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',

    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }

    }]
  }
  // #region
  /**
   *
   *{
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },
   */
  // #endregion

]

// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRoutes = [
  {
    path: '/userManager',
    component: Layout,
    name: 'userManager',
    meta: { title: '用户管理', icon: 'form', permission: ['userManager'] },
    children: [
      {
        path: 'userInfo',
        name: 'userInfo',
        component: () => import('@/views/user/userInfo'),
        meta: { title: '用户信息管理', icon: 'form', permission: ['allUserInfo'] }
      },
      {
        path: 'personalInfo',
        name: 'personalInfo',
        component: () => import('@/views/user/personalInfo'),
        meta: { title: '个人信息管理', icon: 'form', permission: ['myUserInfo'] }

      }
    ]
  },
  {
    path: '/petManager',
    component: Layout,
    name: 'PetManager',
    meta: { title: '宠物管理', icon: 'form', permission: ['petManager'] },
    children: [
      {
        path: 'allPetInfo',
        name: 'allPetInfo',
        component: () => import('@/views/pet/petInfo'),
        meta: { title: '宠物信息管理', icon: 'form', permission: ['allPetInfo'] }
      },
      {
        path: 'personalPetInfo',
        name: 'personalPetInfo',
        component: () => import('@/views/pet/personalPetInfo'),
        meta: { title: '个人宠物管理', icon: 'form', permission: ['myPetInfo'] }
      }
    ]
  },
  {
    path: '/employeeManager',
    component: Layout,
    name: 'EmployeeManager',
    meta: { title: '员工管理', icon: 'form', permission: ['employeemanager'] },
    children: [
      {
        path: 'employeeInfo',
        name: 'EmployeeInfo',
        component: () => import('@/views/employee/employeeInfo'),
        meta: { title: '员工信息管理', icon: 'form', permission: ['allEmployeeInfo'] }
      },
      {
        path: 'employeePersoanlInfo',
        name: 'employeePersoanlInfo',
        component: () => import('@/views/employee/employeePersoanlInfo'),
        meta: { title: '员工个人信息管理', icon: 'form', permission: ['myEmployeeInfo'] }
      }
    ]
  },

  {
    path: '/itemManager',
    component: Layout,
    name: 'itemManager',
    meta: { title: '项目管理', icon: 'form', permission: ['itemManager'] },
    children: [

      {

        path: 'itemInfo',
        name: 'itemInfo',
        component: () => import('@/views/item/item'),
        meta: { title: '项目信息管理', icon: 'form', permission: ['itemInfo'] }

      },
      {
        path: 'chooseAppoint',
        name: 'chooseAppoint',
        component: () => import('@/views/item/chooseAppoint'),
        meta: { title: '选择预约人员', icon: 'form', permission: ['chooseEmployee'] },
        hidden: true
      },
      // #region
      // {
      //   path: '/apponitDoctor',
      //   name: 'apponitDoctor',
      //   component: () => import('@/views/item/apponitDoctor'),
      //   meta: { title: '预约看病', icon: 'form' }
      // },

      // {
      //   path: '/apponitInjection',
      //   name: 'apponitInjection',
      //   component: () => import('@/views/item/apponitInjection'),
      //   meta: { title: '预约打疫苗', icon: 'form' }
      // },
      // #endregion
      {
        path: 'appointDeposit',
        name: 'appointDeposit',
        component: () => import('@/views/item/appointDeposit'),
        meta: { title: '预约托管', icon: 'form', permission: ['appointDeposit'] }
      }
    ]
  },
  {
    path: '/appointManager',
    component: Layout,
    name: 'appointManager',
    meta: { title: '预约管理', icon: 'form', permission: ['apponitManager'] },
    children: [
      {

        path: 'personalAppointList',
        name: 'personalAppointList',
        component: () => import('@/views/apponit/personalAppointList'),
        meta: { title: '历史预约', icon: 'form', permission: ['historyAppoint'] }

      },
      {

        path: 'myAppointCustomer',
        name: 'myAppointCustomer',
        component: () => import('@/views/apponit/myAppointCustomer'),
        meta: { title: '我的预约用户', icon: 'form', permission: ['myAppointCustomer'] }

      },

      // #region
      // {

      //   path: '/checkAppointList',
      //   name: 'checkAppointList',
      //   component: () => import('@/views/apponit/checkAppointList'),
      //   meta: { title: '看病预约列表', icon: 'form' }

      // },
      // {

      //   path: '/injectAppointList',
      //   name: 'injectAppointList',
      //   component: () => import('@/views/apponit/injectAppointList'),
      //   meta: { title: '打疫苗预约列表', icon: 'form' }

      // },

      // {

      //   path: '/depositAppointList',
      //   name: 'depositAppointList',
      //   component: () => import('@/views/apponit/depositAppointList'),
      //   meta: { title: '托管预约列表', icon: 'form', permission: ['appointDepositList'] }

      // },
      // #endregion
      {

        path: 'todayAppointList',
        name: 'todayAppointList',
        component: () => import('@/views/apponit/todayAppointList'),
        meta: { title: '本日预约列表', icon: 'form', permission: ['todayAppointList'] }

      },
      // #region
      /*
      {

        path: '/appointInfo',
        name: 'appointInfo',
        component: () => import('@/views/apponit/appointInfo'),
        meta: { title: '明日预约列表', icon: 'form' }

      },
      */
      // #endregion
      {

        path: 'appointInfo',
        name: 'appointInfo',
        component: () => import('@/views/apponit/appointInfo'),
        meta: { title: '预约信息管理', icon: 'form', permission: ['allAppointList'] }

      }
    ]
  },
  // #region
  // {
  //   path: '/depositManager',
  //   component: Layout,
  //   name: 'depositManager',
  //   meta: { title: '托管管理', icon: 'form' },
  //   children: [
  //     {

  //       path: '/depositInfo',
  //       name: 'depositInfo',
  //       component: () => import('@/views/deposit/depositInfo'),
  //       meta: { title: '托管信息', icon: 'form' }

  //     }
  //   ]
  // },
  // #endregion
  {
    path: '/medicalRecordManager',
    component: Layout,
    name: 'medicalRecord',
    meta: { title: '病历管理', icon: 'form', permission: ['medicaRecordManager'] },
    children: [
      {

        path: 'medicalRecordInfo',
        name: 'medicalRecordInfo',
        component: () => import('@/views/medicalRecord/medicalRecordInfo'),
        meta: { title: '宠物病历信息管理', icon: 'form', permission: ['medicalRecordList'] }

      }
    ]
  },
  {
    path: '/roomManager',
    component: Layout,
    name: 'roomManager',
    meta: { title: '宠物房间管理', icon: 'form', permission: ['roomManager'] },
    children: [
      {

        path: 'roomlist',
        name: 'roomlist',
        component: () => import('@/views/room/roomlist'),
        meta: { title: '宠物房间信息管理', icon: 'form', permission: ['roomList'] }

      }
    ]
  },
  {
    path: '/prescirbeManager',
    component: Layout,
    name: 'prescirbeManager',
    meta: { title: '配药管理', icon: 'form', permission: ['prescribeManager'] },
    children: [
      {

        path: 'allPrescribeList',
        name: 'allPrescribeList',
        component: () => import('@/views/prescribe/allPrescribeList'),
        meta: { title: '配药信息管理', icon: 'form', permission: ['prescribeList'] }

      },
      {

        path: 'myPrescribe',
        name: 'myPrescribe',
        component: () => import('@/views/prescribe/myPrescribe'),
        meta: { title: '我的配药', icon: 'form', permission: ['myPrescribe'] }

      }
    ]
  },
  {
    path: '/permissionControl',
    component: Layout,
    name: 'permissionControl',
    meta: { title: '权限控制', icon: 'form', permission: ['permissionControl'] },
    children: [
      {

        path: 'roleManager',
        name: 'roleManager',
        component: () => import('@/views/role/roleManager'),
        meta: { title: '角色管理', icon: 'form', permission: ['roleManager'] }

      },
      {

        path: 'permissionManager',
        name: 'permissionManager',
        component: () => import('@/views/permission/permissionManager'),
        meta: { title: '权限管理', icon: 'form', permission: ['permissionManager'] }

      }
    ]
  },
  {
    path: '/medicineManager',
    component: Layout,
    name: 'medicineManager',
    meta: { title: '药品管理', icon: 'form', permission: ['medicineManager'] },
    children: [
      {

        path: 'medicineInfo',
        name: 'medicineInfo',
        component: () => import('@/views/medicine/medicineInfo'),
        meta: { title: '药品信息管理', icon: 'form', permission: ['medicineInfo'] }

      }
    ]
  },
  {
    path: '/dutyManager',
    component: Layout,
    name: 'dutyManager',
    meta: { title: '值班管理', icon: 'form', permission: ['dutyManager'] },
    children: [
      {

        path: 'dutyInfo',
        name: 'dutyInfo',
        component: () => import('@/views/duty/dutyInfo'),
        meta: { title: '值班信息管理', icon: 'form', permission: ['dutyInfo'] }

      }
    ]
  },
  // 如果路由没有找到强匹配的地址，就会选择重定向“/404
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

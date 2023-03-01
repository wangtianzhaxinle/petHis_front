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
  },

  /* {
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
  */
  {
    path: '/petManager',
    component: Layout,
    name: 'PetManager',
    meta: { title: '宠物管理', icon: 'form' },
    children: [
      {
        path: 'allPetInfo',
        name: 'allPetInfo',
        component: () => import('@/views/pet/petInfo'),
        meta: { title: '全部宠物信息', icon: 'form' }
      },
      {
        path: 'personalPetInfo',
        name: 'personalPetInfo',
        component: () => import('@/views/pet/petInfo'),
        meta: { title: '个人宠物信息', icon: 'form' }
      }
    ]
  },
  {
    path: '/employeeManager',
    component: Layout,
    name: 'EmployeeManager',
    meta: { title: '员工管理', icon: 'form' },
    children: [
      {
        path: 'employeeInfo',
        name: 'EmployeeInfo',
        component: () => import('@/views/employee/employeeInfo'),
        meta: { title: '员工信息', icon: 'form' }
      }
    ]
  },
  {
    path: '/userManager',
    component: Layout,
    name: 'userManager',
    meta: { title: '用户管理', icon: 'form' },
    children: [
      {
        path: 'userInfo',
        name: 'userInfo',
        component: () => import('@/views/user/userInfo'),
        meta: { title: '用户信息', icon: 'form' }
      }, {

        path: '/personalInfo',
        name: 'personalInfo',
        component: () => import('@/views/user/personalInfo'),
        meta: { title: '个人信息', icon: 'form' }

      }
    ]
  },
  {
    path: '/orderManager',
    component: Layout,
    name: 'orderManager',
    meta: { title: '订单管理', icon: 'form' },
    children: [
      {
        path: 'allOrderInfo',
        name: 'allOrderInfo',
        component: () => import('@/views/user/userInfo'),
        meta: { title: '订单信息', icon: 'form' }
      },
      {
        path: 'personalOrderInfo',
        name: 'personalorderInfo',
        component: () => import('@/views/user/userInfo'),
        meta: { title: '个人订单信息', icon: 'form' }
      }
    ]
  },

  {
    path: '/projectManager',
    component: Layout,
    name: 'projectManager',
    meta: { title: '项目管理', icon: 'form' },
    children: [
      {

        path: '/projectInfo',
        name: 'projectInfo',
        component: () => import('@/views/user/personalInfo'),
        meta: { title: '项目信息', icon: 'form' }

      }
    ]
  },
  {
    path: '/medicalRecordManager',
    component: Layout,
    name: 'medicalRecord',
    meta: { title: '病历管理', icon: 'form' },
    children: [
      {

        path: '/medicalRecordInfo',
        name: 'medicalRecordInfo',
        component: () => import('@/views/user/personalInfo'),
        meta: { title: '宠物病历信息', icon: 'form' }

      }
    ]
  },
  {
    path: '/permissionControl',
    component: Layout,
    name: 'permissionControl',
    meta: { title: '权限控制', icon: 'form' },
    children: [
      {

        path: '/roleManager',
        name: 'roleManager',
        component: () => import('@/views/user/personalInfo'),
        meta: { title: '角色管理', icon: 'form' }

      },
      {

        path: '/permissionManager',
        name: 'permissionManager',
        component: () => import('@/views/user/personalInfo'),
        meta: { title: '权限管理', icon: 'form' }

      }
    ]
  },
  {
    path: '/apponitManager',
    component: Layout,
    name: 'apponitManager',
    meta: { title: '预约管理', icon: 'form' },
    children: [
      {

        path: '/apponitInfo',
        name: 'apponitInfo',
        component: () => import('@/views/user/personalInfo'),
        meta: { title: '预约信息', icon: 'form' }

      }
    ]
  },
  {
    path: '/depositManager',
    component: Layout,
    name: 'depositManager',
    meta: { title: '托管管理', icon: 'form' },
    children: [
      {

        path: '/depositInfo',
        name: 'depositInfo',
        component: () => import('@/views/user/personalInfo'),
        meta: { title: '托管信息', icon: 'form' }

      }
    ]
  },
  {
    path: '/medicineManager',
    component: Layout,
    name: 'medicineManager',
    meta: { title: '药品管理', icon: 'form' },
    children: [
      {

        path: '/medicineInfo',
        name: 'medicineInfo',
        component: () => import('@/views/user/personalInfo'),
        meta: { title: '药品信息', icon: 'form' }

      }
    ]
  },
  {
    path: '/dutyManager',
    component: Layout,
    name: 'dutyManager',
    meta: { title: '值班管理', icon: 'form' },
    children: [
      {

        path: '/dutyInfo',
        name: 'dutyInfo',
        component: () => import('@/views/duty/dutyInfo'),
        meta: { title: '值班信息', icon: 'form' }

      }
    ]
  },
  /* {
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

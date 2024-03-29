import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
//  页面加载进度条nprogress
NProgress.configure({ showSpinner: false }) // NProgress Configuration
//  vue项目配置白名单,记得加"/",因为没加斜杆点击注册重重定向404页面
const whiteList = ['/login', '/forgetPassword', '/doRegister'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title) // 设置页面标题
  const hasToken = getToken() // 确定用户是否有token
  if (hasToken) { // 有token
    if (to.path === '/login') {
      next({ path: '/' }) // 如果已登录，则重定向到主页
      NProgress.done()
    } else {
      // const hasGetUserInfo = store.getters.name
      // 确定用户是否通过getInfo获得了权限角色
      // 这里指的是src/store/getters.js的roles
      const hasPerm = store.getters.permissions && store.getters.permissions.length > 0
      if (hasPerm) { next() } else {
        try {
          const {
            permissions // 获取用户信息
          } = await store.dispatch('user/getInfo')
          // 2. 根据角色生成可访问路由图
          // 获取通过权限验证的路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', permissions) // 第二步
          router.options.routes = store.getters.permission_routes // 第三步
          router.addRoutes(accessRoutes) // 动态添加可访问路由
          // 这里next里面不加{ ...to, replace: true }的话会导致浏览器刷新页面变成空白
          next({ ...to, replace: true })
        } catch (error) {
          await store.dispatch('user/resetToken') // 移除token并回到登录页面重新登录
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 无token
    if (whiteList.indexOf(to.path) !== -1) {
      next()// 如果要去的页面在白名单内可以直接进入
    } else {
      // 如果在其他不在白名单的页面上会转到登录页面，并在登录后重新重定向回之前的页面
      next(`/login?redirect=${to.path}`)
      NProgress.done() //  进度条走到尽头
    }
  }
})
//  路由切换页面后让进度条走到尽头
router.afterEach(() => {
  NProgress.done()
})

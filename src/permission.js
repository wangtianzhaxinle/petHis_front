import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

//  页面加载进度条nprogress
NProgress.configure({ showSpinner: false }) // NProgress Configuration

//  vue项目配置白名单
const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否有token
  const hasToken = getToken()

  if (hasToken) { // 有token
    if (to.path === '/login') {
      // 如果已登录，则重定向到主页
      next({ path: '/' })
      //  进度条走到尽头
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 获取用户信息
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // 移除token并回到登录页面重新登录
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          //  进度条走到尽头
          NProgress.done()
        }
      }
    }
  } else {
    // 无token

    if (whiteList.indexOf(to.path) !== -1) {
      // 如果要去的页面在白名单内可以直接进入
      next()
    } else {
      // 如果在其他不在白名单的页面上会转到登录页面，并在登录后重新重定向回之前的页面
      next(`/login?redirect=${to.path}`)
      //  进度条走到尽头
      NProgress.done()
    }
  }
})
//  路由切换页面后让进度条走到尽头
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

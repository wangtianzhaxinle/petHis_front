import {
  asyncRoutes,
  constantRoutes
} from '@/router'
// 使用 meta.role 以确定当前用户是否具有权限
// 匹配权限
function hasPermission(permissions, route) {
  if (route.meta && route.meta.permission) {
    return permissions.some(permission =>
      route.meta.permission.includes(permission))
  } else {
    // 如果动态路由没有设置权限,就会视为无需权限的公共菜单
    return true
  }
}
// 通过递归过滤异步路由表
export function filterAsyncRoutes(routes, permissions) {
  const res = []
  console.log('filterAsyncRoutes' + permissions)
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(permissions, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions)
      }
      res.push(tmp)
    }
  })
  return res
}
const state = {
  routes: [],
  addRoutes: []
}
const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // 将过滤后的路由和constantRoutes存起来
    state.routes = constantRoutes.concat(routes)
  }
}
// 筛选
const actions = {
  generateRoutes({
    commit
  }, permissions) {
    return new Promise(resolve => {
      // 过滤路由，accessedRoutes这个就是当前角色可见的动态路由
      const accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}


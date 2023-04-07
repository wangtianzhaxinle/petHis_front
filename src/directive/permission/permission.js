import store from '@/store'
function checkPermission(el, binding) {
  const { value } = binding
  //  console.log(value)
  const permissions = store.getters && store.getters.permissions
  if (value && value instanceof Array) {
    // console.log('按钮权限')
    if (value.length > 0) {
      const permissionRoles = value
      //  console.log('按钮权限 value.length > 0 ')
      const hasPermission = permissions.some(permission => {
        return permissionRoles.includes(permission)
      })
      if (!hasPermission) {
        // console.log('按钮权限 !hasPermission')
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else { throw new Error(`need roles! Like v-permission="['权限不足','权限不足']"`) }
}
export default {
  inserted(el, binding) { checkPermission(el, binding) },
  update(el, binding) { checkPermission(el, binding) }
}

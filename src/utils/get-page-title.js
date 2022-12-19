import defaultSettings from '@/settings'
// 每一次route都会把路由的标题拼接上settings里面的title，去改变浏览器标题
const title = defaultSettings.title || 'Vue Admin Template'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

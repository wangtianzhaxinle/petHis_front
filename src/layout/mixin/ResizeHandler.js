import store from '@/store'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export default {
  watch: {
    // 路由监听,route是变化后的新数据,即$route(to,from)的to
    $route(route) {
      if (this.device === 'mobile' && this.sidebar.opened) {
        // 如果当前设备是手机且侧边栏已经展开,则关闭侧边栏,并开启tranition

        store.dispatch('app/closeSideBar', { withoutAnimation: false })
      }
    }
  },
  beforeMount() {
    // 添加浏览器窗口监听事件
    window.addEventListener('resize', this.$_resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$_resizeHandler)
  },
  mounted() {
    const isMobile = this.$_isMobile()
    if (isMobile) {
      // 如果是手机端关闭transition
      store.dispatch('app/toggleDevice', 'mobile')
      store.dispatch('app/closeSideBar', { withoutAnimation: true })
    }
  },
  methods: {
    // use $_ for mixins properties
    // https://vuejs.org/v2/style-guide/index.html#Private-property-names-essential
    $_isMobile() {
      // getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置。
      const rect = body.getBoundingClientRect()
      return rect.width - 1 < WIDTH
    },
    // 窗口大小发生变化事件
    $_resizeHandler() {
      if (!document.hidden) { // 如果标签页隐藏
        const isMobile = this.$_isMobile()
        // 修改当前使用的设备类型
        store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')

        if (isMobile) {
          // 如果当前所用设备是手机,关闭transition
          store.dispatch('app/closeSideBar', { withoutAnimation: true })
        }
      }
    }
  }
}

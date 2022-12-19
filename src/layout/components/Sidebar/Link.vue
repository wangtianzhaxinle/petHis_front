<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  // 从父组件接收参数to,类型为String,该参数必须传递
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    // 判断链接是否是外部网站的
    isExternal() {
      return isExternal(this.to)
    },
    // 如果链接是外部网站的使用a标签,如果是本网站的路由链接则使用route-link标签
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    // 从父组件接收的参数to
    linkProps(to) {
      if (this.isExternal) {
        // 如果是外部网站的链接
        return {
          href: to,
          // 在新标签页打开
          target: '_blank',
          // 打开一个新的标签页时，新页面的 window 对象上有一个属性 opener，它指向的是前一个页面的 window 对象，因此，后一个页面就获得了前一个页面的控制权
          // 使用rel="noopener"后,再打开后你会发现 window.opener 已经被置为了 null
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>

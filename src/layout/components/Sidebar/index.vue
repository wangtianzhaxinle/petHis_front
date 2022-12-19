<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    // 获取路由信息
    routes() {
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      // 返回要高亮的菜单项path

      if (meta.activeMenu) {
      //  如果路由信息meta里面设置了activeMenu,会转而使activeMenu里面设置的path所对应的菜单项高亮
      // 但是如果连点两下菜单项还是会是自身的item高亮
        return meta.activeMenu
      }
      return path
    },
    // 显示logo
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    // 获取@/style/ariables.scss的样式设置
    variables() {
      return variables
    },
    // 控制 el-menu 的展开和折叠
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

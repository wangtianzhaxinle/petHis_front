<template>
  <!-- 如果菜单项是隐藏的则不显示它以及它的子菜单项 -->
  <div v-if="!item.hidden">
    <!-- 来判断是该路由是否是只有一层级菜单 -->
    <!-- 如果该路由是复合菜单，则执行<el-submenu><el-submenu/>，在el-submenu里面将会再次执行sidebar-item组件，遍历直到路由只有一层菜单 -->

    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <!-- <app-link><app-link/>是通过通过动态组件component  :is=‘type’ 来动态显示相应内容 -->
      <!-- 其中isExternal 来判读type类型，决定是显示 a 链接 或是 router-link -->
      <!-- el-menu-item标签中的index属性值应该是一个唯一标识,所以用全路径表示 -->
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <!-- <Item/>组件 是用来显示对应的Icon图标和Title -->
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>
    <!-- 如果有多个子菜单，如example和nested，先展示父菜单 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <!-- 展示父菜单，这里的slot=title是element-ui里定义的具名slot -->
      <template slot="title">
        <!-- 这部分内容会被插入到item.vue的name=title插槽上 -->
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!-- 这里递归地调用自己 -->
      <!-- is-nest表示是否嵌套 -->
      <!-- 如果有子菜单，则递归展示sidebar-item -->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },

    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      // 数组过滤出未隐藏的子路由
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      // 当你一个路由下面的 children 声明的路由大于>1 个时，自动会变成嵌套的模式。
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      // 如果子路由正好等于一个就会默认将子路由作为根路由显示在侧边栏中
      // 如果路由设置了alwaysShow: true,那么只有一个子节点的跟路由会以一个空白的菜单嵌套一个菜单项出现
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      // 如果是外部网站链接直接返回外链

      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

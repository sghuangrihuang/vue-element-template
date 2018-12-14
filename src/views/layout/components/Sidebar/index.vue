<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar',
      'roles'
    ]),
    routes() {
      const currentRole = this.roles[0]
      const routes = this.$router.options.routes
      const premissRoutes = routes.filter((item) => {
        if (item.meta && item.meta.roles && item.meta.roles.length) {
          return item.meta.roles.indexOf(currentRole) !== -1
        }
        return true
      })
      return premissRoutes
    },
    // 折叠Flag, sidebar关闭则折叠，开启则不折叠。
    isCollapse() {
      // sidebar开关
      return !this.sidebar.opened
    }
  }
}
</script>

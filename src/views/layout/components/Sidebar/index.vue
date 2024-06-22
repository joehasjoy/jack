<!--
 * @Author: your name
 * @Date: 2021-04-14 14:05:01
 * @LastEditTime: 2021-06-30 12:51:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\views\layout\components\Sidebar\index.vue
-->
<template>
  <div class="side-bar-mian" :style="{background:theme.bgColor}">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      :class="{
        'hamburger-container': true,
        'hamburger-container-collapse': isCollapse,
      }"
    />
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      :background-color="theme.bgColor"
      :text-color="theme.commonText"
      :active-text-color="theme.activeText"
    >
      <sidebar-item
        v-for="(route, index) in permission_routers"
        :key="index"
        :item="route"
        :base-path="route.path"
      >
      </sidebar-item>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import Hamburger from "@/components/Hamburger";

export default {
  components: { SidebarItem, Hamburger },
  data() {
    return {};
  },
  props: {
    theme: {
      type: Object,
      default:()=>({}) ,
    },
  },
  computed: {
    ...mapGetters(["permission_routers", "sidebar"]),
    routes() {
      return this.$router.options.routes;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
  },
};
</script>

<style lang="scss" scoped>
.logo {
  height: 80px;
  font-size: 16px;
  background-color: #0780ed;
  font-weight: bold;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  cursor: pointer;
  .logo_img {
    width: auto;
    height: 20px;
  }
  .logo_text {
    margin-left: -40px;
  }
}
.side-bar-mian {
  padding-bottom: 50px;
  box-sizing: border-box;
  margin-top: -13px;
}
.hamburger-container {
  position: absolute;
  left: 0px;
  bottom: 80px;
  z-index: 1;
}
.hamburger-container-collapse {
  transform: rotate(180deg);
}
</style>

<!--
 * @Author: your name
 * @Date: 2021-04-14 14:05:01
 * @LastEditTime: 2021-07-06 16:51:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\views\layout\Layout.vue
-->
<template>
  <div :class="classObj" class="app-wrapper" v-if="!loading">
    <navbar :headerColor="theme.header" />
    <div
      v-if="device === 'mobile' && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <div class="flex">
      <!-- 侧边栏 -->
      <sidebar class="sidebar-container" id="devops_remove1" :theme="theme" />
      <div class="main-container" id="devops_styleChange1">
        <div class="bread-crumb-box">
          <!-- 面包屑 -->
          <breadcrumb />
        </div>
        <div id="app-add"></div>
        <!-- 主题内容 -->
        <app-main> </app-main>
      </div>
    </div>

    <!-- 技术支持  -->
    <el-tooltip placement="left" effect="light">
      <div slot="content" class="ercode">
        <div class="text">在线支持|扫码入群</div>
        <img src="@/assets/ercode.jpg" alt="" class="img">
      </div>
      <div class="help-box">
        <div class="item">
          <i class="el-icon-headset"></i>
        </div>
      </div>
    </el-tooltip>
    
  </div>
</template>
<script>
import { Navbar, Sidebar, AppMain } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import Breadcrumb from "@/components/Breadcrumb";
import { handleColor, theme } from "../../utils/theme.js";

export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Breadcrumb,
  },
  data() {
    return {
      theme: {},
      loading: false,
    };
  },
  mixins: [ResizeMixin],
  created() {
    this.getTheme();
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("CloseSideBar", { withoutAnimation: false });
    },
    getTheme() {
      this.loading = true;
      let url = `${this.GLOBAL.themeapi}/api/v1/theme`;
      this.axios({
        method: "get",
        url,
        headers: { "x-gw-accesskey": this.GLOBAL.themekey },
      })
        .then(async (res) => {
          if (res.status == 200 && res.data.code === "000000") {
            this.theme = res.data.data;
            await handleColor(this.theme);
          } else {
            this.theme = theme;
          }
          this.loading = false;
        })
        .catch((err) => {
          console.log("error", err);
          this.theme = theme;
          this.loading = false;
        });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.bread-crumb-box {
  background: #f4f4f4;
}
.help-box {
  width: 48px;
  min-height: 48px;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0px 2px 15px 0px rgba(0, 0, 0, 0.1);
  position: fixed;
  right: 40px;
  bottom: 150px;
  z-index: 998;
}
.help-box .item {
  margin: 6px;
  width: 36px;
  height: 36px;
  line-height: 36px;
  color: #3d3d3d;
  text-align: center;
  transition: all 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
  position: relative;
  cursor: pointer;
  font-size: 20px;
}
.help-box .el-icon-headset{
  color: $primary;
}
.ercode .img{
  width: 120px;
  height: 120px;
}
.ercode .text{
  text-align: center;
  font-size: 14px;
  color: #333;
}
</style>

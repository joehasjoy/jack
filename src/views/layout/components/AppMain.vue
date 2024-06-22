<!--
 * @Author: your name
 * @Date: 2021-04-14 14:05:01
 * @LastEditTime: 2021-04-15 18:48:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\views\layout\components\AppMain.vue
-->
<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- <router-view :key="key"></router-view> -->
      <router-view> </router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  },
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 55px);
  padding: 0 20px;
  background: #F5F5F6;
  position: relative;
  overflow: hidden;
}
</style>

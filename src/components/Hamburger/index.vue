<template>
  <img
    src="../../assets/img/open-icon.png"
    alt=""
    class="open-icon"
    @click="toggleClick"
  />
</template>

<script>
export default {
  name: "Hamburger",
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    toggleClick: {
      type: Function,
      default: null,
    },
  },
};
</script>

<style scoped>
.open-icon {
  width: 64px;
  height: 48px;
  cursor: pointer;
}
</style>

<template>
  <div class="block flex flex-justify-content-end">
    <!--region 分页-->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleIndexChange"
      :small="small"
      :page-size.sync="pageSize"
      :current-page.sync="currentPage"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="total"
      prev-text="< 上一页"
      next-text="下一页 >"
      :pager-count="5"
    ></el-pagination>
    <!--endregion-->
  </div>
</template>

<script>
export default {
  name: "pagination",
  data() {
    return {
      // tableData: [],
      // currentPage: 0,
      // total: 0,
    };
  },
  props: {
    small: {
      default() {
        return false;
      },
    },
    pageSizes: {
      require: true,
      default() {
        return [5, 10, 25, 50, 100, 200, 500];
      },
    },
    // pageSize:{default: 10},
    // currentPage:{default() { return 1}},
    limit: { default: 10 },
    page: {
      default() {
        return 1;
      },
    },
    total: { default: 0 },
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper",
    },
    background: {
      type: Boolean,
      default: true,
    },
  },
  created: function () {
    // this.currentPage=1;
  },
  computed: {
    currentPage: {
      get() {
        return this.page;
      },
      set(val) {
        this.$emit("update:page", val);
      },
    },
    pageSize: {
      get() {
        return this.limit;
      },
      set(val) {
        this.$emit("update:limit", val);
      },
    },
  },
  methods: {
    handleSizeChange: function (val) {
      // console.log("handleSizeChange:", val, this.page, this.currentPage)
      this.$emit("pagination", { page: this.currentPage, limit: val });
    },
    handleIndexChange: function (val) {
      // console.log("handleIndexChange:", val, this.pageSize)
      this.$emit("pagination", { page: val, limit: this.pageSize });
    },
  },
};
</script>


<style scoped>
.block {
  margin-top: 22px;
}
</style>

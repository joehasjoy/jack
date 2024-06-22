<template>
  <div class="main">
    <el-tabs v-model="activeName">
      <el-tab-pane label="慢查询概览"  name="overview">
        <QuerySlowOverview  @skip-counts-event="skipToCounts"> </QuerySlowOverview>
      </el-tab-pane>
      <el-tab-pane label="慢查询统计" name="count">
        <QuerySlowCount @skip-details-event="skipToDetails" :msg-valcount="datac"></QuerySlowCount>
      </el-tab-pane>
      <el-tab-pane label="慢查询明细" name="details">
        <QuerySlowDetails :msg-val="data"></QuerySlowDetails>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import QuerySlowCount from "./QuerySlowCount";
import QuerySlowDetails from "./QuerySlowDetails";
import QuerySlowOverview from "./QuerySlowOverview";
export default {
  components: {QuerySlowOverview, QuerySlowCount, QuerySlowDetails },
  props: {},
  data() {
    return {
      activeName: "overview",
      data: {},
      datac:{}
    };
  },
  watch: {
    activeName(newVal) {
      if (newVal == "count") {
        this.data = {};
      }
      if (newVal == "overview") {
        this.datac = {};
      }
    }
  },
  computed: {},
  methods: {
    skipToDetails(data) {
      this.activeName = "details";
      this.data = data;
    },
    skipToCounts(data) {
      this.activeName = "count";
      this.datac = data;
    }
  },
  created() {},
  mounted() {
    this.$emit("loading", "11-1-1");
  }
};
</script>
<style scoped>
.main{
  background-color: #f4f4f4;
  box-sizing: border-box;
  height: calc(100% - 80px);
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}
/* 标题栏 */
.top {
  margin-top: 20px;
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 0px;
  overflow: hidden;
}
#title {
  margin-top: 5px;
  margin-bottom: 0px;
  float: left;
  font-weight: bold;
  font-size: 25px;
}
#query {
  margin-left: 30px;
  float: left;
}
#routerFont {
  color: #606266;
  text-decoration: none;
}
.sqlStyle {
  /* max-height: 100px;
  overflow-y: scroll; */
  background: pink;
}
#datacount {
  float: right;
  color: rgb(153, 153, 153);
  font-size: 14px;
  margin-top: -25px;
  margin-right: 10px;
}
.textCenter {
  text-align: center;
}

/* #listTable >>> tr td div {
  max-height: 100px;
  overflow-y: auto;
} */
</style>

<!--
 * @Author: your name
 * @Date: 2021-05-17 16:32:19
 * @LastEditTime: 2021-05-26 18:00:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\views\cicd\app-git-commits.vue
-->
<template>
  <div class="history-main">
    <el-page-header
      @back="goBack"
      :content="'app: ' + appCode + ' |  分支: ' + branch"
    ></el-page-header>
    <div style="margin-top: 20px">
      <el-table
        :data="tableData"
        highlight-current-row
        v-loading="loading"
      >
       <el-table-column
          label="序号"
          type="index"
          width="70"
          align="center"
        ></el-table-column>
        <el-table-column
          label="提交者"
          prop="committerName"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column
          label="Commit Message"
          prop="shortMessage"
          align="left"
        ></el-table-column>
        <el-table-column
          label="CommitId"
          prop="name"
          align="center"
          min-width="90"
        ></el-table-column>
        <el-table-column
          label="提交时间"
          prop="commitTime"
          :formatter="timestampToTime"
          width="160"
          sortable
          align="center"
        ></el-table-column>
<!--        <el-table-column label="操作" width="150" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-link-->
<!--              type="primary"-->
<!--              :underline="false"-->
<!--              @click="goToGitlab(scope.row)"-->
<!--            >-->
<!--              <el-button plain size="mini" type="primary">查看详情</el-button>-->
<!--            </el-link>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/Pagination/pagination";

export default {
  name: "app-git-commits",
  data() {
    return {
      appCode: "",
      gitRepo: "",
      branch: "",
      loading: false,
      tableData: [],
      url: this.GLOBAL.service_tag + "/api/cicd/git-project/commits/",
      total: 0,
      buildNum: 0,
      page: 1,
      limit: 10,
      gitlab_url: "",
      git_project: "",
      since: "",
    };
  },

  methods: {
    timestampToTime(row, column) {
      var timestamp = row[column.property];
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },

    // 获取表格数据；
    InitGetTableData: function () {
      this.loading = true;
      let url = this.GLOBAL.baseUrl + "/pipeline-conf/commit/"+this.appCode+"/"+this.branch;
      this.axios({
        method: "GET",
        url: url,
      })
        .then((response) => {
          console.log("InitGetTableData:", response.data);
          if (response.status == 200) {
            this.tableData = response.data.data;
          } else {
            this.$notify.error(response.data.error);
          }
          this.loading = false;
        })
        .catch((response) => {
          this.loading = false;
          this.$notify.error(String(response));
        });
    },

    // 跳转到对应gitlab变更详情
    goToGitlab: function (row) {
      if (this.gitRepo.startsWith("git@")) {
        this.gitRepo = this.gitRepo.replace("git@", "http://");
      }
      let url = this.gitRepo.replace(".git", "") + "/commit/" + row.name;
      window.open(url, "_blank");
    },

    // 返回上一页
    goBack: function () {
      window.history.back();
    },
  },
  mounted() {
    this.gitRepo = this.common.getUrlKey("gitRepo");
    this.branch = this.common.getUrlKey("branch");
    this.appCode = this.common.getUrlKey("appCode");
    // this.until = this.common.getUrlKey('until');
    this.buildNum = this.common.getUrlKey("buildNum");
    this.InitGetTableData();
  },
  components: {
    // 'table-box': Table,
    pagination: pagination,
  },
};
</script>

<style scoped>
.history-main{
  box-sizing: border-box;
  height: calc(100% - 80px);
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}
</style>

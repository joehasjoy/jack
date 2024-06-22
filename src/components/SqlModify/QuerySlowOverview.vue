<template>
  <div>
    <div class="flex-center-between">
      <!-- from表单 -->
      <el-form
        :inline="true"
        :model="formInline"
        class="form-inline"
        size="small"
      >
        <el-form-item label="时间选择" prop="query_time">
          <el-date-picker
            v-model="formInline.query_time"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            placeholder="选择查询开始时间"
          ></el-date-picker>
        </el-form-item>
        <!--        <el-form-item label="业务负责人:" prop="leader" label-width="90px"  >-->
        <!--          <el-select v-model="formInline.leader" value-key="id" placeholder="业务负责人" style="width:120px" clearable size="small" filterable>-->
        <!--            <el-option-->
        <!--              v-for="(value,key) in leaderlist"-->
        <!--              :key="key"-->
        <!--              :label="key"-->
        <!--              :value="key"-->
        <!--            ></el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="查询时间高于" prop="time" label-width="105px">
          <el-input
            v-model="formInline.exectime"
            placeholder="0S"
            style="width: 70px"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          label="隐藏办公网SQL"
          prop="inner_network"
          label-width="120px"
        >
          <el-switch v-model="formInline.inner_network" active-color="#13ce66">
          </el-switch>
        </el-form-item>
        <el-form-item label="展示忽略SQL" prop="not_deal" label-width="100px">
          <el-switch v-model="formInline.not_deal" active-color="#13ce66">
          </el-switch>
        </el-form-item>
        <!--        <el-form-item >-->
        <!--          <download-excel-->
        <!--            class = "export-excel-wrapper"-->
        <!--            :data = "tableData"-->
        <!--            :fields = "json_fields"-->
        <!--            :name = "fileName">-->
        <!--            <el-button type="primary" size="small" :disabled="exportOpen">导出EXCEL</el-button>-->
        <!--          </download-excel>-->
        <!--        </el-form-item>-->
      </el-form>
      <el-button style="margin-bottom:20px" type="primary" size="small" @click="onSubmit" :loading="queryLoading"
        >查询</el-button
      >
    </div>

    <el-table
      :data="tableData"
      id="listTable"
      stripe
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column
        prop="ClusterIp"
        label="实例名称"
      ></el-table-column>
      <el-table-column
        prop="DbName"
        label="数据库名称"
      ></el-table-column>
      <el-table-column prop="Count" label="慢日志种类" >
        <template slot-scope="scope">
          <el-link
            style="font-size: 12px"
            :underline="true"
            type="primary"
            @click="skipToCounts(scope.row)"
            >{{ scope.row.Count }}</el-link
          >
        </template>
      </el-table-column>
      <el-table-column
        prop="TeamLeader"
        label="业务负责人"
      ></el-table-column>
      <el-table-column
        prop="ProjectName"
        label="项目名称"
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      tableHeight: 450,
      json_fields: {
        实例名称: "ClusterIp", //常规字段
        数据库名称: "DbName", //支持嵌套属性
        慢日志种类: "Count", //支持嵌套属性
        业务负责人: "TeamLeader", //支持嵌套属性
        项目名称: "ProjectName",
      },
      json_meta: [
        [
          {
            " key ": " charset ",
            " value ": " utf- 8 ",
          },
        ],
      ],
      fileName: "",
      queryLoading: false,
      exportOpen: true,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      leaderlist: [],
      formInline: {
        query_time: this.fun_date(),
        leader: "",
        exectime: 1,
        inner_network: true,
        not_deal: false,
      },
      tableData: [],
    };
  },
  watch: {},
  computed: {},
  methods: {
    createFileName() {
      let reg = new RegExp("-", "g");
      this.beginDate = this.formInline.query_time[0]
        .substring(0, 10)
        .replace(reg, "");
      this.endDate = this.formInline.query_time[1]
        .substring(0, 10)
        .replace(reg, "");
      this.fileName =
        "慢SQL概览" +
        this.beginDate +
        "-" +
        this.endDate +
        "(SQL大于" +
        this.formInline.exectime +
        "s).xls";
    },
    skipToCounts(row) {
      let data = {
        ClusterIp: row.ClusterIp,
        DbName: row.DbName,
        TeamLeader: row.TeamLeader,
        exectime: this.formInline.exectime,
        query_time: this.formInline.query_time,
        inner_network: this.formInline.inner_network,
        not_deal: this.formInline.not_deal,
      };
      this.$emit("skip-counts-event", data);
    },

    fun_date() {
      var date = new Date();
      this.month = date.getMonth() + 1;
      this.hour =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      this.minute =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      this.second =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      var endTime =
        date.getFullYear() +
        "-" +
        this.month +
        "-" +
        date.getDate() +
        " " +
        this.hour +
        ":" +
        this.minute +
        ":" +
        this.second;
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      this.beginmonth = start.getMonth() + 1;
      var begintime =
        start.getFullYear() +
        "-" +
        this.beginmonth +
        "-" +
        start.getDate() +
        " " +
        this.hour +
        ":" +
        this.minute +
        ":" +
        this.second;
      return [begintime, endTime];
    },
    axiosGetdomainList() {
      axios
        .get(this.GLOBAL.baseUrl + "/domain/?size=10000")
        .then((response) => {
          this.leaderlist = this.rmSome(
            response.data.data.results,
            "first_admin_name"
          );
        })
        .catch((error) => {
          console.log("axiosGetdomainList:", error);
        });
    },
    rmSome(arr, Fname) {
      let tempObj = {};
      arr.forEach((item) => {
        if (tempObj[item[Fname]]) {
          return;
        } else {
          tempObj[item[Fname]] = item["first_admin_telephone"];
        }
      });
      return tempObj;
    },
    onSubmit() {
      this.exportOpen = true;
      this.axiosLoadQuerySlowCountList();
    },
    axiosLoadQuerySlowCountList() {
      this.createFileName();
      axios
        .post(
          this.GLOBAL.baseUrl + "/middleware/middlewares/dms/sqlSlow/slow",
          {
            min_date: this.formInline.query_time[0],
            max_date: this.formInline.query_time[1],
            inner_network: this.formInline.inner_network,
            not_deal: this.formInline.not_deal,
            exectime: this.formInline.exectime,
            leader: this.formInline.leader,
          }
        )
        .then((response) => {
          this.tableData = response.data.data;
          this.queryLoading = false;
          this.exportOpen = false;
        })
        .catch((error) => {
          this.queryLoading = false;
          this.exportOpen = true;
          console.log("axiosLoadQuerySlowCountList:", error);
        });
    },
  },
  created() {},
  mounted() {
    // this.axiosGetdomainList();
    this.axiosLoadQuerySlowCountList();
    this.$nextTick(function () {
      this.tableHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 50;

      // 监听窗口大小变化
      let self = this;
      window.onresize = function () {
        self.tableHeight =
          window.innerHeight - self.$refs.table.$el.offsetTop - 50;
      };
    });
  },
};
</script>
<style scoped>
#listTable >>> tr td div {
  max-height: 200px;
  overflow-y: auto;
}
</style>

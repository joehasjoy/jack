<template>
  <div>
    <!-- from表单 -->
    <div class="flex-center-between">
      <el-form
        :inline="true"
        :model="formInline"
        class="form-inline"
        size="small"
      >
        <el-form-item label="实例">
          <el-select
            v-model="formInline.hostname_max"
            placeholder="请选择实例"
            @change="changeInstance"
            clearable
            filterable
          >
            <el-option
              v-for="item in instanceList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="数据库">
          <el-select
            v-model="formInline.db_max"
            placeholder="请选择数据库"
            clearable
            filterable
          >
            <el-option
              v-for="item in dbList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="时间选择">
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
        <el-form-item label="查询时间大于（S）">
          <el-input
            v-model="formInline.min_Query_time_max"
            placeholder="大于S"
          ></el-input>
        </el-form-item>
        <el-form-item label="唯一标识">
          <el-input
            v-model="formInline.sqlId"
            placeholder="请输入唯一标识"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        size="small"
        style="margin-bottom: 20px"
        type="primary"
        @click="onSubmit"
        :loading="queryLoading"
        >查询</el-button
      >
    </div>

    <div class="table">
      <el-table
        :data="tableData"
        @sort-change="changeSortTable"
        id="listTable"
        size="small"
        stripe
        style="width: 100%"
        :height="tableHeight"
      >
        <el-table-column
          prop="hostname_max"
          label="实例名称"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="client_max"
          label="客户端ip"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="user_max"
          label="用户名称"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="db_max"
          label="数据库名称"
          width="90"
        ></el-table-column>
        <el-table-column prop="sample" label="sql语句"></el-table-column>
        <!--<el-table-column prop="ts_cnt" label="执行次数" sortable="custom" width="100"></el-table-column>-->
        <el-table-column
          prop="query_time_max"
          label="请求时间(ms)"
          sortable="custom"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ Math.round(scope.row.query_time_max * 1000) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rows_sent_max"
          label="返回行数"
          sortable="custom"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="rows_examined_max"
          label="解析行数"
          sortable="custom"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="ts_max"
          label="执行时间"
          width="100"
        ></el-table-column>
        <el-table-column label="操作" width="120">
<!--          <template slot-scope="scope">-->
<!--            <el-button type="primary" @click="getAdvise(scope.row)" size="mini">-->
<!--              获取优化建议-->
<!--            </el-button>-->
<!--          </template>-->
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="textCenter" v-show="pagination.dataCount">
      <el-pagination
        @current-change="changePage"
        layout="prev, pager, next"
        :total="pagination.dataCount"
        :current-page="pagination.now"
      ></el-pagination>
      <p id="datacount">{{ "共 " + pagination.dataCount + " 条" }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  components: {},
  props: ["msgVal"],
  data() {
    return {
      tableHeight: 350,
      queryLoading: false,
      instanceList: [],
      dbList: [],
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
      formInline: {
        sqlId: "",
        hostname_max: "",
        db_max: "",
        query_time: [],
        min_Query_time_max: "",
      },
      queryData: {
        hostname_max: "",
        db_max: "",
        order: "",
        sqlId: "",
        min_date: "",
        max_date: "",
        min_Query_time_max: "",
      },
      tableData: [],
      // 分页数据
      pagination: {
        now: 1,
        dataCount: 0,
      },
    };
  },
  watch: {
    // 从统计部分传递到父组件的sqlId，然后通过父组件传递到明细部分。当xin
    msgVal(newVal) {
      if (newVal != "") {
        console.log("watch sqlId&hostName:", newVal);
        if (
          newVal.SQLId != null &&
          newVal.SQLId != "" &&
          newVal.SQLId != undefined
        ) {
          this.tableData = [];
          this.formInline.sqlId = newVal.SQLId;
          this.formInline.min_Query_time_max = newVal.exectime;
          this.formInline.query_time = newVal.query_time;
          this.onSubmit();
        }
      }
    },
  },
  computed: {},
  methods: {
    getAdvise(row) {
      this.$router.push({
        name: "QueryOptimize",
        params: {
          dbinstance: row.hostname_max.split("(")[0],
          dbname: row.db_max,
          sql: row.sample,
        },
      });
    },
    changeInstance(instance) {
      this.dbList.length = 0;
      this.formInline.db_max = "";
      console.log("changeInstance:", instance);
      this.axiosGetDBList(instance);
    },
    changeSortTable(column) {
      if (column.order == "ascending") {
        this.queryData.order = column.prop;
      }
      if (column.order == "descending") {
        this.queryData.order = "-" + column.prop;
      }
      if (column.order == "" || column.order == null) {
        this.queryData.order = "";
      }
      console.log("changeSortTable:", this.queryData.order);
      this.axiosLoadQuerySlowDetailsList();
    },

    onSubmit() {
      this.queryLoading = true;
      this.queryData.sqlId = this.formInline.sqlId;
      this.queryData.hostname_max = this.formInline.hostname_max;
      this.queryData.db_max = this.formInline.db_max;
      if (
        this.formInline.query_time != null &&
        this.formInline.query_time != "" &&
        this.formInline.query_time != undefined
      ) {
        this.queryData.min_date = this.formInline.query_time[0];
        this.queryData.max_date = this.formInline.query_time[1];
      } else {
        this.queryData.min_date = "";
        this.queryData.max_date = "";
      }
      // 持续时间参数赋值
      this.queryData.min_Query_time_max = this.formInline.min_Query_time_max;
      this.axiosLoadQuerySlowDetailsList();
    },
    //  分页操作
    changePage(num) {
      console.log("change Page :" + num);
      this.pagination.now = num;
      this.axiosLoadQuerySlowDetailsList();
    },
    axiosLoadQuerySlowDetailsList() {
      axios
        .post(
          this.GLOBAL.baseUrl + "/middleware/middlewares/dms/sqlSlow/detail",
          {
            p: this.pagination.now,
            ordering: this.queryData.order,
            checksum: this.queryData.sqlId,
            hostname_max: this.queryData.hostname_max,
            db_max: this.queryData.db_max,
            min_date: this.queryData.min_date,
            max_date: this.queryData.max_date,
            min_Query_time_max: this.queryData.min_Query_time_max,
          }
        )
        .then((response) => {
          this.pagination.dataCount = response.data.data.count;
          this.tableData = response.data.data.results;
          this.queryLoading = false;
        })
        .catch((error) => {
          this.queryLoading = false;
          console.log("axiosLoadQuerySlowDetailsList:", error);
        });
    },
    //获取数据库ip
    getMiddlewares: function () {
      let middlewareUrl =
        this.GLOBAL.baseUrl + "/middleware/option/middlewares/node";
      this.axios({
        method: "get",
        url: middlewareUrl,
        params: {},
      })
        .then((response) => {
          if ((response.code = 200)) {
            if (response.data.data != null) {
              response.data.data.forEach((element) => {
                this.instanceList.push({
                  value: element.selectKey,
                  label: element.selectValue,
                });
              });
            }
          } else {
            this.$message({
              type: "error",
              message: "获取数据失败",
            });
          }
        })
        .catch((response) => {
          console.log("fail to get account config info", response);
        });
    },
    axiosGetDBList(instance) {
      let middlewareUrl =
        this.GLOBAL.baseUrl + "/middleware/middlewares/" + instance.split("(")[0];
      this.axios({
        method: "get",
        url: middlewareUrl,
        params: {},
      })
        .then((response) => {
          if ((response.code = 200)) {
            if (response.data.data != null) {
              response.data.data.forEach((element) => {
                this.dbList.push({
                  value: element.DbName,
                  label: element.DbName,
                });
              });
            }
          } else {
            this.$message({
              type: "error",
              message: "获取数据失败",
            });
          }
        })
        .catch((response) => {
          console.log("fail to get account config info", response);
        });
    },
  },
  created() {},
  mounted() {
    this.getMiddlewares();
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
#listTable >>> tr td div {
  max-height: 100px;
  overflow-y: auto;
}
</style>

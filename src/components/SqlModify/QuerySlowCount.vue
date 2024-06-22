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
        <!--        <el-form-item label="业务负责人" prop="leader" label-width="90px"  >-->
        <!--          <el-select v-model="formInline.leader" value-key="id" placeholder="业务负责人" style="width:120px" clearable size="small" filterable>-->
        <!--            <el-option-->
        <!--              v-for="(value,key) in leaderlist"-->
        <!--              :key="key"-->
        <!--              :label="key"-->
        <!--              :value="value"-->
        <!--            ></el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="唯一标识">
          <el-input
            v-model="formInline.sqlid"
            placeholder="请输入唯一标识"
          ></el-input>
        </el-form-item>
        <el-form-item label="查询时间高于" prop="exectime" label-width="105px">
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
        <!-- <el-form-item> -->
        <!--          <download-excel-->
        <!--            class = "export-excel-wrapper"-->
        <!--            :fetch = "axiosExportQuerySlowReportDetail"-->
        <!--            :fields = "json_fields"-->
        <!--            :name = "fileName">-->
        <!--            <el-button type="primary" size="small" :loading="exportLoading" :disabled="exportDis">导出EXCEL</el-button>-->
        <!--          </download-excel>-->
        <!-- </el-form-item> -->
      </el-form>

      <el-button
        style="margin-bottom: 20px"
        type="primary"
        size="small"
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
        <el-table-column type="expand" width="40">
          <template slot-scope="props">
            <EchartsLine
              style="height: 200px"
              v-if="props.row.rows.length != 0"
              :ecData="props.row.rows"
            ></EchartsLine>
            <span v-else>暂无数据</span>
          </template>
        </el-table-column>
        <el-table-column prop="SQLId" label="唯一标识" width="150">
          <template slot-scope="scope">
            <el-link
              style="font-size: 12px"
              :underline="true"
              type="primary"
              @click="skipToDetails(scope.row.SQLId)"
              >{{ scope.row.SQLId }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="HostName"
          label="实例名称"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="DBName"
          label="数据库名称"
          hidden="hidden"
          width="90"
        ></el-table-column>
        <el-table-column prop="SQLText" label="sql语句"> </el-table-column>
        <el-table-column
          prop="MySQLTotalExecutionCounts"
          label="执行次数"
          sortable="custom"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="QueryTimeAvg"
          sortable="custom"
          label="平均执行时长(ms)"
          width="160"
        >
          <template slot-scope="scope">
            <span>{{ Math.round(scope.row.QueryTimeAvg * 1000) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="CreateTime"
          label="最后执行时间"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="ReviewedBy"
          label="操作人"
          width="80"
          v-if="this.ignoreVisible"
        >
        </el-table-column>
        <el-table-column
          prop="ReviewedOn"
          label="操作时间"
          sortable="custom"
          width="80"
          v-if="this.ignoreVisible"
        >
        </el-table-column>
        <el-table-column
          prop="Comments"
          label="忽略原因"
          width="120"
          v-if="this.ignoreVisible"
        >
        </el-table-column>
        <el-table-column prop="Status" label="操作" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.Status == 1">
              <el-button type="info" v-show="isQaUser" disabled size="mini">
                已忽略
              </el-button>
            </span>
            <span v-if="scope.row.Status == 0">
              <el-button
                type="danger"
                v-show="isQaUser"
                @click="handleChangeStatus(scope.row)"
                size="mini"
              >
                忽略
              </el-button>
            </span>
          </template>
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

    <el-dialog :visible.sync="dialogFormVisible" width="600px" :title="'唯一标识:' + formC.sqlid">
      <!-- <h5 slot="title">
        唯一标识:<span style="color: #ff0000">{{ formC.sqlid }}</span>
      </h5> -->
      <el-form
        :model="formC"
        label-position="left"
        :rules="rulesC"
        ref="formC"
        label-width="120px"
      >
        <el-form-item label="忽略原因：" prop="comment">
          <el-input
            v-model="formC.comment"
            size="medium"
            type="textarea"
            style="width: 80%"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          v-bind:loading="submitC"
          @click="submitFormC('formC')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import EchartsLine from "../echarts/QuerySlowLine";
export default {
  components: {
    EchartsLine,
  },
  props: ["msgValcount"],
  data() {
    return {
      tableHeight: 350,
      json_fields: {
        唯一标识: "Checksum",
        实例名称: "ClusterIp", //常规字段
        数据库名称: "DbName", //支持嵌套属性
        业务负责人: "TeamLeader", //支持嵌套属性
        项目名称: "ProjectName", //支持嵌套属性
        执行次数: "Count", //支持嵌套属性
        模板: "Fingerprint", //支持嵌套属性
        具体SQL: "Sample", //支持嵌套属性
        操作人: "ReviewedBy",
        操作时间: "ReviewedOn",
        忽略原因: "Comments",
      },
      json_meta: [
        [
          {
            " key ": " charset ",
            " value ": " utf- 8 ",
          },
        ],
      ],
      ignoreVisible: false,
      dialogFormVisible: false,
      exportDis: true,
      queryLoading: false,
      exportLoading: false,
      submitC: false,
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
      leaderlist: [],
      formC: {
        sqlid: "",
        comment: "",
        row: "",
      },
      formInline: {
        hostname_max: "",
        db_max: "",
        query_time: this.fun_date(),
        leader: "",
        exectime: 1,
        inner_network: true,
        not_deal: false,
        sqlid: "",
      },
      queryData: {
        hostname_max: "",
        db_max: "",
        order: "",
        min_date: "",
        max_date: "",
        leader: "",
        exectime: 1,
        inner_network: true,
        not_deal: false,
        sqlid: "",
      },
      tableData: [],
      isQaUser: false,
      fileName: "",
      exportData: [],
      // 分页数据
      pagination: {
        now: 1,
        dataCount: 0,
      },

      rulesC: {
        comment: [
          { required: true, message: "请输入忽略原因", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    msgValcount(newVal) {
      if (newVal != "") {
        console.log("watch leader:", newVal);
        if (
          newVal.ClusterIp != null &&
          newVal.ClusterIp != "" &&
          newVal.ClusterIp != undefined
        ) {
          this.tableData = [];
          (this.formInline.hostname_max = newVal.ClusterIp),
            (this.formInline.db_max = newVal.DbName),
            (this.formInline.leader = this.leaderlist[newVal.TeamLeader]),
            (this.formInline.exectime = newVal.exectime),
            (this.formInline.query_time = newVal.query_time),
            (this.formInline.inner_network = newVal.inner_network),
            (this.formInline.not_deal = newVal.not_deal),
            this.onSubmit();
        }
      }
    },
  },
  computed: {},
  methods: {
    show() {
      if (this.$root.isQaUser == "True") {
        this.isQaUser = true;
      }
    },
    createFileName() {
      let reg = new RegExp("-", "g");
      this.beginDate = this.formInline.query_time[0]
        .substring(0, 10)
        .replace(reg, "");
      this.endDate = this.formInline.query_time[1]
        .substring(0, 10)
        .replace(reg, "");
      this.fileName =
        "慢SQL统计详情" +
        this.beginDate +
        "-" +
        this.endDate +
        "(SQL大于" +
        this.formInline.exectime +
        "s).xls";
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
      this.axiosLoadQuerySlowCountList();
    },
    onSubmit() {
      this.queryLoading = true;
      this.exportDis = true;
      this.queryData.hostname_max = this.formInline.hostname_max;
      this.queryData.db_max = this.formInline.db_max;
      this.queryData.leader = this.formInline.leader;
      this.queryData.exectime = this.formInline.exectime;
      this.queryData.inner_network = this.formInline.inner_network;
      this.queryData.not_deal = this.formInline.not_deal;
      this.queryData.sqlid = this.formInline.sqlid;
      this.pagination.now = 1;
      this.axiosLoadQuerySlowCountList();
    },
    skipToDetails(SQLId) {
      let data = {
        SQLId: SQLId,
        exectime: this.formInline.exectime,
        query_time: this.formInline.query_time,
      };
      this.$emit("skip-details-event", data);
    },
    //  分页操作
    changePage(num) {
      console.log("change Page :" + num);
      this.pagination.now = num;
      this.axiosLoadQuerySlowCountList();
    },
    axiosLoadQuerySlowCountList() {
      this.createFileName();
      this.show();
      axios
        .post(
          this.GLOBAL.baseUrl + "/middleware/middlewares/dms/sqlSlow/count",
          {
            p: this.pagination.now,
            hostname_max: this.queryData.hostname_max,
            ordering: this.queryData.order,
            db_max: this.queryData.db_max,
            exectime: this.queryData.exectime,
            min_date: this.formInline.query_time[0],
            max_date: this.formInline.query_time[1],
            leader: this.queryData.leader,
            inner_network: this.queryData.inner_network,
            not_deal: this.queryData.not_deal,
            SQLId: this.queryData.sqlid,
          }
        )
        .then((response) => {
          console.log("axiosLoadQuerySlowCountList:", response);
          this.pagination.dataCount = response.data.data.count;
          this.tableData = response.data.data.results;
          this.queryLoading = false;
          this.exportDis = false;
          if (this.queryData.not_deal) {
            this.ignoreVisible = true;
          } else {
            this.ignoreVisible = false;
          }
        })
        .catch((error) => {
          this.queryLoading = false;
          this.exportDis = true;
          console.log("axiosLoadQuerySlowCountList:", error);
        });
    },
    async axiosExportQuerySlowReportDetail() {
      this.createFileName();
      this.exportLoading = true;
      this.queryLoading = true;
      const response = await axios.get(
        this.GLOBAL.cmdbUrl + "/mysql_slowlog_reportdetail/",
        {
          params: {
            hostname_max: this.queryData.hostname_max,
            db_max: this.queryData.db_max,
            exectime: this.queryData.exectime,
            min_date: this.formInline.query_time[0],
            max_date: this.formInline.query_time[1],
            leader: this.queryData.leader,
            inner_network: this.queryData.inner_network,
            not_deal: this.queryData.not_deal,
          },
        }
      );
      console.log(response);
      this.exportLoading = false;
      this.queryLoading = false;
      return response.data.data;
    },
    // axiosGetdomainList() {
    //   axios
    //     .get(this.GLOBAL.cmdbUrl + "/domain/?size=10000")
    //     .then(response => {
    //       this.leaderlist = this.rmSome(response.data.data.results,"first_admin_name");
    //     })
    //     .catch(error => {
    //       console.log("axiosGetdomainList:", error);
    //     });
    // },
    handleChangeStatus(row) {
      this.dialogFormVisible = true;
      this.formC.sqlid = row.SQLId;
      this.formC.row = row;
    },
    submitFormC(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let body = {
            SQLId: this.formC.sqlid,
            comment: this.formC.comment,
          };
          axios
            .put(this.GLOBAL.cmdbUrl + "/mysql_slow_statics/", body)
            .then((response) => {
              if (response.data.code != "200") {
                alert(response.data.msg);
              } else {
                this.formC.row.Status = 1;
                this.dialogFormVisible = false;
              }
            })
            .catch((error) => {
              console.log("submit formC fail:", error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    rmSome(arr, Fname) {
      let tempObj = {};
      arr.forEach((item) => {
        if (tempObj[item[Fname]]) {
          return;
        } else {
          tempObj[item[Fname]] = item["first_admin"];
        }
      });
      // console.log(tempObj)
      return tempObj;
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
.dialog-footer{
  text-align: center;
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

#listTable >>> tr td div {
  max-height: 200px;
  overflow-y: auto;
}

.linkSkip {
  color: #606266;
}
</style>

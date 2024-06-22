<!--
 * @Author: your name
 * @Date: 2021-04-19 09:12:39
 * @LastEditTime: 2021-06-18 10:03:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pass-frontend\src\views\ams\team.vue
-->
<template>
  <div class="main flex-column">
    <el-form
      :inline="true"
      :model="formSearch"
      class="demo-form-inline"
      @submit.native.prevent
      label-position="left"
    >
      <el-form-item label="名称:">
        <el-input
          v-model="clusterName"
          placeholder="请输入名称."
          @keyup.enter.native="getData"
        ></el-input>
      </el-form-item>
      <el-form-item label="IP:">
        <el-input
          v-model="clusterIp"
          placeholder="请输入IP地址:"
          @keyup.enter.native="getData"
        ></el-input>
      </el-form-item>
      <el-form-item label="项目负责人:">
        <el-select
          v-model="ownerNameLabel"
          filterable
          remote
          reserve-keyword
          placeholder="请输入关键词"
          :remote-method="getTenantMembersByKeyword"
          clearable
          @change="clearDomainMemberOptions"
          @focus="clearDomainMemberOptions"
        >
          <el-option
            v-for="item in domainMemberOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="环境:">
        <el-select
          v-model="envId"
          placeholder="请选择环境"
          @change="envCodeSelectOptionChange"
          clearable
        >
          <el-option
            v-for="item in envOptions"
            :key="item.envId"
            :label="item.label"
            :value="item.envId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型:">
        <el-select
          v-model="clusterType"
          placeholder="请选择类型"
          @change="envCodeSelectOptionChange"
          clearable
          style="width: 200px"
        >
          <el-option
            v-for="item in clusterTypeOptions"
            :key="item.clusterTypeName"
            :label="item.label"
            :value="item.clusterTypeName"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataSelectCondition"
          >查询
        </el-button>
        <el-button @click="resetForms">重置 </el-button>
        <!-- <el-button
                  @click="applysource"
                  type="primary"
                  icon="el-icon-s-check"
                  style="float: right; margin-left: 15px"
                  >申请资源</el-button
                > -->
        <!--<el-button style="float: right" @click="sqlConfirmClick" type="primary" icon="el-icon-plus">发起SQL变更</el-button>-->
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 20px">
      <el-button icon="el-icon-plus" @click="openMiddleware()"
        >添加中间件</el-button
      >
    </div>
    <div class="table-box">
      <el-table
        ref="singleTable"
        :data="tableData.slice(0, pageSize)"
        stripe
        v-loading="dataLoding"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="名称">
                <span>{{ props.row.clusterName }}</span>
              </el-form-item>
              <el-form-item label="类型">
                <span>{{ props.row.clusterType }}</span>
              </el-form-item>
              <el-form-item label="版本">
                <span>{{ props.row.clusterVersion }}</span>
              </el-form-item>
              <el-form-item label="环境">
                <span>{{ props.row.envName }}</span>
              </el-form-item>
              <el-form-item label="集群IP">
                <span>{{ props.row.clusterIp }}</span>
              </el-form-item>
              <el-form-item label="网络类型">
                <span>{{ props.row.networkType }}</span>
              </el-form-item>
              <el-form-item label="用途">
                <span>{{ props.row.clusterUsages }}</span>
              </el-form-item>
              <el-form-item label="租户Id">
                <span>{{ props.row.tenantId }}</span>
              </el-form-item>
              <el-form-item label="负责人">
                <span>{{ props.row.ownerName }}</span>
              </el-form-item>
              <el-form-item label="标记">
                <span>{{ props.row.marks }}</span>
              </el-form-item>
	            <el-form-item label="是否核心">
                <span>{{ props.row.isCore === 1 ?'是': props.row.isCore === 2 ? '否' : '-' }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <!-- <el-table-column type="index" width="40"></el-table-column> -->
        <el-table-column
          prop="clusterType"
          label="类型"
          align="center"
          width="auto"
          sortable
        ></el-table-column>

        <el-table-column
          prop="clusterName"
          label="名称"
          align="left"
          width="auto"
        ></el-table-column>
        
         <el-table-column
          prop="clusterIp"
          label="集群IP"
          align="center"
          width="auto"
        ></el-table-column>

         <el-table-column
          prop="ownerName"
          label="负责人"
          align="center"
          width="auto"
          sortable
        >
        </el-table-column>

         <el-table-column
          prop="envName"
          label="环境"
          align="center"
          width="auto"
          sortable
        ></el-table-column>
        
        <el-table-column
          prop="clusterVersion"
          label="版本"
          align="center"
          width="auto"
        ></el-table-column>
        
        <el-table-column
          prop="clusterUsages"
          label="用途"
          align="center"
          width="auto"
        ></el-table-column>
       
       <el-table-column
          prop="networkType"
          label="网络类型"
          align="center"
          width="auto"
          sortable
        ></el-table-column>

        <el-table-column label="操作" align="center" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="modifyMiddle(scope.row)"
              >修改</el-button
            >
            <el-button
              type="primary"
              plain
              size="mini"
              @click="nodeSetting(scope.row)"
              >节点配置</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      v-show="totalCount > 0"
      :total="totalCount"
      :page.sync="currentPage"
      :limit.sync="pageSize"
      @pagination="loadData"
    ></pagination>

    <!-- <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 15, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    >
    </el-pagination> -->

    <!-- 中间件弹框 -->
    <middle-dialog
      :visible="addMiddlewareVisible"
      @closeHandle="closeHandle"
      :type="middleType"
      @sureHandle="getData()"
      :form="middleDetail"
      :clusterTypeOptions="clusterTypeOptions"
    ></middle-dialog>
    <el-dialog
      title="请选择资源类型"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-checkbox-group v-model="checkedSource" :max="1">
        <el-checkbox v-for="souce in sources" :label="souce" :key="souce">{{
          souce
        }}</el-checkbox>
      </el-checkbox-group>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitApplySource">提 交</el-button>
      </span>
    </el-dialog>

    <!-- 中间件主从节点设置弹框 -->
    <node-dialog ref="nodeDialog" :visible="nodeDialogVisble" :middleId="middleId" @closeHandle="nodeCloseHandle"></node-dialog>

    <el-dialog
      title="SQL变更申请"
      :visible.sync="sqlConfirmVisible"
      width="55%"
      height="100%"
    >
      <iframe
        :src="sqlConfirmURL"
        frameborder="0"
        width="100%"
        height="300px"
      ></iframe>
      <div slot="footer" class="dialog-footer">
        <el-button @click="sqlConfirmVisible = false" type="primary"
          >关 闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MiddleDialog from "./components/middleDialog.vue";
import pagination from "@/components/Pagination/pagination";
import NodeDialog from './components/nodeDialog.vue'
import { deleteMiddleApi } from "../../api/api";

export default {
  components: { pagination, MiddleDialog,NodeDialog },
  data() {
    return {
      nodeDialogVisble: false,
      middleType: "",
      middleId: -1,
      middleDetail: {
        clusterName: "",
        clusterIp: "",
        clusterType: "",
        clusterVersion: "",
        environment: "",
        networkType: "",
        clusterUsages: "",
        marks: "",
        ownerId: "",
      },
      dialogVisible: false,
      checkedSource: [],
      sources: ["Mysql", "Redis"],
      dataLoding: false,
      formSearch: {},
      // 数据
      tableData: [],
      // 默认显示第几页
      currentPage: 1,
      // 默认每页显示的条数
      pageSize: 10,
      // 默认总条数
      totalCount: 0,
      dialogFormVisible: false,
      tabledataid: "",
      clusterName: "",
      clusterType: "",
      environment: "",
      clusterIp: "",
      ownerId: "",
      ownerNameLabel: "",
      options: [],
      envOptions: [],
      envId: "",
      clusterTypeOptions: [],
      domainMemberOptions: [],
      addMiddlewareVisible: false,
      tenantMemberOptions: [],
      form: {
        clusterName: "",
        clusterIp: "",
        clusterType: "",
        clusterVersion: "",
        environment: "",
        networkType: "",
        clusterUsages: "",
        marks: "",
        ownerId: "",
      },
      insertClusterTypeOptions: [{ label: "MySql", value: "MySql" }],
      sqlConfirmURL: "",
      sqlConfirmVisible: false,
      // 校验规则
      rules: {
        clusterName: [
          { required: true, message: "请输入集群名称", trigger: "blur" },
        ],
        clusterIp: [
          { required: true, message: "请输入集群集群IP", trigger: "blur" },
        ],
        clusterType: [
          { required: true, message: "请输入集群类型", trigger: "blur" },
        ],
        clusterVersion: [
          { required: true, message: "请选择版本", trigger: "blur" },
        ],
        environment: [
          { required: true, message: "请选择环境", trigger: "blur" },
        ],
        clusterUsages: [
          { required: true, message: "请输入用途", trigger: "blur" },
        ],
        ownerId: [{ required: true, message: "请选择负责人", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 关闭
    closeHandle() {
      this.middleDetail = {
        clusterName: "",
        clusterIp: "",
        clusterType: "",
        clusterVersion: "",
        environment: "",
        networkType: "",
        clusterUsages: "",
        marks: "",
        ownerId: "",
      };
      this.addMiddlewareVisible = false;
    },
    // 修改
    modifyMiddle(row) {
			this.$router.push({
				path:'editMiddleware',
				query: {
					id: row.id,
				},
			})
     /* this.middleDetail = JSON.parse(JSON.stringify(row))
      this.middleType = "修改";
      this.addMiddlewareVisible = true;*/
    },
    // 主从
    nodeSetting(row) {
      this.nodeDialogVisble = true
      this.middleId = row.id
    },
    nodeCloseHandle() {
      this.nodeDialogVisble = false
      this.getData()
    },
    envCodeSelectOptionChange(va) {},
    getData() {
      let url = this.GLOBAL.baseUrl + "/middleware/list/condition";
      this.dataLoding = true;
      this.axios({
        method: "post",
        url: url,
        data: {
          pageNumber: this.currentPage,
          pageSize: this.pageSize,
          clusterName: this.clusterName,
          clusterType: this.clusterType,
          environment: this.envId,
          clusterIp: this.clusterIp,
          ownerId: this.ownerId,
        },
      })
        .then((res) => {
          this.dataLoding = false;
          if (res.status === 200) {
            if (res.data.code === 500) {
              this.$alert(res.data.message, "提示", {
                type: "warning",
              });
            } else {
              if (res.data.data != null) {
                this.tableData = res.data.data.list;
                this.totalCount = res.data.data.total;
              } else {
                this.tableData = [];
                this.totalCount = 0;
              }
            }
          } else {
            this.tableData = [];
            this.totalCount = 0;
          }
        })
        .catch((err) => {
          this.dataLoding = false;
          console.log(err);
        });
    },
    getDataSelectCondition() {
      this.currentPage = 1;
      this.getData();
    },

    handleChangeOwner(params) {
      const { value, label } = params;
      this.ownerNameLabel = label;
      this.ownerId = value;
    },

    resetForms() {
      this.currentPage = 1;
      this.clusterName = "";
      this.clusterType = "";
      this.envId = "";
      this.clusterIp = "";
      this.ownerId = "";
      this.ownerNameLabel = "";
      this.getData();
    },

    getSelectData() {
      let url = this.GLOBAL.baseUrl + "/middleware/init/condition";
      this.axios({
        method: "get",
        url: url,
      })
        .then((res) => {
          if (res.status === 200) {
            // console.log("res.data.data.teamList"+res.data.data.teamList)
            //类型下拉列表
            res.data.data.clusterTypeList.forEach((element) => {
              this.clusterTypeOptions.push({
                clusterTypeName: element.selectKey,
                label: element.selectValue,
              });
            });
            //环境下拉列表
            res.data.data.envList.forEach((element) => {
              this.envOptions.push({
                envId: element.selectKey,
                label: element.selectValue,
              });
            });
          }
        })
        .catch((err) => {});
    },

    // 翻页
    loadData(e) {
      this.currentPage = e.page;
      this.pageSize = e.limit;
      this.getData();
    },
    openMiddleware() {
			this.$router.push('addMiddleware')
      /*this.middleType = "添加";
      this.addMiddlewareVisible = true;*/
    },

    //获取租户成员
    getTenantMembersOptions() {
      console.log("getTenantMembersOptions()");
      let url = this.GLOBAL.baseUrl + "/user/select/getTenantMembers";
      this.axios({
        method: "GET",
        url: url,
      })
        .then((res) => {
          if (res.status === 200) {
            //所属业务域下拉列表
            res.data.data.tenantMemberOptions.forEach((element) => {
              this.tenantMemberOptions.push({
                key: element.selectKey,
                value: element.selectValue,
              });
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //添加中间件提交
    submitAddMiddleware() {
      this.$refs.addMiddlewareForm.validate(async (valid) => {
        if (valid) {
          // 在这里拆分ip和端口
          // this.form.clusterIpPort = ''
          // this.form.clusterIp = ''
          let url = this.GLOBAL.baseUrl + "/middleware/save";
          this.axios({
            method: "POST",
            url: url,
            data: JSON.stringify(this.form),
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
          })
            .then((res) => {
              if (res.data.code === 200) {
                this.$alert("操作成功", "提示", {
                  type: "warning",
                });
                this.$refs.addMiddlewareForm.resetFields();
              } else {
                this.$alert(res.data.message, "提示", {
                  type: "warning",
                });
              }
            })
            .catch((err) => {
              alert(err);
            });
        }
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    //申请资源
    applysource() {
      this.dialogVisible = true;
    },
    submitApplySource() {
      if (this.checkedSource.length == 0) {
        this.$message({
          showClose: true,
          message: "请先选择需要申请的资源之后再提交",
          type: "warning",
        });
        return;
      }
      this.dialogVisible = false;
      var applyKey = "";
      if (this.checkedSource[0] === "Mysql") {
        applyKey = "dbApply_com";
      }
      if (this.checkedSource[0] === "Redis") {
        applyKey = "redisApply";
      }
      this.$router.push(
        "/taskCenter#/zh-CN/personTasks/initiate/detail?appName=multiTenant" +
          "&processKey=" +
          applyKey +
          "&processName=" +
          applyKey +
          "&current=1"
      );
    },

    //关键字搜索租户成员
    getTenantMembersByKeyword(keyword) {
      this.domainMemberOptions = [];
      let url = this.GLOBAL.baseUrl + "/user/tenant-member/" + keyword;
      this.axios({
        method: "get",
        url: url,
      })
        .then((res) => {
          if (res.status === 200) {
            res.data.data.forEach((element) => {
              this.domainMemberOptions.push({
                value: element.selectKey,
                label: element.selectValue,
              });
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //清空关键字搜索租户成员结果
    clearDomainMemberOptions() {
      this.domainMemberOptions = [];
    },
    //跳转新增页面
    sqlConfirmClick: function () {
      this.sqlConfirmVisible = true;
      //this.sqlConfirmURL = this.GLOBAL.taskCenter + '/taskCenter#/zh-CN/personTasks/initiate/detail?appName=appAply&processKey=sqlConfirm&processName=sqlConfirm&current=1'
      this.sqlConfirmURL =
        this.GLOBAL.taskCenter +
        "/taskCenter#/zh-CN/personTasks/initiate/detail?appName=multiTenant&processKey=sqlConfirmSimple_com&processName=sqlConfirmSimple_com&current=1";
    },
  },
  created: function () {
    this.getData();
    this.getSelectData();
    // this.getSelectRespPersonData();
    this.getTenantMembersOptions();
  },
};
</script>
<style scoped>
.main {
  background-color: #f4f4f4;
  box-sizing: border-box;
  height: calc(100% - 80px);
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}
.main .table-box {
  flex: 1;
  overflow-y: auto;
}
.demo-form-inline {
  display: flex;
  flex-wrap: wrap;
}
.demo-form-inline .el-form-item {
  margin-right: 30px;
}
.block {
  display: flex;
  justify-content: flex-end;
  margin: 26px 0;
}
.dialog-footer {
  display: flex;
  justify-content: center;
  margin-top: -20px;
  margin-bottom: 10px;
}
</style>

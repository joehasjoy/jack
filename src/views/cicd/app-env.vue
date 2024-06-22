<template>
  <div class="main flex-column">
    <div class="back-box flex flex-align-items-center" @click="goBack">
      <i class="el-icon-arrow-left"></i>
      {{ appCode }}
    </div>
    <div class="panel-tab">
      <el-tabs v-model="activeConfigName" @tab-click="handleClickChangeConfig">
        <el-tab-pane
          :label="envItem"
          :name="envItem"
          v-for="(envItem, index) in envs"
          :key="index"
        >
          <el-collapse
            :accordion="true"
            v-model="collapseTab"
            @change="handleChangeCollase"
          >
            <el-collapse-item name="config">
              <template slot="title">
                配置信息<i class="header-icon el-icon-s-tools"></i>
              </template>
              <el-button
                @click="addEnv"
                type="text"
                icon="el-icon-plus"
                class="btn-box"
                >新增变量</el-button
              >
              <div class="env-list">
                <div
                  class="list-item flex-wrap"
                  v-for="(item, index) in envValues"
                  :key="index"
                >
                  <div class="row key-row flex flex-align-items-center">
                    <div class="label">参数</div>
                    <el-input
                      class="my-input"
                      v-model="item.key"
                      clearable
                      :disabled="item.defaultDisabled"
                      placeholder="请输入参数"
                      @input="inputChange(item,index)"
                    ></el-input>
                  </div>
                  <div class="row flex flex-align-items-center">
                    <div class="label">默认值</div>
                    <el-input
                      class="my-input"
                      v-model="item.value"
                      :placeholder="item.placeholder || '请输入值'"
                      clearable
                      :disabled="item.defaultDisabled || item.disabled"
                    ></el-input>
                    <el-tooltip content="删除" position="top" v-if="!envDisabled(item)">
                      <el-link
                        type="danger"
                        :underline="false"
                        @click="deleteEnv(item)"
                        ><i class="el-icon-delete"></i
                      ></el-link>
                    </el-tooltip>
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="change" style="border: none">
              <template slot="title">
                更改记录<i class="header-icon el-icon-edit-outline"></i>
              </template>
              <div class="table-box">
                <el-table :data="historyList" style="width: 100%">
                  <el-table-column type="index" width="50" label="序号"> </el-table-column>
                  <el-table-column prop="envKey" label="参数名">
                  </el-table-column>
                  <el-table-column prop="envValue" label="当前值">
                  </el-table-column>
                  <el-table-column prop="createUserName" label="变更人">
                  </el-table-column>
                  <el-table-column prop="changeType" label="变更类型">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.changeType === '0'" type="info"
                        >新增</el-tag
                      >
                      <el-tag v-if="scope.row.changeType === '1'">修改</el-tag>
                      <el-tag v-if="scope.row.changeType === '2'" type="danger"
                        >删除</el-tag
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    label="变更时间时间"
                    sortable
                  >
                  </el-table-column>
                </el-table>
              </div>

              <div class="page" v-show="historyList.length">
                <pagination
                  :small="false"
                  :total="total"
                  :page.sync="page"
                  :limit.sync="limit"
                  @pagination="getChangeHistoryList()"
                ></pagination>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="footer flex flex-justify-content-end">
      <el-button type="primary" @click="saveAppDeployEnvBatch()"
        >更新</el-button
      >
    </div>
  </div>
</template>
<script>
import { getEnvNameIndex, getEnvList } from "@/utils/pipeline.js";
import Pagination from "./../../components/Pagination/pagination.vue";
export default {
  name: "app-env",
  components: {
    Pagination,
  },
  data() {
    return {
      collapseTab: ["config"],
      appId: "",
      appCode: "",
      envValues: [],
      envObject: {},
      envs: [],
      activeConfigName: "DEV",
      envIndex: 1,
      server_tag: "default",
      total: 0,
      page: 1,
      limit: 10,
      historyList: [],
      disabledEnvList:["TENANT_ID","APP_ID","ENV"],
    };
  },
  mounted() {
    this.appCode = this.common.getUrlKey("appCode");
    this.appId = this.common.getUrlKey("appId");
    this.loadInfo();
    getEnvList();
    this.getChangeHistoryList();
  },
  methods: {
    envDisabled(item){
      if(this.isInArray(this.disabledEnvList,item.key)){
        return true;
      }else{
        return false;
      }
    },
    isInArray(arr,value){
      for(var i=0;i<arr.length;i++){
        if(value.toLowerCase() == arr[i].toLowerCase()){
          return true;
        }
      }
      return false;
    },
    // 获取发布历史
    getChangeHistoryList() {
      this.axios({
        url: this.GLOBAL.baseUrl + "/appDeploy/envChange/records",
        method: "get",
        params: {
          pageSize: this.limit,
          pageNumber: this.page,
          appId: this.appId,
          envIndex: this.envIndex,
          tenantId: localStorage.getItem("originTenantId"),
        },
      })
        .then((res) => {
          let { code, data } = res.data;
          if (code === 200) {
            let { total, list } = data;
            this.total = total;
            this.historyList = list;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //加载1、环境类型 2、保存的变量信息
    loadInfo() {
      this.loadCluserEnvironment();
      this.loadSaveEnvironment();
    },
    //加载已经保存的环境变量信息
    loadSaveEnvironment: function () {
      var that = this;
      this.axios({
        url:
          this.GLOBAL.baseUrl +
          "/appDeploy/env/variables/" +
          this.appId +
          "/" +
          1 +
          "/" +
          that.envIndex +
          "/" +
          that.server_tag,
        method: "get",
      })
        .then((response) => {
          if (response.status === 200) {
            if (response.data.code === 200) {
	            response.data.data.forEach(item=>{
								// 将默认的三个设置为不可编辑
								if (item.key === "TENANT_ID"|| item.key === "APP_ID"||item.key === "ENV"){
									item.defaultDisabled = true
								}
								// 如果保存了空数据，value反显应为不可编辑
								if (item.value === ''){
									item.disabled = true
									item.placeholder = '请先输入参数'
								}
	            })
              that.envValues = response.data.data;
            } else {
              this.$message.error("环境变量配置加载异常");
            }
          }
        })
        .catch((error) => {
          this.$message.error("环境变量配置加载异常");
        });
    },
    //加载集群信息
    loadCluserEnvironment: function () {
      var that = this;
      this.axios({
        url: this.GLOBAL.baseUrl + "/env/get",
        method: "get",
      })
        .then((res) => {
          if (res.data.code === 200) {
            if (res.data.data != undefined || res.data.data != null) {
              res.data.data.forEach((obj) => {
                that.envs.push(obj.selectValue.toUpperCase());
              });
            }
          }
        })
        .then((error) => {
          console.log(error);
        });
    },
    goBack: function () {
      this.$router.push("/cicd/app?appCode=" + this.appCode);
    },
    saveAppDeployEnvBatch: function () {
      this.$confirm("此操作永久修改当前配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.appId = this.common.getUrlKey("appId");
          this.appCode = this.common.getUrlKey("appCode");
          let postData = {
            id: Number(this.appId),
            chart_name: this.appCode,
            kube_env: this.envIndex,
            chart_envs: this.envValues,
          };
          this.axios({
            url: this.GLOBAL.baseUrl + "/appDeploy/saveAppDeployEnvBatch",
            method: "post",
            data: postData,
          })
            .then((res) => {
              if (res.status === 200) {
                if (res.data.code == 200) {
                  this.$message({
                    type: "success",
                    message: "操作成功",
                  });
                } else {
                  this.$message.error("操作失败");
                }
              } else {
                this.$message.error("操作失败");
              }
            })
            .catch((res) => {
              console.log(res);
              this.$message.error("环境变量配置异常");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    deleteEnv: function (item) {
      var that = this;
      if (this.envValues.length == 1) {
        this.$message({
          type: "warning",
          message: "至少包含一个参数",
        });
        return;
      }

      this.$confirm("此操作将该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          for (let index = 0; index < that.envValues.length; index++) {
            const env = that.envValues[index];
            if (env.key === item.key) {
              that.envValues.splice(index, 1);
            }
          }
        })
        .catch((e) => {
          console.log(e);
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    addEnv: function () {
      this.envValues.push({
        value: "",
        key: "",
		    disabled: true,
        placeholder: '请先输入参数',
        time: Date.now(),
      });
    },
		  inputChange(item,index){
			console.log(this.envValues ,'-------')
			  this.envValues.forEach((value, i)=>{
					if(index !== i){
						if (item.key === value.key){
							this.$message({
								type: "error",
								message: "参数不允许重复",
							});
							item.key = ""
							return false;
						}
					}
					
			  })
				
				  if (item.key){
						  item.disabled = false
						  item.placeholder = '请输入值'
				  }else{
							item.disabled = true
						  item.value = ''
						  item.placeholder = '请先输入参数'
				  }
		  },
    handleClickChangeConfig: function (e) {
      this.envIndex = getEnvNameIndex(e.label);
      this.loadSaveEnvironment();
      this.collapseTab = ["config"];
      this.getChangeHistoryList();
    },
    handleChangeCollase: function () {
      this.getChangeHistoryList();
    },
  },
};
</script>
<style scoped>
.main {
  height: calc(100% - 80px);
  padding: 24px;
  background: #ffffff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}
.back-box {
  font-size: 14px;
  color: #343a40;
  cursor: pointer;
  margin-bottom: 15px;
}

.back-box .el-icon-arrow-left {
  margin-right: 8px;
  font-size: 16px;
}
.panel-tab {
  flex: 1;
  overflow-y: auto;
}
.footer {
  margin-top: 24px;
}
.env-list {
  margin-top: 38px;
}
.env-list .list-item {
  margin: 18px 0;
}
.env-list .list-item:nth-child(2n) {
  padding: 18px 0;
  background: #f8f9fa;
}
.env-list .list-item .row {
  width: 49%;
}
.env-list .list-item .row .my-input {
  margin-right: 40px;
}
.env-list .list-item .label {
  margin: 0 20px;
  font-size: 14px;
  flex-shrink: 0;
}
</style>
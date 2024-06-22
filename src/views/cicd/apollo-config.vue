<template>
  <div class="main flex-column">
    <div class="back-box flex flex-align-items-center" @click="goBack">
      <i class="el-icon-arrow-left"></i>
      {{ appCode }}
    </div>
    <div class="panel-tab">
      <el-tabs v-model="activeConfigName" @tab-click="handleClickChangeConfig">
        <el-tab-pane
          v-for="(item, index) in envs"
          :key="index"
          :label="item.envName"
          :name="item.selectValue"
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
                @click="handleAdd"
                type="text"
                icon="el-icon-plus"
                class="btn-box"
                >新增变量</el-button
              >
	            <el-table
		            :data="envValues"
		            >
		            <el-table-column
			            label="状态"
			            width="120" align="center">
			            <template slot-scope="scope">
				            <el-tag v-if="scope.row.status===0" size="medium" type="success">已发布</el-tag>
				            <el-tag v-else size="medium">未发布</el-tag>
			            </template>
		            </el-table-column>
		            
		            <el-table-column
			            label="Key"
		              prop="key" align="center" show-overflow-tooltip>
			            <template slot-scope="scope">
				            <el-input v-if="scope.row.flag === 'add'" v-model="scope.row.key" ></el-input>
				            <span v-else>{{scope.row.key}}</span>
			            </template>
		            </el-table-column>
		            
		            <el-table-column
			            label="Value"
			            prop="value" align="center" show-overflow-tooltip>
			            <template slot-scope="scope">
				            <span v-if="scope.row.edit">{{scope.row.value}}</span>
				            <el-input v-else v-model="scope.row.value" ></el-input>
			            </template>
		            </el-table-column>
		            
		            <el-table-column
			            label="comment"
			            prop="注释说明" align="center">
			            <template slot-scope="scope">
				            <span v-if="scope.row.edit">{{scope.row.comment}}</span>
				            <el-input v-else v-model="scope.row.comment" ></el-input>
			            </template>
		            </el-table-column>
			           
		            <el-table-column width="180" label="操作" fixed="right" align="center">
			            <template slot-scope="scope">
				            <div v-if="scope.row.edit">
					            <el-button
						            size="mini"
						            type="primary"
						            @click="handleEdit(scope.$index, scope.row)" icon="el-icon-edit"></el-button>
					            <el-button
						            size="mini"
						            type="danger"
						            @click="handleDelete(scope.$index, scope.row)" icon="el-icon-delete"></el-button>
				            </div>
				           
				            <div v-else>
					            <el-button size="mini" title="保存" type="success" circle icon="el-icon-check" @click="handleSave(scope.$index, scope.row)"></el-button>
					            <el-button size="mini" title="取消" type="danger" circle icon="el-icon-close" @click="handleCancel(scope.$index, scope.row)"></el-button>
				            </div>
				           
			            </template>
		            </el-table-column>
	            </el-table>
            </el-collapse-item>
	          
						<!-- 更改记录 -->
            <el-collapse-item name="change" style="border: none">
              <template slot="title">
                更改记录<i class="header-icon el-icon-edit-outline"></i>
              </template>
              <div class="table-box">
	              <el-row :gutter="20">
		              <el-col :span="12">
			              <el-table  ref="singleTable" :data="historyList" style="width: 100%" highlight-current-row @current-change="handleRowClick">
				              <el-table-column prop="namespaceName" label="命名空间">
				              </el-table-column>
				              
				              <el-table-column prop="releaseTitle" label="发布标签" show-overflow-tooltip>
				              </el-table-column>
				              
				              <el-table-column prop="operator" label="操作人" show-overflow-tooltip>
				              </el-table-column>
				              
				              <el-table-column prop="operatorName" label="操作类型">
				              </el-table-column>
				              
				              <el-table-column
					              prop="releaseTimeFormatted"
					              label="操作时间"
					              sortable
				              >
				              </el-table-column>
			              </el-table>
			              
			              <div class="page" v-show="historyList.length">
				              <el-button type="info" style="width: 100%;border: 0px;margin: 10px 0;background:#cccccc69;color: #1a1a1a" @click="loadMore">加载更多</el-button>
<!--				              <pagination
					              :small="false"
					              :total="total"
					              :page.sync="page"
					              :limit.sync="limit"
					              @pagination="getChangeHistoryList()"
				              ></pagination>-->
			              </div>
			              
		              </el-col>
		              
		              <el-col :span="12">
			              <span>变更的配置</span>
			              <el-table :data="historyDetailList" style="width: 100%"  v-loading="loadingDetailList">
				              <el-table-column prop="type" label="Type">
					              <template slot-scope="scope">
						              <el-tag v-if="scope.row.type === '新增'">新增</el-tag>
						              <el-tag v-if="scope.row.type === '修改'" type="warning">修改</el-tag>
						              <el-tag v-if="scope.row.type === '删除'" type="danger">删除</el-tag>
					              </template>
				              </el-table-column>
				              
				              <el-table-column prop="key" label="Key">
				              </el-table-column>
				              <el-table-column prop="oldValue" label="Old Value">
				              </el-table-column>
				              <el-table-column prop="newValue" label="New Value">
				              </el-table-column>
			              </el-table>
		              </el-col>
	              </el-row>
               
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
import Pagination from "./../../components/Pagination/pagination.vue";
import { apolloAdd, apolloUpadte, apolloDel, queryChangeHistory, queryChangeHistoryDetail, apolloPublish, apolloAllConfigList, queryEnvs } from "@/api/apollo_config"
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
      envs: [],
      activeConfigName: "dev",
      total: 0,
      page: 0,
      limit: 10,
      historyList: [],
	    historyDetailList: [],
	    loadingDetailList: false,
    };
  },
  mounted() {
    this.appCode = this.common.getUrlKey("appCode");
    this.appId = this.common.getUrlKey("appId");
    this.loadInfo();
  
  },
  methods: {
	  loadCluserEnvironment: function () {
		  queryEnvs().then(res =>{
				console.log(res,'=====')
			  if (res.message === 'success'){
				  res.data = res.data.map(item =>{
						return {
							...item,
							envName: item.selectValue.toUpperCase()
						}
				  })
					this.envs = res.data
			  }
		  })
		  
		  /*this.axios({
			  url: this.GLOBAL.baseUrl + "/env/get",
			  method: "get",
		  })
			  .then((res) => {
					console.log(res,'-=====')
				  if (res.data.code === 200) {
					  if (res.data.data !== undefined || res.data.data !== null) {
						  res.data.data.forEach((obj) => {
							  that.envs.push(obj.selectValue.toUpperCase());
						  });
					  }
				  }
			  })
			  .then((error) => {
				  console.log(error);
			  });*/
	  },
	  
		/* 历史点击行 */
	  handleRowClick(row){
			console.log(row)
		  if (row === null) return false
		  
			this.loadingDetailList = true
		  // 查看历史详情
		  queryChangeHistoryDetail({
			  envId: this.activeConfigName,
			  appId: this.appCode,
			  baseReleaseId: row.previousReleaseId || '',
			  toCompareReleaseId: row.releaseId || '',
		  }).then(res =>{
			  if (res.code === 200) {
				  this.historyDetailList = res.data
				  this.loadingDetailList = false
			  }
			  
		  })
	  },
	  
		/* 新增 */
	  handleAdd () {
			try {
				this.envValues.forEach(item=>{
					if (item.flag !== undefined){
						throw 'ces'
					}
				})
			}catch (e) {
				this.$confirm('已存在未保存的数据, 请先保存之后再进行新增', '提示', {
					showConfirmButton:false,
					cancelButtonText: '关闭',
					type: 'warning'
				}).then(() => {
				}).catch(() => {
				});
				return false
			}
		 
		  this.envValues.push({
			  key: "",
			  value: "",
			  comment: "",
			  edit: false,
			  time: Date.now(),
			  flag: 'add'
		  });
	  },
	  
		/* 删除 */
	  handleDelete (i,row) {
		  this.$confirm("此操作将该数据删除, 是否继续? (已发布数据需要更新后生效)", "提示", {
			  confirmButtonText: "确定",
			  cancelButtonText: "取消",
			  type: "warning",
		  })
			  .then(() => {
				  apolloDel({
					  envId: this.activeConfigName,
					  appId: this.appCode,
					  apolloKey: row.key
			  }).then(res =>{
					  if(res.message==='成功'){
						  this.$message({
							  message: `删除成功`,
							  type: `success`
						  })
					  }else{
						  this.$message({
							  message: `删除失败`,
							  type: `error`
						  })
					  }
					  this.loadApolloList()
				  })
			  })
			  .catch((e) => {
				  this.$message({
					  type: "info",
					  message: "已取消",
				  });
			  });
	  },
	  
		/* 编辑/ */
	  handleEdit(i,row){
			this.envValues[i].edit = !row.edit
	  },
	  /* 取消编辑 */
	  handleCancel(i,row){
			this.envValues[i].edit = !row.edit
		  this.loadApolloList()
	  },
	  
	  /* 保存、编辑 */
	  handleSave(i,row){
			if (row.flag === 'add'){
				apolloAdd({
					apolloValue: row.value,
					apolloKey: row.key,
					apolloComment: row.comment,
					envId: this.activeConfigName,
					appId: this.appCode
				}).then(res => {
					if(res.message==='成功'){
						this.$message({
							message: `保存成功`,
							type: `success`
						})
					}else{
						this.$message({
							message: `保存失败`,
							type: `error`
						})
					}
					this.loadApolloList()
				})
			} else {
				this.$confirm("此操作将该数据重新编辑, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(() => {
						apolloUpadte({
							apolloValue: row.value,
							apolloKey: row.key,
							apolloComment: row.comment,
							envId: this.activeConfigName,
							appId: this.appCode
						}).then(res => {
							if(res.message==='成功'){
								this.$message({
									message: `编辑成功`,
									type: `success`
								})
							}else{
								this.$message({
									message: `编辑失败`,
									type: `error`
								})
							}
							this.loadApolloList()
						})
					})
					.catch((e) => {
						this.$message({
							type: "info",
							message: "已取消",
						});
					});
				
				
			}
	  },
	  
	  // 获取列表
	  loadApolloList () {
		  apolloAllConfigList({
			  envId: this.activeConfigName,
			  appId: this.appCode
		  }).then(res=>{
				if (JSON.stringify(res.data) === '{}'){this.envValues = []}else{
					
				  let noPublish = res.data.noPublish
				  let publish = res.data.publish
				  if (noPublish.length > 0){
					  noPublish = noPublish.map(item=>{
							return {
								...item,
								edit: true,
								status: 1
							}
					  })
				  }
				  if (publish.length > 0){
					  publish = publish.map(item=>{
							return {
								...item,
								edit: true,
								status: 0
							}
					  })
				  }
				  this.envValues = publish.concat(noPublish)
			  }
		  })
	  },
	  
	  /* 加载更多 */
	  loadMore(){
		  this.limit = this.limit + 10
		  this.getChangeHistoryList();
	  },
	  
    // 获取发布历史 左侧列表
    getChangeHistoryList() {
	    queryChangeHistory({
		    envId: this.activeConfigName,
		    appId: this.appCode,
		    page: this.page,
		    size: this.limit
	    }).then(res =>{
				if (res.code === 200) {
					// this.total = total;
					this.historyList = res.data;
					
					this.$nextTick(()=>{
						if (this.historyList.length > 0)
						this.$refs.singleTable[0].setCurrentRow (this.historyList[0]);
					})
					
				}
	    })
    },
	  
    //加载1、环境类型 2、更改记录
    loadInfo() {
      this.loadApolloList();
	    this.loadCluserEnvironment();
    },
    
    goBack() {
      this.$router.push("/cicd/app?appCode=" + this.appCode);
    },
	  
	  /* 发布 */
    saveAppDeployEnvBatch() {
			try {
				this.envValues.forEach(item=>{
					if (!item.edit){
						throw '配置信息中存在未保存的数据，更新执行失败'
					}
				})
				
				
				this.$confirm("此操作发布当前配置列表, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(() => {
						/* 发布 */
						apolloPublish({
							envId: this.activeConfigName,
							appId: this.appCode,
						}).then(res =>{
							if(res.message==='成功'){
								this.$message({
									message: `更新成功`,
									type: `success`
								})
							}else{
								this.$message({
									message: `更新失败`,
									type: `error`
								})
							}
							this.loadApolloList()
						})
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消操作",
						});
					});
				
			}catch (e){
				this.$confirm(e, '提示', {
					showConfirmButton:false,
					cancelButtonText: '关闭',
					type: 'warning'
				}).then(() => {
				}).catch(() => {
				});
			}
    },
    
	  /* 点击环境 */
    handleClickChangeConfig: function (e) {
			this.historyDetailList = []
	    this.activeConfigName = e.name
	    this.limit = 10
      this.collapseTab = ["config"];
	    this.loadApolloList();
	    this.getChangeHistoryList();
    },
	  
	  /* 配置信息 、 更改记录点击 */
    handleChangeCollase: function (v) {
	    if (v === 'config'){
		    this.loadApolloList();
	    }
	    if (v === 'change') {
		    this.limit = 10
		    this.getChangeHistoryList();
	    }
			
    },
  },
};
</script>


<style scoped lang="scss">
.table-box {
	/deep/ .el-table__row{
		cursor:pointer;
	}
}
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
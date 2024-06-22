<template>
		<div class="main flex-column">
				<div class="back-box flex flex-align-items-center" @click="goBack">
						<i class="el-icon-arrow-left"></i>
						{{ appCode }}
				</div>
				<div class="panel-tab">
						<el-collapse
							:accordion="true"
							v-model="collapseTab"
						>
								<!-- 更改记录 -->
								<el-collapse-item name="change" style="border: none">
										<template slot="title">
												更改记录<i class="header-icon el-icon-edit-outline"></i>
										</template>
										<div class="table-box">
												<el-row :gutter="20">
														<el-col :span="24">
																<el-table ref="singleTable" :data="tableList" style="width: 100%"
																          highlight-current-row
																					@sort-change="sortable">
																		
																		
																		<el-table-column prop="createUserName" label="变更人" show-overflow-tooltip>
																		</el-table-column>
																		
																		<el-table-column prop="changeField" label="变更字段" show-overflow-tooltip>
																		</el-table-column>
																		
																		<el-table-column prop="changeOldValue" label="变更前" show-overflow-tooltip>
																		</el-table-column>
																		
																		<el-table-column prop="changeNewValue" label="变更后" show-overflow-tooltip>
																		</el-table-column>
																		
																		<el-table-column prop="createTime" label="变更时间" :sortable="'custom'" >
																		</el-table-column>
																
																</el-table>
																<pagination v-show="total > 0"
																            :total="total" :page.sync="page"
																            :limit.sync="limit"
																            @pagination="getChangeTableList()"></pagination>
														</el-col>
												</el-row>
										
										</div>
								
								
								</el-collapse-item>
						</el-collapse>
				
				</div>
		</div>
</template>
<script>
import Pagination from "./../../components/Pagination/pagination.vue";
import {
		apolloAdd,
		apolloUpadte,
		apolloDel,
		queryChangeHistory,
		queryChangeHistoryDetail,
		apolloPublish,
		apolloAllConfigList,
		queryEnvs
} from "@/api/apollo_config"
import {getEnvNameIndex} from "@/utils/pipeline.js";

export default {
		name: "change-record",
		components: {
				Pagination,
		},
		data() {
				return {
						tableList: [],
						collapseTab: ["change"],
						total: 0,
						page: 1,
						limit: 10,
						sort: 'desc',
						appId: "",
						appCode: "",
				};
		},
		mounted() {
				this.appCode = this.common.getUrlKey("appCode");
				this.appId = this.common.getUrlKey("appId");
				this.loadInfo();
				
		},
		methods: {
				sortable(a){
						if (a.order === 'ascending'){
								this.sort = 'asc'
						}else{
								this.sort = 'desc'
						}
						this.getChangeTableList()
				},
				queryEnv: function () {
						queryEnvs().then(res => {
								if (res.message === 'success') {
										res.data = res.data.map(item => {
												return {
														...item,
														envName: item.selectValue.toUpperCase()
												}
										})
								}
						})
				},
				// 查询列表
				getChangeTableList() {
						let url = this.GLOBAL.baseUrl + "/app/change/logs";
						this.axios({
								method: "get",
								url: url,
								params: {
										tenantId: localStorage.getItem("originTenantId"),
										appId: this.appId,
										pageNumber: this.page,
										pageSize: this.limit,
										sort: this.sort,
								},
						})
							.then((res) => {
									if (res.data.code === 200) {
											this.tableList = res.data.data.list
											this.total = res.data.data.total
									} else {
											this.$message({
													type: 'error',
													message: res.data.message
											})
									}
							})
						
				},
				
				//加载1、环境类型 2、更改记录
				loadInfo() {
						this.queryEnv();
						this.getChangeTableList();
				},
				
				goBack() {
						this.$router.push("/cicd/app?appCode=" + this.appCode);
				},
				
		},
};
</script>


<style scoped lang="scss">
.table-box {
		/deep/ .el-table__row {
				cursor: pointer;
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
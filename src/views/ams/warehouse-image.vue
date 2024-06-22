<template>
		<div class="main flex-column">
				<div v-if="drawer" class="table-box">
						<el-page-header @back="goBack" content="镜像列表"></el-page-header>
						<div class="panel flex-center-between">
								<!-- 搜索 -->
								<el-form :inline="true" :model="image_formSearch" size="small" class="demo-form-inline"
								         @submit.native.prevent
								         label-width="80px">
										<el-form-item label="类型">
												<el-select v-model="image_formSearch.productType" clearable placeholder="请选择类型" @change="queryImageList">
														<el-option
															v-for="item in typeOptions"
															:key="item.value"
															:label="item.label"
															:value="item.value">
														</el-option>
												</el-select>
										</el-form-item>
										
										<el-form-item label="状态">
												<el-select v-model="image_formSearch.isDelete" clearable placeholder="请选择状态" @change="queryImageList">
														<el-option
															v-for="item in statusOptions"
															:key="item.value"
															:label="item.label"
															:value="item.value"
															v-html="'<span style=color:'+item.color+'>'+item.label+'</span>'">
														</el-option>
												</el-select>
										</el-form-item>
										
										<el-form-item label="镜像名称">
												<el-input v-model.trim="image_formSearch.productName" placeholder="请输入镜像名称" clearable
												          @keyup.enter.native="queryImageList" @clear="queryImageList"></el-input>
										</el-form-item>
										
										<el-form-item>
												<el-button type="primary" @click="queryImageList">查询</el-button>
										</el-form-item>
								</el-form>
						</div>
						<!-- 表格 -->
						<el-table :key="2" stripe id="out-table" v-loading="loading" :data="image_tableData" style="width: 100%" height="calc(100% - 80px)">
								<el-table-column label="镜像名称" min-width="500">
										<template slot-scope="scope">
												<span>{{ scope.row.productName }}</span>
										</template>
								</el-table-column>
								<el-table-column label="类型" min-width="100">
										<template slot-scope="scope">
												<span>{{ scope.row.productType }}</span>
										</template>
								</el-table-column>
								<el-table-column label="创建时间" min-width="200">
										<template slot-scope="scope">
												<span>{{ scope.row.createTime }}</span>
										</template>
								</el-table-column>
								<el-table-column label="状态" min-width="120">
										<template slot-scope="scope">
												<el-tag v-if="scope.row.isDelete===1">暂时保存</el-tag>
												<el-tag type="success" v-else-if="scope.row.isDelete===4">永久保存</el-tag>
												<el-tag type="warning" v-else-if="scope.row.isDelete===3">即将删除</el-tag>
												<el-tag type="danger" v-else-if="scope.row.isDelete===2">已删除</el-tag>
												<span v-else>-</span>
										</template>
								</el-table-column>
						</el-table>
				</div>
				
				
				<div v-else class="table-box">
						<div class="panel flex-center-between">
								<!-- 搜索 -->
								<el-form :inline="true" :model="formSearch" size="small" class="demo-form-inline" @submit.native.prevent
								         label-width="100px">
										<el-form-item label="APPID">
												<el-input v-model.trim="formSearch.appCode" id="appCode" placeholder="请输入APPID"
												          @keyup.enter.native="GetTableList" clearable></el-input>
										</el-form-item>
										
										<el-form-item label="所属业务">
												<el-input v-model.trim="formSearch.groupIdStr" placeholder="请输入所属业务" id="groupIdStr" clearable
												          @keyup.enter.native="GetTableList"></el-input>
										</el-form-item>
										<el-form-item>
												<el-button type="primary" @click="GetTableList" id="appSearch">查询</el-button>
										</el-form-item>
								</el-form>
						</div>
						<!-- 表格 -->
						<el-table :key="1" stripe id="out-table" v-loading="loading" :data="tableData" style="width: 100%" height="calc(100% - 80px)">
								<el-table-column label="APPID" prop="code" :show-overflow-tooltip="true"></el-table-column>
								<el-table-column label="应用名称" prop="">
										<template slot-scope="scope">
												<span>{{ scope.row.name }}</span>
										</template>
								</el-table-column>
								<el-table-column label="所属人" prop="">
										<template slot-scope="scope">
												<span>{{ scope.row.prodMgrName }}</span>
										</template>
								</el-table-column>
								<el-table-column label="业务域" prop="">
										<template slot-scope="scope">
												<span>{{ scope.row.groupIdStr }}</span>
										</template>
								</el-table-column>
								<el-table-column label="语言/渠道" :formatter="stateLanguage">
								</el-table-column>
								<el-table-column label="操作" align="center" width="200px" fixed="right">
										<template slot-scope="scope">
												<el-button type="primary" size="mini" @click="lookImgage(scope.row)" icon="el-icon-view" plain>
														查看镜像
												</el-button>
										</template>
								</el-table-column>
						</el-table>
				</div>
				
				<pagination v-show="!drawer && total > 0" :total="total" :page.sync="page" :limit.sync="limit"
				            @pagination="GetTableList"></pagination>
				
				<pagination v-show="drawer && image_total > 0" :total="image_total" :page.sync="image_page"
				            :limit.sync="image_limit"
				            @pagination="queryImageList"></pagination>
		</div>
</template>

<script>
import Table from "@/components/tableTemp";
import pagination from "@/components/Pagination/pagination";
import appEnvVariables from "@/views/cicd/app-env";
import {
		getUseLanguageName
} from "@/utils/pipeline.js";

export default {
		name: "app",
		props: {},
		
		data() {
				return {
						drawer: false,
						formSearch: {
								appCode: ""
						},
						
						image_formSearch: {
								"productName": null,
								"productType": null,
								"isDelete": null,
						},
						
						image_tableData: [],
						tableData: [],
						
						total: 0,
						page: 1,
						limit: 10,
						image_total: 0,
						image_page: 1,
						image_limit: 10,
						
						app_id: '',
						loading: false,
						app_url: this.GLOBAL.baseUrl + "/app/list/condition",
						typeOptions:[{
								value: 'image',
								label: 'image'
						}],
						statusOptions:[{
								value: 1,
								label: '暂时保存',
								color: '#409EFF'
						},{
								value: 4,
								label: '永久保存',
								color: '#67c23a'
						},{
								value: 3,
								label: '即将删除',
								color: '#e6a23c'
						},{
								value: 2,
								label: '已删除',
								color: '#f56c6c'
						}],
				};
		},
		watch: {},
		methods: {
				goBack() {
						this.drawer = false
						this.image_page = 1
						this.image_limit = 10
						this.GetTableList();
				},
				stateLanguage: function (row, column) {
						return getUseLanguageName(row.useLanguage);
				},
				
				// 查看镜像列表
				lookImgage(row) {
						this.drawer = true
						this.app_id = row.id
						this.queryImageList()
				},
				
				// 查询镜像列表
				queryImageList: function () {
						//   处理与参与者中心解耦-登录判断，参数 URL 处理
						let url = this.GLOBAL.baseUrl + "/products/list/condition"
						let parms = {
								"pageSize": this.image_limit,
								"pageNumber": this.image_page,
								'appId': this.app_id
						}
						if (this.image_formSearch.productName) {
								parms.productName = this.image_formSearch.productName
						}
						if (this.image_formSearch.productType) {
								parms.productType = this.image_formSearch.productType
						}
						if (this.image_formSearch.isDelete) {
								parms.isDelete = this.image_formSearch.isDelete
						}
						
						this.axios({
								url: url,
								method: "post",
								data: parms,
						})
							.then((res) => {
									if (res.data.code === 200) {
											console.log(res);
											if (res.data.data) {
													this.image_tableData = res.data.data.list
													this.image_total = res.data.data.total
											}else{
													this.image_tableData = []
													this.image_total = 0
											}
											
									}
							})
							.catch((err) => {
									console.log(err);
							});
						
				},
				GetTableList: function () {
						this.InitGetTableData(this.app_url, this.limit, this.page);
				},
				
				// 获取表格数据；
				InitGetTableData: function (url, page_size, page_index) {
						let parms = {
								pageSize: page_size,
								pageNumber: page_index,
								code: this.formSearch.appCode,
								groupIdStr: this.formSearch.groupIdStr,
								projMgrName: this.formSearch.name,
						};
						//   处理与参与者中心解耦-登录判断，参数 URL 处理
						if (this.$store.getters.authLoginToken) {
								let resParam = this.common.handleAuthLoginParams(parms, '/app/list/condition')
								parms = resParam.parms;
								url = resParam.url
						}
						this.loading = true;
						this.axios({
								method: "GET",
								url: url,
								params: parms,
						})
							.then((response) => {
									if (response.data.code == 200) {
											this.tableData = response.data.data.list;
											this.total = response.data.data.total;
									} else {
											console.log(response.data.error);
											this.$message.error('加载应用信息失败,请联系平台管理员');
									}
									this.loading = false;
							})
							.catch((response) => {
									this.loading = false;
									console.log(response.data.error)
									this.$message.error('加载应用信息失败,请联系平台管理员');
							});
				},
				
		},
		
		computed: {
				GetLanguages() {
						return getUseLanguageName(scope.row.useLanguage);
				},
		},
		mounted() {
				let appCode = this.common.getUrlKey("appCode");
				if (appCode) {
						this.formSearch.appCode = appCode;
				}
				this.InitGetTableData(this.app_url, this.limit, this.page);
		},
		components: {
				"table-box": Table,
				pagination: pagination,
				appEnvVariables: appEnvVariables,
		},
};
</script>

<style scoped>
.main {
		background: white;
		padding: 24px;
		height: calc(100% - 80px);
		box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
		border-radius: 8px;
}

.table-box {
		height: calc(100% - 80px);
		flex: 1;
		overflow-y: auto;
}


.flex-center-between {
		justify-content: flex-end;
}
</style>

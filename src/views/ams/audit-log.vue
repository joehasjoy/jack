<template>
		<div class="team-main">
				<!-- 搜索 -->
				<div class="search-box flex-center-between">
						<el-form :inline="true" :model="formSearch" class="demo-form-inline" @submit.native.prevent>
								
								<el-form-item label="操作人:">
										<el-select style="width: 285px" v-model="formSearch.respPersonId" filterable remote reserve-keyword
										           placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" :loading="loading"
										           clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions">
												<el-option v-for="item in domainMemberOptions" :key="item.value" :label="item.label"
												           :value="item.value">
												</el-option>
										</el-select>
								</el-form-item>
								
								<el-form-item label="操作日期:">
										<el-date-picker
										
											v-model="formSearch.operateDate"
											type="datetimerange"
											:picker-options="pickerOptions"
											range-separator="至"
											start-placeholder="开始日期"
											end-placeholder="结束日期"
											align="right"
											format="yyyy-MM-dd HH:mm:ss"
											value-format="yyyy-MM-dd HH:mm:ss">
										</el-date-picker>
								</el-form-item>
								
								<el-form-item>
										<el-button type="primary" @click="
                  initBusinessDomainTableData(
                    list_url,
                    business_domain_limit,
                    business_domain_page
                  )
                ">
												查询
										</el-button>
								
								</el-form-item>
						
						</el-form>
				</div>
				<!-- table -->
				<el-table stripe :data="business_domain_tableData" tooltip-effect="dark myTooltips"
				          >
						<el-table-column type="index" label="序号" align="center"></el-table-column>
						<el-table-column label="请求接口" align="center" prop="actionDesc" width="240"
						                 show-overflow-tooltip></el-table-column>
						<el-table-column label="请求入参" align="center" prop="requestParameters"
						                 show-overflow-tooltip>
								<template slot-scope="scope">
										{{ scope.row.responseResult }}
								</template>
						</el-table-column>
						<el-table-column label="请求出参" align="center" prop="responseResult"
						                 show-overflow-tooltip>
								<template slot-scope="scope">
										{{ scope.row.responseResult }}
								</template>
						</el-table-column>
						<el-table-column label="操作人" align="center" prop="nickName" width="200" show-overflow-tooltip>
								<template slot-scope="scope">
<!--										{{ scope.row.nickName }} - {{ scope.row.userName }}-->
										{{ scope.row.nickName }}
								</template>
						</el-table-column>
						<el-table-column label="请求时间" align="center" prop="operateTime" width="200"></el-table-column>
				</el-table>
				<!-- 分页 -->
				<pagination v-show="business_domain_total > 0" :total="business_domain_total" :page.sync="business_domain_page"
				            :limit.sync="business_domain_limit" @pagination="
            initBusinessDomainTableData(
              list_url,
              business_domain_limit,
              business_domain_page
            )
          "></pagination>
		
		</div>
</template>

<script>
import pagination from "@/components/Pagination/pagination";
import common from "../../utils/common";
export default {
		name: "ams-base-config",
		data() {
				return {
						pickerOptions: {
								shortcuts: [{
										text: '最近一周',
										onClick(picker) {
												const end = new Date();
												const start = new Date();
												start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
												picker.$emit('pick', [start, end]);
										}
								}, {
										text: '最近一个月',
										onClick(picker) {
												const end = new Date();
												const start = new Date();
												start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
												picker.$emit('pick', [start, end]);
										}
								}, {
										text: '最近三个月',
										onClick(picker) {
												const end = new Date();
												const start = new Date();
												start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
												picker.$emit('pick', [start, end]);
										}
								}]
						},
						
						showTeamAll: false,
						
						memberTableData: [],
						
						domainMemberOptions: [],
						formSearch: {
								operateDate: [new Date(new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7)), new Date()],
								respPersonId: "",
						},
						loading: false,
						limit: 10,
						page: 1,
						total: 0,
						business_domain_loading: false,
						business_domain_tableData: [],
						business_domain_limit: 10,
						business_domain_page: 1,
						business_domain_total: 0,
						
						list_url: this.GLOBAL.baseUrl + "/auditLog/list",
				};
		},
		methods: {
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
				
				
				getTeamMembers(teamIdVar) {
						this.showTeamAll = true;
						this.memberTableData = [];
						let url = this.GLOBAL.baseUrl + "/team/member/" + teamIdVar + "/all";
						this.axios({
								method: "get",
								url: url,
						})
							.then((res) => {
									this.showTeamAll = false;
									if (res.status === 200) {
											this.memberTableData = res.data.data;
									}
							})
							.catch((err) => {
									this.showTeamAll = false;
									alert(err);
							});
				},
				// 获取表格数据；
				initBusinessDomainTableData: function (url, page_size, page_index) {
						console.log(this.formSearch.operateDate)
						if (this.formSearch.operateDate === null && !this.formSearch.respPersonId){
								this.$message.error('查询条件必须填写一个！');
								return
						}
					 const loading = this.$loading({
								lock: true,
								text: 'Loading',
								spinner: 'el-icon-loading',
								background: 'rgba(0, 0, 0, 0.7)'
						});
						const params = {
								pageSize: page_size,
								pageNumber: page_index,
								operator: this.formSearch.respPersonId,
								operateStartDate: this.formSearch.operateDate=== null ? '' : this.common.formatDate(this.formSearch.operateDate[0], 'yyyy-MM-dd hh:mm:ss'),
								operateEndDate: this.formSearch.operateDate=== null ? '' : this.common.formatDate(this.formSearch.operateDate[1],'yyyy-MM-dd hh:mm:ss'),
						};
						if (!params.operator){
								delete params.operator
						}
						this.axios({
								method: "post",
								url: url,
								data: params,
						})
							.then((response) => {
									if (response.data.code === 200) {
											this.business_domain_tableData = response.data.data.list;
											this.business_domain_total = response.data.data.total;
									} else {
											this.$message.error(response.data.error);
									}
							})
							.catch((response) => {
									this.$message.error(String(response));
							}).finally(()=>{
								loading.close();
						});
				},
				
		},
		
		computed: {},
		
		mounted() {
				//初始化业务域相关数据
				this.initBusinessDomainTableData(
					this.list_url,
					this.business_domain_limit,
					this.business_domain_page
				);
		},
		components: {
				pagination: pagination,
				editor: require("vue2-ace-editor"),
		},
};
</script>

<style lang="scss">
.team-main {
		box-sizing: border-box;
		height: calc(100% - 80px);
		background: white;
		padding: 20px;
		box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.08);
		border-radius: 8px;
}

.search-box {
		float: right;
}

.myTooltips {
		max-width: 30% !important;
}

</style>

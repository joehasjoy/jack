<template>
		<div>
				<div class="table-box">
						<enn-table :tableColumn="column" :tableData="list">
								<div slot="bug" slot-scope="scope">
										
										<el-tag effect="dark" type="danger" color="red" :hit="false"
										        v-if="scope.row.vulNumSerious|| scope.row.vulNumSerious==0">
												{{ scope.row.vulNumSerious }}
										</el-tag>
										<el-tag effect="dark" type="danger" v-if="scope.row.vulNumHigh|| scope.row.vulNumHigh==0">
												{{ scope.row.vulNumHigh }}
										</el-tag>
										<el-tag effect="dark" type="warning" v-if="scope.row.vulNumMedium || scope.row.vulNumMedium==0">
												{{ scope.row.vulNumMedium }}
										</el-tag>
										<el-tag effect="dark" v-if="scope.row.vulNumLow|| scope.row.vulNumLow==0">
												{{ scope.row.vulNumLow }}
										</el-tag>
										<span v-else>-</span>
								</div>
								
								<div slot="status" slot-scope="scope">
										{{ scope.row.status }}
<!--										<el-link
											target="_blank"
											:underline="false"
											:href="scope.row.reportUrl"
										>
												<span class="text" style="color: #2d8cf0">查看报告</span>
										
										</el-link>-->
										<el-button type="text" size="mini" v-if="scope.row.status==='已完成'" @click="reprot(scope.row)">查看报告</el-button>
										<el-button type="primary" size="mini" v-if="scope.row.status==='待检测'" @click="wait(scope.row)">重新检测</el-button>
								</div>
						</enn-table>
				</div>
				<div class="page" v-show="list.length">
						<pagination :small="false" :total="vecsTotal" :page.sync="vecsPage" :limit.sync="vecsLimit"
						            @pagination="loadMain()"></pagination>
				</div>
		</div>
</template>

<script>
import EnnTable from "../EnnTable/index.vue";
import Pagination from "../Pagination/pagination.vue";

export default {
		name: "openSourceComponents",
		components: {
				EnnTable,
				Pagination,
		},
		data() {
				return {
						appId: '',
						column: [
								{
										label: "序号",
										prop: "index",
										width: '50'
								},
								{
										label: "GIT地址",
										prop: "gitAddr",
										width: '250'
								},
								{
										label: "分支",
										prop: "branch",
										width: '250'
								},
								{
										label: "制品信息",
										prop: "isoName",
										width: '250'
								},
								{
										label: "漏洞",
										prop: "bug",
										slot: true,
										slotName: 'bug',
										width: '250'
										
								},
								{
										label: "提交人",
										prop: "committer",
										width: '150'
								},
								{
										label: "检查时长",
										prop: "scanUseSecond"
								},
								{
										label: "状态",
										prop: "status",
										slot: true,
										slotName: 'status',
										width: '250'
								},
						],
						list: [],
						vecsHistoryList: [],
						vecsPage: 1,
						vecsLimit: 5,
						vecsTotal: null,
				}
		},
		mounted() {
		},
		methods: {
				loadMain() {
						this.axios({
								url: this.GLOBAL.baseUrl +'/app-deploy-version/component_scan/records',
								// url: 'https://tenant-management-service.dev.ennew.com/tenant-management/app-deploy-version/component_scan/records',
								params: {
										pageNumber: this.vecsPage,
										appId: this.appId,
										pageSize: this.vecsLimit
								},
								method: 'get',
						}).then(respone => {
								if (respone.data.code === 200) {
										let res = respone.data.data
										res.list = res.list.map((item, i) => {
												return {
														...item,
														index: i + 1
												}
										})
										this.list = res.list
										this.vecsTotal = res.total
								}
						})
				},
				reprot(row){
						if (row.reportUrl){
								let url = row.reportUrl+'.pdf'
								url = url.replace('http:','https:')
								console.log("打开链接:",url);
							/*
								let aLabel = document.createElement('a');
								//设置链接
								aLabel.setAttribute('href', url);
								//新窗口打开链接
								aLabel.setAttribute('target', '_blank');
								//设置标签ID
								aLabel.setAttribute('id', 'reportpoint');
								// 防止反复添加
								if (document.getElementById('reportpoint')) {
										document.body.removeChild(document.getElementById('reportpoint'));
								}
								document.body.appendChild(aLabel);
								aLabel.click();*/
								
								
								window.open(row.reportUrl)
						}
				},
				wait(row){
						console.log(row)
						this.axios({
								url: this.GLOBAL.baseUrl +'/pipeline/triggerComponentScan',
								// url: 'https://tenant-management-service.dev.ennew.com/tenant-management/pipeline/triggerComponentScan',
								data: {
										id: row.id,
								},
								method: 'post',
						}).then(respone => {
								if (respone.data.code === 200) {
										this.loadMain();
										this.$message.success(respone.data.message)
								}
						})
				}
		},
}
</script>

<style scoped>
.table-box {
		margin-top: 20px;
		flex: 1;
		overflow-y: auto;
}
</style>
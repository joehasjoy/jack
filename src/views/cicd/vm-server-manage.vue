<template>
		<div class="main flex-column">
				
				<div class="table-box">
						<div class="panel">
								<el-button style="float: left;" icon="el-icon-plus" @click="addServerDialog">接入</el-button>
								<!-- 搜索 -->
								<div style="float: right">
										<el-form :inline="true" :model="formSearch" size="small" class="demo-form-inline"
										         @submit.native.prevent label-width="100px">
												
												<el-form-item label="服务器IP">
														<el-input v-model.trim="formSearch.ip" placeholder="请输入服务器IP"
														          @keyup.enter.native="GetTableList" clearable></el-input>
												</el-form-item>
												
												<el-form-item label="业务域">
														<el-input v-model.trim="formSearch.teamName" placeholder="请输入所属业务域" id="groupIdStr"
														          clearable @keyup.enter.native="GetTableList"></el-input>
												</el-form-item>
												
												<el-form-item>
														<el-button type="primary" @click="GetTableList" id="appSearch">查询</el-button>
												</el-form-item>
										</el-form>
								</div>
						</div>
						<!-- 表格 -->
						<el-table :key="1" stripe id="out-table" :data="tableData" style="width: 100%"
						          v-loading="tableLoading"
						          element-loading-text="拼命加载中"
						          element-loading-spinner="el-icon-loading"
						          height="calc(100% - 80px)">
								<el-table-column label="服务器IP" align="center" prop="ip"
								                 :show-overflow-tooltip="true"></el-table-column>
								<el-table-column label="所属人" align="center" prop="createrName">
								</el-table-column>
								
								<el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
								<el-table-column label="环境" align="center" prop="envName">
								</el-table-column>
								
								<el-table-column label="业务域" align="center" prop="teamName">
								</el-table-column>
								
								<el-table-column label="状态" prop="status" align="center">
										<template slot-scope="scope">

												<span v-show="scope.row.status===0">
		                        <el-tag size="mini" type="danger">
		                            未审核
		                            <el-tooltip content="请联系相关负责人进行审核" placement="top">
		                                <i class="el-icon-warning"></i>
		                            </el-tooltip>
		                        </el-tag>
		                    </span>
												
												<span v-show="scope.row.status===1" style="color:red">
		                        <el-tag size="mini" >
		                            未接入
		                            <el-tooltip content="请测试连接状态" placement="top">
		                                <i class="el-icon-error"></i>
		                            </el-tooltip>
		                        </el-tag>
		                    </span>
												
												<span v-show="scope.row.status===2">
		                        <el-tag size="mini" type="success">
		                            接入中
                                <i class="el-icon-success"></i>
		                        </el-tag>
		                    </span>
												
												<span v-show="scope.row.status===3">
		                        <el-tag size="mini" type="warning">
		                            失联中
				                        <el-tooltip content="请测试连接状态" placement="top">
		                                <i class="el-icon-question"></i>
		                            </el-tooltip>
		                        </el-tag>
		                    </span>
										
										</template>
								</el-table-column>
								
								<el-table-column label="状态更新时间" align="center" prop="statusTime">
								</el-table-column>
								
								<el-table-column label="操作" align="center" width="200px" fixed="right">
										<template slot-scope="scope">
												<el-button type="primary" size="mini" icon="el-icon-refresh" plain :loading="scope.row.loading"
												           @click="refresh(scope.row,'')">
														刷新
												</el-button>
												
												<el-dropdown trigger="click">
														<el-button type="primary" size="mini">
																更多<i class="el-icon-arrow-down el-icon--right"></i>
														</el-button>
														<el-dropdown-menu slot="dropdown">
																<el-dropdown-item icon="el-icon-connection" @click.native="secureAccess(scope.row)" disabled>
																		测试链接状态
																</el-dropdown-item>
																<!--																<el-dropdown-item icon="el-icon-setting">应用配置</el-dropdown-item>
																																<el-dropdown-item icon="el-icon-data-analysis">部署报表</el-dropdown-item>-->
																<el-dropdown-item icon="el-icon-delete" @click.native="del(scope.row)">删除接入
																</el-dropdown-item>
														</el-dropdown-menu>
												</el-dropdown>
										</template>
								</el-table-column>
						</el-table>
				</div>
				<pagination :total="total" :page.sync="page" :limit.sync="limit" @pagination="GetTableList"></pagination>
				
				
				<el-dialog :title="addNewServer.title" :visible.sync="addNewServer.open" width="40%" @close="close">
						<el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
								<el-row style="max-height: 500px;overflow: auto">
										<el-col :span="24">
												<el-form-item label="Server IP" prop="ip">
														<el-input v-model="form.ip" clearable placeholder="请输入内容"></el-input>
												</el-form-item>
										</el-col>
										<el-col :span="24">
												<el-form-item label="业务域" prop="teamId">
														<el-select v-model="form.teamId" clearable filterable placeholder="请选择">
																<el-option
																	v-for="item in teamOptions"
																	:key="item.value"
																	:label="item.label"
																	:value="item.value">
																</el-option>
														</el-select>
												</el-form-item>
										</el-col>
										<el-col :span="24">
												<el-form-item label="环境" prop="envCode">
														<el-select v-model="form.envCode" clearable placeholder="请选择">
																<el-option
																	v-for="item in envs"
																	:key="item.value"
																	:label="item.label"
																	:value="item.value">
																</el-option>
														</el-select>
												</el-form-item>
										</el-col>
										
										<el-col :span="24">
												<!-- <el-form-item >
														<el-switch v-model="form.currentAddServer">
														</el-switch>
												</el-form-item>-->
												<el-form-item label="命令">
														<el-alert title="添加步骤" type="warning" :closable="false">
																<template slot='title'>
																		<div class="iconSize">请复制以下命令在虚拟机中执行以使平台可以访问虚拟机</div>
																		<!--																		<div class="iconSize">请按照以下步骤连接:</div>
																																				<div class="iconSize">1.请复制下列命令到需要添加的主机上，该命令运行 3分2秒 后过期</div>
																																				<div class="iconSize">2.执行1-2分钟后，新机器会自动导入「可添加列表」里</div>-->
																</template>
														</el-alert>
														
														<el-input style="margin-top:4px;width: 90%;" rows="5" readonly type="textarea"
														          v-model="link" placeholder="">
														</el-input>
														
														<el-button style="line-height:100px;margin-left:5px;" type="text" @click="copyDomain">复制
														</el-button>
												</el-form-item>
										</el-col>
								
								</el-row>
								
								<el-form-item>
										<el-button @click="close">取 消</el-button>
										<el-button type="primary" @click="submit" :loading="submitLoding">确定申请</el-button>
								</el-form-item>
						
						</el-form>
				
				</el-dialog>
		
		</div>
</template>

<script>
import Table from "@/components/tableTemp";
import pagination from "@/components/Pagination/pagination";
import {
		queryEnvs
} from "@/api/black_list"
import {
		getUseLanguageName
} from "@/utils/pipeline.js";
import {
		copyHandle
} from "@/utils/utils.js";

export default {
		name: "app",
		props: {},
		
		data() {
				// IP地址验证
				const validateIPAddress = (rule, value, callback) => {
						let regexp =
							/^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/;
						let isCorrect = true;
						if (regexp.test(value) == false) {
								isCorrect = false;
						}
						if (!value) {
								return callback(new Error("必填项不能为空"));
						} else if (!isCorrect) {
								callback(new Error("请输入正确的ip地址"));
						} else {
								callback();
						}
				};
				
				
				return {
						submitLoding: false,
						formSearch: {
								ip: ""
						},
						link: '',
						tableData: [],
						envs: [],
						teamOptions: [],
						
						total: 0,
						page: 1,
						limit: 10,
						app_id: '',
						tableLoading: false,
						form: { // 需要初始化，否则  resetFields 会导致无法输入 偶
								teamId:'',
								ip:'',
								envCode:'',
						},
						rules: {
								ip: [{required: true, validator: validateIPAddress, trigger: 'blur'}],
								teamId: [{required: true, message: '必填项不能为空', trigger: 'blur'}],
								envCode: [{required: true, message: '必填项不能为空', trigger: 'blur'}],
						},
						/*form: {
								currentAddServer: false,
								currentConfigApp: false,
								link: "bash  <(curl http://agent-install-default.oss-cn-hangzhou.aliyuncs.com/production-install.sh) 'http://devops.aliyuncs.com/api/getSnByRegion?regionId=8fd121b8-7cb3-470d-b387-b167e47de008&sign=Rekz8izapI5YNc7QJZyW7Q%3D%3D&aliyunRegion=default&timestamp=1667816961370&scope=flow' http://agent-install-default.oss-cn-hangzhou.aliyuncs.com/production-agent.tgz http://devops.aliyuncs.com/api/verifySnAndRegionId?sign=lC5SqQh%2B8eBBC9Y2FBpCiw%3D%3D 8fd121b8-7cb3-470d-b387-b167e47de008 1667816961370 default"
						},*/
						addNewServer: {
								title: "接入虚拟机",
								open: false,
								
						}
				};
		},
		watch: {},
		methods: {
				init() {
						this.queryEnv()
						this.GetTableList()
						this.getSelectData()
				},
				
				// 复制
				copyDomain() {
						copyHandle(this.link, this);
				},
				
				// 获取使用域
				getSelectData: async function () {
						let url = this.GLOBAL.baseUrl + "/app/init/teams";
						this.axios({
								method: "get",
								url: url,
						})
							.then((res) => {
									if (res.data.code === 200) {
											this.teamOptions = res.data.data.teamOptions.map(item => {
													return {
															value: item.selectKey,
															label: item.selectValue,
													}
											})
									} else {
											this.$message({
													type: 'error',
													message: res.data.message
											})
									}
							})
						
						
				},
				
				// 查询命令
				queryCommand() {
						let url = this.GLOBAL.baseUrl + "/vm/status/command";
						this.axios({
								method: "post",
								url: url,
						})
							.then((res) => {
									if (res.data.code === 200) {
											// this.link = res.data.data 暂时隐藏
									} else {
											this.$message({
													type: 'error',
													message: res.data.message
											})
									}
							}).then(() => {
								this.addNewServer.open = true;
						})
				},
				queryEnv() {
						queryEnvs().then(res => {
								if (res.code === 200) {
										this.envs = res.data.map(item => {
												return {
														value: item.selectKey,
														label: item.selectValue.toUpperCase(),
														selectValue: item.selectValue
												}
										})
								}
						})
				},
				
				// 关闭弹窗
				close() {
						this.$refs.form.resetFields()
						this.addNewServer.open = false;
						this.link = ''
				},
				
				// 刷新
				refresh(row,flag) {
						this.$set(row, 'loading', true)
						let url = this.GLOBAL.baseUrl + "/vm/instance";
						this.axios({
								method: "post",
								url: url,
								data: {
										"id": row.id,
								},
						})
							.then((res) => {
									if (res.data.code === 200) {
											this.$set(row, 'status', res.data.data.status)
											this.$set(row, 'createrName', res.data.data.createrName)
											this.$set(row, 'ip', res.data.data.ip)
											this.$set(row, 'envName', res.data.data.envName)
											this.$set(row, 'statusTime', res.data.data.statusTime)
											if (flag!==''){
													this.$message({
															type: 'success',
															message: flag
													})
											}else {
													this.$message({
															type: 'success',
															message: '刷新成功'
													})
											}
											
									} else {
											this.$message({
													type: 'error',
													message: res.data.message
											})
									}
							})
							.finally(() => {
									this.$set(row, 'loading', false)
							})
				},
				
				// 安全接入
				secureAccess(row) {
						const h = this.$createElement;
						let url = this.GLOBAL.baseUrl + "/vm/status/update";
						this.$set(row, 'downLoading', true)
						this.axios({
								method: "post",
								url: url,
								data: {
										"id": row.id,
								},
						})
							.then((res) => {
									this.$set(row, 'downLoading', false)
									if (res.data.code === 200) {
											/*this.$alert('操作成功', '提示', {
													type: 'success'
											})*/
											// this.init()
											this.refresh(row,'测试开始')
									} else {
											this.$message({
													type: 'error',
													message: res.data.message
											})
									}
							})
						
				},
				
				// 删除
				del(row) {
						const h = this.$createElement;
						let url = this.GLOBAL.baseUrl + "/vm/remove";
						this.$msgbox({
								title: '提示',
								showCancelButton: true,
								cancelButtonText: "取消",
								confirmButtonText: "确定删除",
								message: h('p', {class: 'tac'}, [
										h('i', {class: 'el-icon-question confirmIcon'}),
										h('span', {class: 'msgbox-el'}, '  确定删除该数据连接吗？'),
								]),
								beforeClose: (action, instance, done) => {
										if (action === "confirm") {
												instance.confirmButtonLoading = true;
												this.axios({
														method: "post",
														url: url,
														data: {
																"id": row.id,
														},
												})
													.then((res) => {
															instance.confirmButtonLoading = false;
															if (res.data.code === 200) {
																	done();
																	this.GetTableList()
															} else {
																	this.$message({
																			type: 'error',
																			message: res.data.message
																	})
																	done();
															}
													})
										} else {
												instance.confirmButtonLoading = false;
												done();
										}
								},
						}).then(() => {
								this.$alert('操作成功', '提示', {
										type: 'success'
								})
						})
				},
				
				// 提交审批
				submit() {
						this.$refs.form.validate((val) => {
								if (val) {
										this.submitLoding = true
										let url = this.GLOBAL.baseUrl + "/vm/add";
										const params = {
												teamId: this.form.teamId,
												envCode: this.form.envCode,
												ip: this.form.ip,
										}
										this.axios({
												method: "POST",
												url: url,
												data: params,
										})
											.then((response) => {
													const {
															code,
															data
													} = response.data
													if (code === 200) {
															
															const h = this.$createElement;
															this.$msgbox({
																	title: '提示',
																	showCancelButton: true,
																	cancelButtonText: "关闭",
																	confirmButtonText: "查看审批状态",
																	message: h('p', {class: 'marl'}, [
																			h('i', {class: 'el-icon-success icolor'}),
																			h('p', {class: 'msgbox-el'}, '接入虚拟机发起成功，请留意后续审批结果'),
																	]),
															})
																.then(() => {
																		this.$router.push("/taskCenter");
																})
																.catch((e) => {
																
																});
															
															this.GetTableList()
															this.close()
													} else {
															this.$message.error(response.data.message);
													}
											})
											.catch((response) => {
													this.$message.error(String(response));
											}).finally(() => {
												this.submitLoding = false
										})
								} else {
										return false
								}
						})
						
						
				},
				
				addServerDialog() {
						this.queryCommand()
				},
				goBack() {
						this.drawer = false
						this.image_page = 1
						this.image_limit = 10
						this.GetTableList();
				},
				GetTableList() {
						this.tableLoading = true
						let url = this.GLOBAL.baseUrl + "/vm/list";
						const params = {
								pageSize: this.limit,
								pageNum: this.page,
								ip: this.formSearch.ip,
								teamName: this.formSearch.teamName,
						};
						this.axios({
								method: "POST",
								url: url,
								data: params,
						})
							.then((response) => {
									if (response.data.code === 200) {
											response.data.data.list = response.data.data.list.map(item => {
													return {
															...item,
															editName: false,
													}
											})
											this.tableData = response.data.data.list;
											this.total = response.data.data.total;
									} else {
											this.$message.error(response.data.error);
									}
							})
							.catch((response) => {
									this.$message.error(String(response));
							}).finally(() => {
								this.tableLoading = false
						})
						
				},
				
		},
		
		computed: {
				GetLanguages() {
						return getUseLanguageName(scope.row.useLanguage);
				},
		},
		mounted() {
				this.init();
				
		},
		components: {
				"table-box": Table,
				pagination: pagination
		},
};
</script>

<style lang="scss" scoped>
/deep/ .el-select {
		width: 99%;
}

.confirmIcon {
		font-size: 25px;
		color: #f5c813;
}

.msgbox-el {
		font-size: 18px;
}

.icolor {
		color: #55f513;
		font-size: 60px;
}

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

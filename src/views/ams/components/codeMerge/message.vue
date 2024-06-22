<template>
		<div class="main flex-column">
				<div class="panel-tab">
						<el-tabs v-model="showTab" editable @edit="handleTabsEdit">
								<el-tab-pane :key="item.name" v-for="(item, index) in tabs" :label="item.title" :name="item.name">
										
										<el-row>
												<el-col :span="20">
														<el-form ref="form" :model="item.config" label-width="120px">
																<el-form-item label="应用名称">
																		<el-input v-model="appCode" readonly></el-input>
																</el-form-item>
																
																
																<el-form-item label="合并分支">
																		<el-select v-model="item.config.mergeBranch" placeholder="请选择合并分支" filterable
																		           allow-create @change="$forceUpdate()">
																				<el-option
																					v-for="item in gitBranchList"
																					:key="item"
																					:label="item"
																					:value="item">
																				</el-option>
																		</el-select>
																</el-form-item>
																
																<el-form-item label="运行环境">
																		<el-checkbox-group v-model="item.config.envCodes">
																				<el-checkbox v-for="(item,ind) in envLists" :label="item.label" :key="ind">
																						{{ item.label }}
																				</el-checkbox>
																		</el-checkbox-group>
																</el-form-item>
																
																<el-form-item label="启用通知">
																		<el-switch @change="changeEnableNotice($event,item)"
																		           v-model="item.config.isEnable"></el-switch>
																</el-form-item>
																
																<el-form-item label="通知渠道" v-if="item.config.isEnable&&item.config.isEnable">
																		<el-checkbox-group v-model="item.config.noticeTypes">
																				<el-checkbox v-for="(item,ind) in noticeTypeList" :label="item.label"
																				             :key="ind">
																						{{ item.value }}
																				</el-checkbox>
																		</el-checkbox-group>
																</el-form-item>
																
																<el-form-item label="钉钉WebHook"
																              v-if="item.config.noticeTypes.indexOf('ding-talk') > -1&&item.config.isEnable">
																		<el-input type="textarea" rows="3" v-model="item.config.noticeLink"
																		          placeholder="钉钉群机器人认证模式请使用关键字DevOps"></el-input>
																</el-form-item>
																
																<el-form-item label="邮件接收人"
																              v-if="item.config.noticeTypes.indexOf('email') > -1 && item.config.isEnable">
																		<el-select style="width:100%" v-model="item.config.noticeMembers" filterable remote
																		           reserve-keyword placeholder="请输入关键词"
																		           :remote-method="getTenantMembersByKeyword"
																		           clearable @change="clearDomainMemberOptions"
																		           @focus="clearDomainMemberOptions"
																		           multiple>
																				<el-option v-for="i in selectUserOptions" :key="i.value" :label="i.label"
																				           :value="i.value">
																				</el-option>
																		</el-select>
																</el-form-item>
																
																<el-form-item label="iCome接收人"
																              v-if="item.config.noticeTypes.indexOf('icome') > -1 && item.config.isEnable">
																		<el-select style="width:100%" v-model="item.config.noticeIcomeList" filterable remote
																		           reserve-keyword placeholder="请输入关键词"
																		           :remote-method="getIcomeMembersByKeyword"
																		           clearable
																		           @change="changeIcomeMemberOptions"
																		           @focus="focusIcomeMemberOptions"
																		           multiple>
																				<el-option v-for="(i,index) in selectIcomeUserOptions"
																				           :key="index" :label="i.label"
																				           :value="i.value">
																				</el-option>
																		</el-select>
																</el-form-item>
																
																
																<el-form-item>
																		<el-button type="primary" @click="onSubmit(item)">更新配置</el-button>
																</el-form-item>
																<el-alert title="注意" type="warning" show-icon>
																		<template v-slot="description">
																				<p>1、如启用钉钉群机器人通知，请使用关键词认证模式。关键词为DevOps </p>
																				<p>2、如果在使用过程中发现消息无法接受到，请检查配置是否有误 </p>
																		</template>
																
																</el-alert>
														</el-form>
												</el-col>
										</el-row>
								
								</el-tab-pane>
						</el-tabs>
				</div>
		
		</div>
</template>

<script>
import moment from "moment";
import {
		v4 as uuidv4
} from 'uuid';
import {
		queryEnvs
} from "@/api/black_list"

export default {
		name: 'messageNotification',
		data() {
				return {
						noticeTypeList: [
								{
										label: 'ding-talk',
										value: '钉钉'
								}, {
										label: 'email',
										value: '邮件'
								}, {
										label: 'icome',
										value: 'iCome'
								}
						],
						envLists: [],
						selectUserOptions: [],
						selectIcomeUserOptions: [],
						loading: false,
						historyList: [],
						showTab: undefined,
						appCode: "",
						appId: undefined,
						tabs: [{
								title: '合并配置',
								name: undefined,
								config: {
										appConfigUuid: undefined,
										isEnable: false,
										noticeTypeCode: 'deploy',
										envCodes: [],
										noticeTypes: [],
										noticeLink: undefined,
										noticeMembers: [],
										noticeIcomeList: [],
								}
						}],
						branchValue: '',
						gitBranchList: [],
						gitTagList: [],
				};
		},
		created: function () {
				this.appCode = this.common.getUrlKey("appCode");
				this.appId = this.common.getUrlKey("appId");
				this.loadAppMapConfig(); // 查询列表
				this.loadQueryEnvs(); // 查询env list
				this.loadQueryBranch();  // 查询 分支
		},
		components: {},
		methods: {
				
				// 查询分支
				loadQueryBranch() {
						this.axios({
								method: "GET",
								url: this.GLOBAL.baseUrl + "/pipeline-conf/branchs",
								params: {
										appId: this.appId,
								},
						})
							.then((response) => {
									if (response.status == 200) {
											this.gitBranchList = response.data.data.branch || [];
											this.gitTagList = response.data.data.tag;
									}
							})
							.catch((error) => {
									console.log("Error getGitBranchList", error);
							});
				},
				
				clearDomainMemberOptions(v) {
						this.selectUserOptions = [];
				},
				/* ------------- icome 后端接收参数和 邮件不一致，需要重新处理 否则影响*/
				changeIcomeMemberOptions(v) {
						this.selectIcomeUserOptions = [];
				},
				focusIcomeMemberOptions(v) {
						this.selectIcomeUserOptions = [];
				},
				// 查询 icome 通知人
				getIcomeMembersByKeyword(keyword) {
						if (!keyword) {
								return
						}
						
						this.select = [];
						let url = this.GLOBAL.baseUrl + "/user/tenant-member/" + keyword;
						this.axios({
								method: "get",
								url: url,
						})
							.then((res) => {
									if (res.status === 200) {
											res.data.data.forEach((element) => {
													this.selectIcomeUserOptions.push({
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
				
				// 根据ids获取用户数据
				queryUserOptionsByIds(accountIdList) {
						let url = this.GLOBAL.baseUrl + "/user/accountinfo";
						let names = []
						let ids = []
						let p = new Promise((resolve, reject)=>{
								this.axios({
										method: "POST",
										url: url,
										data: accountIdList,
								})
									.then((res) => {
											if (res.status === 200 && res.data.code===200) {
													resolve(res.data.data)
											}
									})
									.catch((err) => {
											console.log(err);
									});
						})
						p.then(res=>{
								if ( res.length>0 ){
										res.forEach( item=> {
												this.selectIcomeUserOptions.push({
														value: item.id,
														label: item.nickname + "-" + item.loginName,
												})
										})
										
								}
						})
				},
				
				/* ------------- icome 后端接收参数和 邮件不一致，需要重新处理 否则影响*/
				
				
				// 查询通知人
				getTenantMembersByKeyword(keyword) {
						if (!keyword) {
								return
						}
						
						this.select = [];
						let url = this.GLOBAL.baseUrl + "/user/tenant-member/" + keyword;
						this.axios({
								method: "get",
								url: url,
						})
							.then((res) => {
									if (res.status === 200) {
											res.data.data.forEach((element) => {
													this.selectUserOptions.push({
															value: element.selectValue,
															label: element.selectValue,
													});
											});
									}
							})
							.catch((err) => {
									console.log(err);
							});
				},
				
				// 更新数据
				onSubmit: function (item) {
						if (!item.config.mergeBranch) {
								this.$message.warning("至少选择一个合并分支");
								return
						}
						
						if (item.config.envCodes.length == 0) {
								this.$message.warning("至少选择一个运行环境");
								return
						}
						
						if (item.config.isEnable) {
								if (item.config.noticeTypes.length == 0) {
										this.$message.warning("至少选择一种通知渠道");
										return
								}
								
								if (item.config.noticeTypes.indexOf('email') > -1) {
										if (item.config.noticeMembers.length == 0) {
												this.$message.warning("至少选择一个邮件接收人");
												return
										}
								}
								if (item.config.noticeTypes.indexOf('ding-talk') > -1) {
										if (item.config.noticeLink == undefined) {
												this.$message.warning("钉钉WebHook未填写");
												return
										}
								}
								if (item.config.noticeTypes.indexOf('icome') > -1) {
										if (item.config.noticeIcomeList.length == 0) {
												this.$message.warning("至少选择一个iCome接收人");
												return
										}
								}
						}
						
						
						let appNoticeMap = {
								appId: this.appId,
								appCode: this.appCode,
								isEnable: item.config.isEnable ? 1 : 0,
								mergeBranch: item.config.mergeBranch,
								envCodes: item.config.envCodes.join(','),
								noticeTypes: item.config.noticeTypes.join(','),
								noticeTypeCode: item.config.noticeTypeCode,
								noticeLink: item.config.noticeLink,
								noticeIcome: item.config.noticeIcomeList.join(','),
								noticeMembers: item.config.noticeMembers.join(','),
								appConfigUuid: item.name
						}
						let channelList = []
						if (item.config.noticeTypes.indexOf('email') > -1) {
								channelList.push({
										channelType: 'email',
										noticeSubscribe: item.config.noticeMembers.join(','),
								})
						}
						if (item.config.noticeTypes.indexOf('ding-talk') > -1) {
								channelList.push({
										channelType: 'ding-talk',
										noticeLink: item.config.noticeLink
								})
						}
						if (item.config.noticeTypes.indexOf('icome') > -1) {
								channelList.push({
										channelType: 'icome',
										noticeIcome: item.config.noticeIcomeList.join(',')
								})
						}
						
						let url = this.GLOBAL.baseUrl + `/app/saveAppDeployMergeConfig`;
						this.axios({
								method: "post",
								url: url,
								data: appNoticeMap
						})
							.then((res) => {
									if (res.status === 200) {
											if (res.data.code === 200) {
													this.$message.success("更新成功")
													this.loadAppMapConfig(this.showTab)
													
											}
									}
							})
							.catch((err) => {
									console.log(err);
							});
						
				},
				
				// 查询 环境
				loadQueryEnvs: function () {
						queryEnvs().then(res => {
								if (res.message === 'success') {
										res.data.forEach((element) => {
												this.envLists.push({
														value: element.selectKey,
														label: element.selectValue,
												});
										});
								}
						})
				},
				
				// 查询列表
				loadAppMapConfig: function (avtiveName) {
						let url = this.GLOBAL.baseUrl + `/app/getAppDeployMergeConfig/${this.appId}`;
						this.axios({
								method: "GET",
								url: url,
						})
							.then((response) => {
									if (response.data.code === 200) {
											let dataArry = response.data.data;
											this.tabs = [];
											
											if (dataArry.length > 0) {
													for (let k = 0; k < dataArry.length; k++) {
															this.tabs.push({
																	title: '合并配置',
																	name: undefined,
																	config: {
																			appConfigUuid: undefined,
																			isEnable: false,
																			noticeTypeCode: 'deploy',
																			envCodes: [],
																			noticeTypes: [],
																			noticeLink: undefined,
																			noticeIcomeList: [],
																			noticeMembers: []
																	}
															})
													}
													
													for (let i = 0; i < dataArry.length; i++) {
															let data = dataArry[i];
															this.tabs[i].name = data.appConfigUuid
															this.tabs[i].title = "合并配置｜" + data.envCodes;
															
															if (i == 0) {
																	this.showTab = data.appConfigUuid
															}
															if (data.isEnable == 1) {
																	this.tabs[i].config.isEnable = true;
															}
															
															this.tabs[i].config.envCodes = data.envCodes.split(',')
															
															this.tabs[i].config.noticeTypeCode = 'deploy'
															
															this.tabs[i].config.mergeBranch = data.mergeBranch
															
															
															this.tabs[i].config.noticeTypes = data.noticeTypes ? data.noticeTypes.split(',') : []
															
															this.tabs[i].config.noticeLink = data.noticeLink
															
															this.tabs[i].config.noticeMembers = data.noticeMembers ? data.noticeMembers.split(',') : []
															
															if (data.noticeIcome !== undefined && data.noticeIcome){
																	if (data.noticeIcome.indexOf(',') != -1){
																			this.tabs[i].config.noticeIcomeList = data.noticeIcome.split(',')
																			this.queryUserOptionsByIds(data.noticeIcome.split(','))
																	}else{
																			this.tabs[i].config.noticeIcomeList = [data.noticeIcome]
																			this.queryUserOptionsByIds([data.noticeIcome])
																	}
																	
															}else{
																	this.tabs[i].config.noticeIcomeList = []
															}
															
															if (avtiveName){
																	this.showTab = avtiveName
															}
													}
													
											} else {
													let spanStr = uuidv4();
													this.tabs.push({
															title: '合并配置',
															name: spanStr,
															config: {
																	appConfigUuid: spanStr,
																	isEnable: false,
																	noticeTypeCode: 'deploy',
																	envCodes: [],
																	noticeTypes: [],
																	noticeLink: undefined,
																	noticeMembers: [],
																	noticeIcomeList: []
															}
													})
													
													this.showTab = spanStr
											}
											
											
									} else {
											this.$message.warning(response.data.message);
											this.tabs[0].config.appConfigUuid = uuidv4();
											this.showTab = this.tabs[0].config.appConfigUuid;
											this.tabs[0].name = this.tabs[0].config.appConfigUuid;
									}
							})
							.catch((response) => {
									this.$message.error(response.data.message);
							});
				},
				
				// 启用通知
				changeEnableNotice(e, item) {
						let enable = e ? 1 : 0;
						let uuid = item.name
						
						let url = this.GLOBAL.baseUrl + `/app/enableAppDeployMergeConfig/${uuid}/${enable}`;
						this.axios({
								method: "GET",
								url: url,
						}).then(res => {
								if (res.data.code === 200) {
										this.$message.success("操作成功")
								} else {
										this.$message({
												type: "error",
												message: "操作删除",
										});
								}
						})
						
				},
				
				handleTabsEdit(targetName, action) {
						if (action == "add") {
								let spanStr = uuidv4();
								this.tabs.push({
										title: "合并配置",
										name: spanStr,
										config: {
												isEnable: false,
												appConfigUuid: spanStr,
												noticeTypeCode: 'deploy',
												envCodes: [],
												noticeTypes: [],
												noticeLink: undefined,
												noticeMembers: []
										}
										
								})
								this.showTab = spanStr
						}
						if (action == "remove") {
								let tabs = this.tabs;
								if (tabs.length == 1) {
										this.$message.warning("至少保证存在一个配置栏");
										return;
								}
								this.$confirm("此操作将永久删除该配置, 是否继续?", "提示", {
										confirmButtonText: "确定",
										cancelButtonText: "取消",
										type: "warning",
								})
									.then(() => {
											let url = this.GLOBAL.baseUrl + `/app/deleteAppDeployMergeConfig/${targetName}`;
											this.axios({
													method: "GET",
													url: url,
											}).then(res => {
													if (res.data.code === 200) {
															let activeName = this.showTab;
															if (activeName === targetName) {
																	tabs.forEach((tab, index) => {
																			if (tab.name === targetName) {
																					let nextTab = tabs[index + 1] || tabs[index - 1];
																					if (nextTab) {
																							activeName = nextTab.name;
																					}
																			}
																	});
															}
															this.showTab = activeName;
															this.tabs = tabs.filter(tab => tab.name !== targetName);
													}
											}).catch(err => {
													this.$message({
															type: "info",
															message: "删除失败",
													});
													console.log(err)
											})
											
									})
									.catch(() => {
											this.$message({
													type: "info",
													message: "已取消删除",
											});
									});
						}
				}
		}
};
</script>

<style scoped>
/deep/ .el-select {
		width: 40%;
}
/deep/ .el-tabs__new-tab{
		border: 1px solid #0a0b0c;
		color: #0a0b0c;
}

.main {
		height: calc(100% - 80px);
		padding: 0 24px;
		overflow: auto;
}

.panel-tab {
		flex: 1;
		margin-top: 10px;
}
</style>

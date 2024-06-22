<template>
	<div class="main flex-column">
		<el-page-header @back="goBack" content="订阅通知"> </el-page-header>
		<div class="panel-tab">
			
			<el-card style="margin: 10px">
				<el-tabs v-model="showTab" editable @edit="handleTabsEdit">
					<el-tab-pane :key="item.name" v-for="(item, index) in tabs" :label="item.title" :name="item.name">
						<el-form ref="form" :model="item.config" label-width="120px">
							<el-form-item label="应用名称">
								<el-input v-model="appCode" readonly></el-input>
							</el-form-item>
							<el-form-item label="启用通知">
								<el-switch @change="changeEnableNotice($event,item)" v-model="item.config.isSubscribed"></el-switch>
							</el-form-item>
							
							<el-form-item label="通知类型" v-if="item.config.isSubscribed">
								<el-checkbox-group v-model="item.config.noticeType">
									<el-checkbox label="deploy">部署</el-checkbox>
									<el-checkbox label="edit" disabled>修改</el-checkbox>
									<el-checkbox label="build" disabled>构建</el-checkbox>
									<el-checkbox label="approve" disabled>审批</el-checkbox>
								</el-checkbox-group>
							</el-form-item>
							
							<el-form-item label="运行环境" v-if="item.config.isSubscribed">
								<el-checkbox-group v-model="item.config.envs">
									<el-checkbox v-for="(item,ind) in envs" :label="item.label" :key="ind">{{item.label}}</el-checkbox>
								</el-checkbox-group>
							</el-form-item>
							
							<el-form-item label="通知渠道" v-if="item.config.isSubscribed&&item.config.isSubscribed">
								<el-checkbox-group v-model="item.config.chanelType">
									<el-checkbox label="ding-talk">钉钉</el-checkbox>
									<el-checkbox label="email">邮件</el-checkbox>
									<el-checkbox label="icome">iCome</el-checkbox>
								</el-checkbox-group>
							</el-form-item>
							
							<el-form-item label="钉钉WebHook" v-if="item.config.chanelType.indexOf('ding-talk') > -1&&item.config.isSubscribed">
								<el-input type="textarea" v-model="item.config.dingTalkHookUrl" placeholder="钉钉群机器人认证模式请使用关键字DevOps"></el-input>
							</el-form-item>
							
							<el-form-item label="邮件接收人" v-if="item.config.chanelType.indexOf('email') > -1&&item.config.isSubscribed">
								<el-select style="width:100%" v-model="item.config.subscribers" filterable remote reserve-keyword placeholder="请输入关键词" :remote-method="getTenantMembersByKeyword" clearable @change="clearDomainMemberOptions" @focus="clearDomainMemberOptions" multiple>
									<el-option v-for="i in selectUserOptions" :key="i.value" :label="i.label" :value="i.value">
									</el-option>
								</el-select>
							</el-form-item>
								
								<el-form-item label="iCome接收人" v-if="item.config.chanelType.indexOf('icome') > -1&&item.config.isSubscribed">
								<el-select style="width:100%" v-model="item.config.noticeIcome" filterable remote reserve-keyword
								           placeholder="请输入关键词"
								           :remote-method="getIcomeMembersByKeyword"
								           clearable @change="changeIcomeMemberOptions"
								           @focus="focusIcomeMemberOptions"
								           multiple>
									<el-option v-for="(i,index) in selectIcomeUserOptions"
									           :key="index"
									           :label="i.label"
									           :value="i.value">
									</el-option>
								</el-select>
							</el-form-item>
							
							<el-form-item v-if="item.config.isSubscribed">
								<el-button type="primary" @click="onSubmit(item)">更新配置</el-button>
							</el-form-item>
							<el-alert v-if="item.config.isSubscribed" title="注意" type="warning" show-icon>
								<template v-slot="description">
									<p>1、如启用钉钉群机器人通知，请使用关键词认证模式。关键词为DevOps </p>
									<p>2、如果在使用过程中发现消息无法接受到，请检查配置是否有误 </p>
								</template>
							
							</el-alert>
						</el-form>
					</el-tab-pane>
				</el-tabs>
			
			</el-card>
		
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
	data() {
		return {
			envs: [],
			selectUserOptions: [],
			selectIcomeUserOptions: [],
			loading: false,
			historyList: [],
			showTab: undefined,
			appCode: "",
			appId: undefined,
			config: {
				isSubscribed: false,
				noticeType: [],
				envs: [],
				chanelType: [],
				dingTalkHookUrl: undefined,
				subscribers: []
			},
			tabs: [{
				title: '订阅配置',
				name: undefined,
				config: {
					appNoticeUuid: undefined,
					isSubscribed: false,
					noticeType: [],
					envs: [],
					chanelType: [],
					noticeIcome: [],
					dingTalkHookUrl: undefined,
					subscribers: []
				}
			}]
		};
	},
	created: function () {
		this.appCode = this.common.getUrlKey("appCode");
		this.appId = this.common.getUrlKey("appId");
		this.loadAppMapConfig();
		this.loadQueryEnvs();
	},
	components: {},
	methods: {
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
		clearDomainMemberOptions() {
			this.selectUserOptions = [];
		},
		
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
		onSubmit: function (item) {
			if (item.config.isSubscribed) {
				if (item.config.noticeType.length == 0) {
					this.$message.warning("至少选择一种通知类型");
					return
				}
			}
				if (item.config.envs.length == 0) {
						this.$message.warning("至少选择一个运行环境");
						return
				}
				
			if (item.config.chanelType.length == 0) {
				this.$message.warning("至少选择一种通知渠道");
				return
			}
			
			if (item.config.chanelType.indexOf('email') > -1) {
				if (item.config.subscribers.length == 0) {
					this.$message.warning("至少选择一个邮件接收人");
					return
				}
			}
			if (item.config.chanelType.indexOf('ding-talk') > -1) {
				if (item.config.dingTalkHookUrl == undefined) {
					this.$message.warning("钉钉WebHook未填写");
					return
				}
			}
				if (item.config.chanelType.indexOf('icome') > -1) {
						if (item.config.noticeIcome.length == 0) {
								this.$message.warning("至少选择一个iCome接收人");
								return
						}
				}

			var appNoticeMap = {
				appId: this.appId,
				appCode: this.appCode,
				isEnable: item.config.isSubscribed,
				envCodes: item.config.envs.join(','),
				noticeTypeCode: item.config.noticeType.join(','),
				appNoticeUuid: item.name
			}
			var channelList = []
			if (item.config.chanelType.indexOf('email') > -1) {
				channelList.push({
					channelType: 'email',
					noticeSubscribe: item.config.subscribers.join(','),
				})
			}
			if (item.config.chanelType.indexOf('ding-talk') > -1) {
				channelList.push({
					channelType: 'ding-talk',
					noticeLink: item.config.dingTalkHookUrl
				})
			}
			if (item.config.chanelType.indexOf('icome') > -1) {
				channelList.push({
					channelType: 'icome',
					noticeIcome: item.config.noticeIcome.join(',')
				})
			}
			
			var url = this.GLOBAL.baseUrl + `/app/saveAppSubScribeNoticeConfig`;
			this.axios({
				method: "post",
				url: url,
				data: {
					appMap: appNoticeMap,
					channelList: channelList
				}
			})
				.then((res) => {
					if (res.status === 200) {
						if (res.data.code === 200) {
							this.$message.success("更新成功")
							this.loadAppMapConfig()
						}
						
					}
				})
				.catch((err) => {
					console.log(err);
				});
			
		},
		goBack: function () {
			window.history.back();
		},
		loadQueryEnvs: function () {
			queryEnvs().then(res => {
				if (res.message === 'success') {
					res.data.forEach((element) => {
						this.envs.push({
							value: element.selectKey,
							label: element.selectValue,
						});
					});
				}
			})
		},
		
		loadAppMapConfig: function () {
			var url = this.GLOBAL.baseUrl + `/app/getAppSubScribeNoticeConfig/${this.appId}`;
			this.axios({
				method: "GET",
				url: url,
			})
				.then((response) => {
					if (response.data.code === 200) {
						var dataArry = response.data.data;
						if (dataArry.length > 0) {
								this.tabs = [];
								for (let k = 0; k < dataArry.length; k++) {
										this.tabs.push({
												title: '订阅配置',
												name: undefined,
												config: {
														appNoticeUuid: undefined,
														isSubscribed: false,
														noticeType: [],
														envs: [],
														chanelType: [],
														noticeIcome: [],
														dingTalkHookUrl: undefined,
														subscribers: []
												}
										})
								}
								
							for (var i = 0; i < dataArry.length; i++) {
								var data = dataArry[i];
								var dataMap = data.appMap
								var channelList = data.channels
								this.tabs[i].name = dataMap.appNoticeUuid
								this.tabs[i].title = "订阅配置｜" + dataMap.envCodes;
								if (i == 0) {
									this.showTab = dataMap.appNoticeUuid
								}
								if (dataMap.isEnable == 1) {
									this.tabs[i].config.isSubscribed = true;
								}
								this.tabs[i].config.envs = dataMap.envCodes.split(',')
								this.tabs[i].config.noticeType = dataMap.noticeTypeCode.split(',')
								
								let icomeIds = []
								for (var j = 0; j < channelList.length; j++) {
									var noticeChannelObj = channelList[j]
									if (noticeChannelObj != undefined) {
										if (noticeChannelObj.channelType == "email") {
											this.tabs[i].config.chanelType.push('email')
											this.tabs[i].config.subscribers = noticeChannelObj.noticeSubscribe.split(',')
										}
										if (noticeChannelObj.channelType == "ding-talk") {
											this.tabs[i].config.chanelType.push('ding-talk')
											this.tabs[i].config.dingTalkHookUrl = noticeChannelObj.noticeLink
										}
										if (noticeChannelObj.channelType == "icome") {
											this.tabs[i].config.chanelType.push('icome')
												if(noticeChannelObj.noticeIcome.indexOf(',') != -1){
														this.tabs[i].config.noticeIcome = noticeChannelObj.noticeIcome.split(',')
												}else{
														this.tabs[i].config.noticeIcome = [noticeChannelObj.noticeIcome]
												}
										}
									}
								}
									this.queryUserOptionsByIds(this.tabs[i].config.noticeIcome)
							}
						} else {
							this.tabs[0].config.appNoticeUuid = uuidv4();
							this.showTab = this.tabs[0].config.appNoticeUuid;
							this.tabs[0].name = this.tabs[0].config.appNoticeUuid;
						}
						
					} else {
						this.$message.warning(response.data.message);
						this.tabs[0].config.appNoticeUuid = uuidv4();
						this.showTab = this.tabs[0].config.appNoticeUuid;
						this.tabs[0].name = this.tabs[0].config.appNoticeUuid;
					}
				})
				.catch((response) => {
						console.log(response,'：response')
					// this.$message.error(response.data.message);
				});
		},
		changeEnableNotice(e, item) {
			var enable = e ? 1 : 0;
			var uuid = item.name
			
			var url = this.GLOBAL.baseUrl + `/app/enableAppSubScribeNoticeConfig/${uuid}/${enable}`;
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
				var spanStr = uuidv4();
				this.tabs.push({
					title: "订阅配置",
					name: spanStr,
					config: {
						isSubscribed: false,
						appNoticeUuid: spanStr,
						noticeType: [],
						envs: [],
						chanelType: [],
						dingTalkHookUrl: undefined,
						subscribers: []
					}
					
				})
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
						var url = this.GLOBAL.baseUrl + `/app/deleteAppSubScribeNoticeConfig/${targetName}`;
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
.main {
    height: calc(100% - 80px);
    padding: 24px;
    background: #ffffff;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}

.panel-tab {
    flex: 1;
    margin-top: 10px;
    overflow-y: auto;
}
</style>

<template>
	<div class="icome-main">
		<el-col>
			<el-row :span="24">
				<el-table :data="list" style="width: 100%">
					<el-table-column prop="key">
					</el-table-column>
					<el-table-column prop="value">
					</el-table-column>
				</el-table>
			</el-row>
		</el-col>
		<el-col style="padding-top: 20px">
			<el-row :span="24">
				<el-button plain size="small" @click="adopt">通过</el-button>
				<el-button plain size="small" @click="close">关闭</el-button>
			</el-row>
		</el-col>
	</div>
</template>

<script>
import axios from 'axios'
export default {
	name: "iComeApproval",
	data() {
		return {
			params: {
				tenantId: this.$route.params.tenantId,
				userId: this.$route.params.userId,
				appName: this.$route.params.appName,
				processInstanceId: this.$route.params.procInstId,
				taskInstanceId: this.$route.params.taskInstId,
			},
			list: [
				{
					key: "加载中",
					value: "",
				}
			],
		};
	},
	async mounted() {
		await this.login()
		await this.init()
	},
	methods: {
		async login() {
			console.log(this.$route.params)
			localStorage.removeItem("ennUnifiedCsrfToken")
			localStorage.removeItem("ennUnifiedAuthorization")
			axios.interceptors.request.use(config => {
				config.headers["X-GW-AccessKey"] = this.GLOBAL.publicAccessKey
				return config;
			});
			var response = null
			try {
				response = await axios({
					url: this.GLOBAL.publicBaseUrl + '/unify/auth/authentication',
					method: "post",
					data: {
						appId: "tenant-management-service",
						grantCode: this.$route.query.authCode,
						rememberMe: false,
						tenantId: this.params.tenantId
					}
				})
			} catch (error) {
				this.$message.error("访问服务器异常")
				console.log(error)
				return
			}
			if (response.status != 200) {
				console.log(response.status)
				this.$message.error("加载异常")
				return
			}
			if (!response.data.success) {
				this.$message.error("加载异常")
				console.log(response.data.message)
				return
			}
			localStorage.setItem("ennUnifiedCsrfToken", response.data.data.ennUnifiedCsrfToken)
			localStorage.setItem("ennUnifiedAuthorization", response.data.data.ennUnifiedAuthorizationCookie.value)
			axios.interceptors.request.use(config => {
				config.headers.ennUnifiedAuthorization = localStorage.getItem('ennUnifiedAuthorization')
				config.headers.ennUnifiedCsrfToken = localStorage.getItem('ennUnifiedCsrfToken')
				config.headers["X-GW-AccessKey"] = this.GLOBAL.publicAccessKey
				return config;
			});
		},
		async init() {
			var response = null
			try {
				response = await axios({
					url: this.GLOBAL.publicBaseUrl + '/notice/workflow/info',
					method: "post",
					data: this.params
				})
			} catch (error) {
				this.$message.error("访问服务器异常")
				console.log(error)
				return
			}

			if (response.status != 200) {
				this.$message.error("访问服务器异常")
				return
			}

			if (response.data.code != 200) {
				this.$message.error(response.data.message)
				console.log(response.data.message)
				return
			}
			console.log(response.data.data)
			this.list = response.data.data.list
		},
		async adopt() {
			var response = null
			try {
				response = await axios({
					url: this.GLOBAL.publicBaseUrl + "/notice/workflow/pass",
					method: "post",
					data: this.params
				})
			} catch (error) {
				this.$message.error("访问服务器异常")
				console.log(error)
				return
			}
			if (response.status != 200) {
				this.$message.error("访问服务器异常")
				return
			}

			if (response.data.code != 200) {
				this.$message.error(response.data.message)
				console.log(response.data.message)
				return
			}
			this.$message.success("已审批通过")
			console.log(response.data.data)

		},
		async close() {
			var response = null
			try {
				response = await this.axios({
					url: this.GLOBAL.publicBaseUrl + "/notice/workflow/cancel",
					method: "post",
					data: this.params
				})
			} catch (error) {
				this.$message.error("访问服务器异常")
				console.log(error)
				return
			}
			if (response.status != 200) {
				this.$message.error("访问服务器异常")
				return
			}

			if (response.data.code != 200) {
				this.$message.error(response.data.message)
				console.log(response.data.message)
				return
			}
			this.$message.success("审批关闭成功")
			console.log(response.data.data)
		},
	},
}
</script>

<style scoped>
.icome-main {
	margin: 0 10px;
}
</style>
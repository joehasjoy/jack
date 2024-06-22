<template>
	<div class="main">
		<div style="cursor: pointer"
			slot="header"
			class="flex flex-align-items-center header"
			@click="goBack"
		>
			<i class="el-icon-arrow-left"></i>
			<span>返回</span>
		</div>
		<el-steps :active="showStep" align-center style="margin-top: 20px">
			<el-step title="基础信息"/>
			<el-step title="配置信息"/>
			<el-step title="其他"/>
			<el-step title="提交"/>
		</el-steps>
		<el-form
			class="edit-form"
			ref="addForm"
			:model="form"
			label-position="left"
			label-width="120px"
			style="max-width: 700px; margin: 40px auto 0"
			:rules="rules"
		>
			<div v-show="showStepInfomation">
				<el-form-item label="集群类型" prop="clusterType">
					<el-select
						filterable
						style="width: 385px"
						v-model="form.clusterType"
						placeholder="请选择集群类型"
					>
						<el-option
							v-for="item in clusterTypeOptions"
							:key="item.clusterTypeName"
							:label="item.label"
							:value="item.clusterTypeName"
						/>
					</el-select>
				</el-form-item>
				
				<el-form-item label="集群名称" prop="clusterName">
					<el-input
						v-model="form.clusterName"
						maxlength="30"
						show-word-limit
						style="width: 385px"
						placeholder="请输入集群名称"
					></el-input>
				</el-form-item>
				
				<el-form-item label="集群IP" prop="clusterIp" v-if="form.clusterType!=='Redis'">
					<el-input v-model="form.clusterIp" style="width: 385px" placeholder="请输入集群IP"></el-input>
				</el-form-item>
				
				<el-form-item label="负责人:" prop="ownerName">
					<el-select
						style="width: 385px"
						v-model="form.ownerName"
						filterable
						remote
						reserve-keyword
						placeholder="请输入关键词"
						:remote-method="getTenantMembersByKeyword"
						clearable
						@change="selectMemberNameChange"
						@focus="clearMemberNameOptions"
						:loading="loading"
					>
						<el-option
							v-for="item in domainMemberOptions"
							:key="item.value"
							:label="item.label"
							:value="item"
						>
						</el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="环境" prop="environment">
					<el-select
						filterable
						style="width: 385px"
						v-model="form.environment"
						placeholder="请选择环境"
					>
						<el-option
							v-for="item in envOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						/>
					</el-select>
				</el-form-item>
				
				<el-form-item label="版本" prop="clusterVersion">
					<el-input v-model="form.clusterVersion" placeholder="请输入版本" style="width: 385px"></el-input>
				</el-form-item>
				
				<el-form-item label="用途" prop="clusterUsages">
					<el-input
						style="width: 385px"
						:autosize="{ minRows: 4 }"
						type="textarea"
						v-model="form.clusterUsages"
					></el-input>
				</el-form-item>
			</div>
			
			<div v-show="showStepStaff">
				<el-form-item
					label="是否核心:"
					prop="radio"
				>
					<el-radio v-model="form.isCore" label="1">是</el-radio>
					<el-radio v-model="form.isCore" label="2">否</el-radio>
				</el-form-item>
				
				<el-form-item
					label="共享范围:"
					prop="scopeLevel"
					v-if="form.isCore==='1'"
				>
					<el-radio v-model="form.scopeLevel" label="1" disabled>产品</el-radio>
					<el-radio v-model="form.scopeLevel" label="2">业务域</el-radio>
					<el-radio v-model="form.scopeLevel" label="3">应用</el-radio>
				</el-form-item>
				
				<el-form-item label="产品列表:" v-if="form.scopeLevel==='1'&& form.isCore=='1'" prop="includeCodes">
					<el-select v-model="form.includeCodes"
					           filterable clearable
					           placeholder="请选择产品列表"
					           style="width: 385px" multiple>
						<el-option v-for="item in optionsInfos" :key="item.value" :label="item.label" :value="item.label"/>
					</el-select>
				</el-form-item>
				
				<el-form-item label="业务域列表" prop="includeCodes" v-if="form.scopeLevel==='2'&& form.isCore=='1'">
					<el-select
						filterable
						style="width: 385px"
						v-model="form.includeCodes"
						placeholder="请选择业务域"
						multiple
					>
						<el-option
							v-for="item in teamOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="应用列表" prop="includeCodes" v-if="form.scopeLevel==='3' && form.isCore=='1'">
					<el-select
						filterable
						style="width: 385px"
						v-model="form.includeCodes"
						placeholder="请选择应用"
						multiple
					>
						<el-option
							v-for="item in appOptions"
							:key="item.value"
							:label="item.label"
							:value="item.value"
						>
						</el-option>
					</el-select>
				</el-form-item>
			
			</div>
			
			<div v-show="showStepDescription">
				<!--	其他  -->
				<el-form-item label="标记" prop="marks">
					<el-input
						style="width: 385px"
						:autosize="{ minRows: 4 }"
						type="textarea"
						v-model="form.marks"
					></el-input>
				</el-form-item>
				
				<el-form-item label="网络类型" prop="networkType">
					<el-input
						style="width: 385px"
						:autosize="{ minRows: 4 }"
						type="textarea"
						v-model="form.networkType"
					></el-input>
				</el-form-item>
			</div>
			
			
			<el-result
				v-if="showStepSubmitSuccess"
				icon="success"
				title="添加成功"
			>
				<template slot="extra">
					<el-button type="primary" @click="goBack">返回</el-button>
				</template>
			</el-result>
			<el-form-item style="margin-top: 30px">
				<el-button v-if="needPrev" @click="stepPrev()"> 上一步</el-button>
				<el-button v-if="needNext" @click="stepNext()"> 下一步</el-button>
				<el-button
					v-show="showStepDescription"
					type="danger"
					@click="submitApply()"
				>
					提交
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
const StepInfomation = 0;
const StepStaff = 1;
const StepDescription = 2;
const StepSubmit = 3;
const StepSubmitSuccess = 4;

const StepStart = StepInfomation;
const StepEnd = StepDescription;

const baseUrlThrower = function (response) {
	if (response.status != 200) {
		throw "网络错误";
	}
	if (response.data.code != 200) {
		throw response.data.message;
	}
	return response;
};
import {addMiddleApi, modifyMiddleApi} from "../../api/api";

export default {
	data() {
		let validatorIP = (rule, value, callback) => {
			let reg =
				/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
			if (!reg.test(value)) {
				callback(new Error("请输入正确的IP地址"));
			} else {
				callback() // 添加成功回调
			}
		};
		return {
			activeName: "first",
			loading: false,
			//集群下拉
			clusterTypeOptions: [],
			// 环境下拉
			envOptions: [],
			form: {
				clusterName: "",
				clusterIp: "",
				clusterType: "",
				clusterVersion: "",
				environment: "",
				networkType: "",
				clusterUsages: "",
				marks: "",
				ownerId: "",
				ownerName: "",
				isCore: "2",
				scopeLevel: "",
				includeCodes: [],
			},
			//产品列表
			optionsInfos: [],
			
			teamOptions: [],
			appOptions: [],
			domainMemberOptions: [],
			
			// 校验规则
			rules: {
				clusterType: [{
					required: true, message: "请选择集群类型", trigger: ["blur", "change"]
				}],
				clusterName: [{
					required: true, message: "请输入集群名称", trigger: "blur"
				}],
				clusterIp: [{
					required: true, validator: validatorIP, trigger: "blur",
					
				}],
				ownerName: [{
					required: true, message: "请选择负责人", trigger: ["blur", "change"],
				}],
				environment: [{
					required: true, message: "请选择环境", trigger: ["blur", "change"],
				}],
				clusterVersion: [{
					required: true, message: "请输入版本", trigger: "blur"
				}],
				clusterUsages: [{
					required: true, message: "请输入用途", trigger: "blur"
				}],
				marks: [{
					required: false, message: "请输入标记", trigger: "blur"
				}],
				networkType: [{
					required: false, message: "请输入网络类型", trigger: "blur"
				}],
				isCore: [{
					required: true, message: "请选择是否核心应用", trigger: "blur",
				}],
				scopeLevel: [{
					required: true, message: "请选择优先级", trigger: ["blur", "change"],
				}],
				includeCodes: [{
					required: true, message: "请选择数据", trigger: ["change"],
				}],
			},
			stepIndex: StepStart,
			submitSuccess: false,
		};
	},
	watch: {
		"form.scopeLevel"(){
			return this.form.includeCodes = []
		},
		"form.isCore"(){
			return this.form.scopeLevel = ''
		}
	},
	computed: {
		showStepInfomation() {
			return this.stepIndex == StepInfomation;
		},
		showStepStaff() {
			return this.stepIndex == StepStaff;
		},
		showStepDescription() {
			return this.stepIndex == StepDescription;
		},
		showStepSubmitSuccess() {
			return this.stepIndex == StepSubmitSuccess;
		},
		showStep() {
			if (this.submitSuccess) {
				return StepSubmit;
			}
			return this.stepIndex;
		},
		needNext() {
			return this.stepIndex < StepEnd;
		},
		needPrev() {
			return this.stepIndex > StepStart && this.stepIndex <= StepEnd;
		},
	},
	methods: {
		getAppData: async function () {
			let url = this.GLOBAL.baseUrl + "/app/list";
			let response = null;
			try {
				response = baseUrlThrower(
					await this.axios({
						method: "GET",
						url: url,
					})
				);
			} catch (e) {
				this.$notify({
					title: "错误",
					message: e.toString(),
					type: "error",
				});
				return;
			}
			if (response.data.data.appOptions == null) {
				response.data.data.appOptions = [];
			}
			//所属业务域下拉列表
			response.data.data.forEach((element) => {
				this.appOptions.push({
					value: element.id,
					label: element.code,
				});
			});
		},
		getTeamsData: async function () {
			let url = this.GLOBAL.baseUrl + "/app/init/teams";
			let response = null;
			try {
				response = baseUrlThrower(
					await this.axios({
						method: "GET",
						url: url,
					})
				);
			} catch (e) {
				this.$notify({
					title: "错误",
					message: e.toString(),
					type: "error",
				});
				return;
			}
			if (response.data.data.teamOptions == null) {
				response.data.data.teamOptions = [];
			}
			//所属业务域下拉列表
			response.data.data.teamOptions.forEach((element) => {
				this.teamOptions.push({
					value: element.selectKey,
					label: element.selectValue,
				});
			});
		},
		
		getMiddlewareSelectData() {
			let url = this.GLOBAL.baseUrl + "/middleware/init/condition";
			this.axios({
				method: "get",
				url: url,
			})
				.then((res) => {
					if (res.status === 200) {
						//类型下拉列表
						res.data.data.clusterTypeList.forEach((element) => {
							this.clusterTypeOptions.push({
								clusterTypeName: element.selectKey,
								label: element.selectValue,
							});
						});
						//环境下拉列表
						res.data.data.envList.forEach((element) => {
							this.envOptions.push({
								value: element.selectKey,
								label: element.selectValue,
								labelT: element.selectValue,
							});
						});
					}
				})
				.catch((err) => {
				});
		},
		// 获取 产品列表
		initOptionsInfos() {
			let url = this.GLOBAL.baseUrl + "/product/infos";
			this.axios({
				method: "get",
				url: url,
			})
				.then((res) => {
					if (res.status === 200) {
						res.data.data.forEach((element) => {
							this.optionsInfos.push({
								value: element.id,
								label: element.name,
							});
						});
					}
				})
				.catch((err) => {
					console.log(err);
				});
		},
		stepNext() {
			if (this.stepIndex == StepEnd) {
				return;
			}
			this.stepIndex = this.stepIndex + 1;
		},
		stepPrev() {
			if (this.stepIndex == StepStart) {
				return;
			}
			this.stepIndex = this.stepIndex - 1;
		},
		
		// 选择负责人
		selectMemberNameChange(e) {
			console.log(e, '----')
			this.form.ownerId = e.value
			this.form.ownerName = e.label
		},
		//关键字搜索租户成员
		getTenantMembersByKeyword: async function (keyword) {
			this.domainMemberOptions = [];
			let url = this.GLOBAL.baseUrl + "/user/tenant-member/" + keyword;
			let response = null;
			try {
				response = baseUrlThrower(
					await this.axios({
						method: "get",
						url: url,
					})
				);
			} catch (e) {
				this.$notify({
					title: "错误",
					message: e.toString(),
					type: "error",
				});
				return;
			}
			response.data.data.forEach((element) => {
				this.domainMemberOptions.push({
					value: element.selectKey,
					label: element.selectValue,
				});
			});
		},
		//清空搜索关键字搜索租户成员结果
		clearMemberNameOptions() {
			this.domainMemberOptions = [];
		},
		
		submitApply() {
			this.$refs.addForm.validate(async (valid) => {
				if (!valid) {
					this.$alert(
						"部分字段校验未通过！请点击上一步，检查、修改后重试。",
						"错误",
						{
							type: "error",
						}
					);
					return;
				}
				let params = {
					...this.form,
					clusterIpPort: ''
				};
				params.includeCodes = params.includeCodes.toString()
				let res = await addMiddleApi(params);
				let {code} = res;
				if (code === 200) {
					this.$notify({
						title: "成功",
						message: "添加成功",
						type: "success",
					});
					this.form = {};
					this.stepIndex = StepSubmitSuccess;
				} else {
					this.$notify({
						title: "错误",
						message: res.message,
						type: "success",
					});
				}
			});
		},
		
		// 返回上一页
		goBack: function () {
			window.history.back();
		},
	},
	mounted() {
		this.getMiddlewareSelectData(); // 获取集群
		this.getTeamsData(); // 获取业务域
		this.getAppData(); // 获取应用
		
		this.initOptionsInfos();
	},
	components: {},
};
</script>

<style scoped lang="scss">
.main {
	background-color: #f4f4f4;
	box-sizing: border-box;
	height: calc(100% - 80px);
	background: white;
	padding: 20px;
	box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
	border-radius: 8px;
	overflow-y: auto;
}
</style>

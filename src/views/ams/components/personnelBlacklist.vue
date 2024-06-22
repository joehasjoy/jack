<template>
		<div>
				<!-- 搜索 -->
				<el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
						<el-form-item>
								<el-button
									size="small"
									type="primary"
									icon="el-icon-plus"
									@click="clickAdd"
								>新增
								</el-button
								>
								<el-button
									size="small"
									type="danger"
									plain
									icon="el-icon-delete"
									@click="batchDeletion"
								>批量删除
								</el-button
								>
						</el-form-item>
				</el-form>
				<el-table :data="tableList" size="mini"  @selection-change="handleSelectionChange">
						<el-table-column
							type="selection"
							width="55">
						</el-table-column>
						
						<el-table-column
							prop="accountName"
							label="限制人员"
							align="center"
						></el-table-column>
						
						<el-table-column
							prop="envName"
							min-width="150"
							label="限制环境"
							align="center"
						></el-table-column>
						
						<el-table-column
							min-width="150"
							label="限制操作"
							align="center"
						>
								<template slot-scope="scope">
										<span v-for="item in operateTypeOptions" >
												{{ scope.row.operateType === item.value ? item.label : "" }}
										</span>
								</template>
						</el-table-column>
						
						<el-table-column
							prop="effectTimeStr"
							min-width="150"
							label="限制开始时间"
							align="center"
						></el-table-column>
						
						<el-table-column
							prop="overEffectTimeStr"
							min-width="150"
							label="限制结束时间"
							align="center"
						></el-table-column>
						
						<el-table-column
							prop="describes"
							min-width="150"
							label="限制原因"
							align="center"
						></el-table-column>
						
						<el-table-column
							prop="createUserName"
							min-width="150"
							label="创建人"
							align="center"
						></el-table-column>
						
						<el-table-column
							prop="createTime"
							min-width="150"
							label="创建时间"
							align="center"
						></el-table-column>
						
						<el-table-column label="操作" align="center" min-width="150" fixed="right">
								<template slot-scope="scope">
										<el-button @click="clickUpdate(scope.row)" type="text"
										>修改
										</el-button
										>
										<el-button @click="deleteBlackPeo(scope.row.id)" type="text"
										>删除
										</el-button
										>
								</template>
						</el-table-column>
				</el-table>
				<pagination
					v-show="total > 0"
					:total="total"
					:page.sync="page"
					:limit.sync="limit"
					@pagination="queryListBlackPeo"
				></pagination>
				
				<el-dialog
					:title="dialogTitle"
					:visible.sync="dialogVisible"
					width="590px"
					@close="closeAddBaseImageDialog"
				>
						<div class="flex flex-justify-content-center">
								<el-form
									ref="form"
									:model="form"
									:rules="rules"
									label-width="130px"
									label-position="right"
								>
										<el-form-item label="限制人员:" prop="accountId">
												<el-select
													v-model="form.accountName"
													filterable
													remote
													reserve-keyword
													placeholder="请输入关键词"
													:remote-method="getTenantMembersByKeyword"
													:loading="loading"
													clearable
													@change="selectChange1"
													:disabled="disabled"
												>
														<el-option
															v-for="item in personnelOptions"
															:key="item.value"
															:label="item.label"
															:value="item"
														>
														</el-option>
												</el-select>
										</el-form-item>
										
										<el-form-item label="限制操作:" prop="operateType">
												<el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1" @change="handleCheckAllChange1" v-show="!disabled">全选</el-checkbox>
												<el-checkbox-group
													v-model="form.operateType"
													@change="changeCheckbox1"
												>
														<el-checkbox :disabled="disabled" v-for="(item,i) in operateTypeOptions" :label="item.value" :key="i">{{item.label}}</el-checkbox>
												</el-checkbox-group>
												
										</el-form-item>
										
										<el-form-item label="限制环境:">
												<el-checkbox :indeterminate="isIndeterminate2" v-model="checkAll2" @change="handleCheckAllChange2" v-show="!disabled">全选</el-checkbox>
												
												<el-checkbox-group
													v-model="form.envId"
													@change="changeCheckbox2"
												>
														<el-checkbox :disabled="disabled" v-for="(item,ind) in envs" :label="item.value" :key="ind">{{item.label}}</el-checkbox>
												</el-checkbox-group>
												
										</el-form-item>
										
										<el-form-item label="限制时间:">
												<el-col :span="11">
														<el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择生效时间" v-model="form.effectTimeStr" style="width: 100%;"></el-date-picker>
												</el-col>
												<el-col class="line" :span="2" style="text-align: center;">至</el-col>
												<el-col :span="11">
														<el-date-picker type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择失效时间" v-model="form.overEffectTimeStr" style="width: 100%;"></el-date-picker>
												</el-col>
										</el-form-item>
										
										
										<el-form-item label="限制原因:" prop="describes">
												<el-input
													type="textarea"
													:rows="2"
													v-model="form.describes"
													placeholder="请输入限制原因"
												></el-input>
										</el-form-item>
										
										<el-form-item>
												<el-button size="small" type="primary" @click="confirmForm">确 认</el-button>
												<el-button size="small" @click="closeAddBaseImageDialog"
												>取 消
												</el-button
												>
										</el-form-item>
								</el-form>
						</div>
				</el-dialog>
		</div>
</template>

<script>
import {queryEnvs, queryPersonnel, blackAdd, queryConditionList, blackUpdate} from "@/api/black_list"
import {blackDelete, blackBatchDeletion} from "../../../api/black_list";
import pagination from "@/components/Pagination/pagination";

export default {
		name: "personnelBlacklist",
		components: {
				pagination: pagination,
		},
		mounted() {
				this.queryListBlackPeo();
				this.loadQueryEnvs()
		},
		data() {
				return {
						isIndeterminate1: true,
						checkAll1: false,
						isIndeterminate2: true,
						checkAll2: false,
						
						disabled: false,
						checkListEnvName:[],
						rules: {
								accountId: [
										{ required: true, message: '请输入关键字查询', trigger: 'blur'},
								],
								operateType: [
										{ required: true, message: '请选择限制操作类型', trigger: 'blur'}
								],
								describes: [
										{ required: true, message: '请输入限制原因', trigger: 'blur'}
								],
						},
						loading: false,
						form: {
								operateType:[],
								envId:[],
						},
						envs: [],
						time: "",
						operateTypeOptions: [{
								value: 1,
								label: '限制常规发布'
						}, {
								value: 2,
								label: '限制新建版本'
						}, {
								value: 3,
								label: '限制立即创建'
						}, {
								value: 4,
								label: '限制立即发布'
						}],
						personnelOptions: [],
						
						tableList: [],
						dialogVisible: false,
						dialogTitle: "",
						total: 0,
						page: 1,
						limit: 10,
						
						bathcDeletionIds: [],
				};
		},
		created() {
		},
		methods: {
				// 限制操作 全选
				handleCheckAllChange1(val){
						let arrayValue = [];
						this.operateTypeOptions.forEach(item =>{
								arrayValue.push(item.value)
						})
						
						this.form.operateType = val ? arrayValue : [];
						this.isIndeterminate1 = false;
				},
				// 限制操作
				changeCheckbox1(value){
						let checkedCount = value.length;
						this.checkAll1 = checkedCount === this.operateTypeOptions.length;
						this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.operateTypeOptions.length;
				},
				
				// 限制环境 全选
				handleCheckAllChange2(val){
						let arrayValue = [];
						this.envs.forEach(item =>{
								arrayValue.push(item.value)
						})
						
						this.form.envId = val ? arrayValue : [];
						this.isIndeterminate2 = false;
				},
				// 限制环境
				changeCheckbox2(value){
						let checkedCount = value.length;
						this.checkAll2= checkedCount === this.envs.length;
						this.isIndeterminate2 = checkedCount > 0 && checkedCount < this.envs.length;
				},
				// 将envName拿出来
				handleEnvNames(){
						let names=[]
						this.envs.forEach(item => {
								this.form.envId.forEach(item2 => {
										if (item.value === item2 ){
												names.push(item.label)
										}
								})
						})
						this.form.envName = names.toString()
						console.log(names)
				},
				// 点击新增
				clickAdd() {
						this.dialogVisible = true;
						this.dialogTitle = "新增人员黑名单"
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
				// 选择人
				selectChange1(e) {
						this.resolveBug()
						this.form.accountId = e.value
						this.form.accountName = e.label
				},
				// 选择限制发布
				selectChange2(e) {
						this.resolveBug()
						this.form.operateType = e.value
						this.form.operateTypeName = e.label
				},
				// 选择限制环境
				selectChange3(e) {
						this.resolveBug()
						this.form.envId = e.value
						this.form.envName = e.label
				},
				
				resolveBug() {
						this.$forceUpdate();
				},
				
				//关键字搜索租户成员
				getTenantMembersByKeyword(keyword) {
						this.personnelOptions = [];
						queryPersonnel(keyword).then(res => {
								res.data.forEach((element) => {
										this.personnelOptions.push({
												value: element.selectKey,
												label: element.selectValue,
										});
								});
						})
				},
				// 取出发布限制的对应的值
				handleOperateTypeOptions(value){
						this.operateTypeOptions.forEach(item =>{
								if (value === item.value ){
										this.form.operateType = item.value
										this.form.operateTypeName = item.label
								}
						})
				},
				// 查询list
				queryListBlackPeo: function () {
						queryConditionList({
								"accountId": "",
								"isDelete":"1",
								"operateType": "",
								pageSize: this.limit,
								pageNumber: this.page,
						}).then(res => {
								if(res.code === 200){
										res.data.list.map(item =>{
												return {
														...item,
														operateTypeName: "",
												}
										})
										this.tableList = res.data.list
										this.total = res.data.total
										this.pageNum = res.data.pageNum
										this.pageSize = res.data.pageSize
								}
						})
				},
				
				//修改按钮
				clickUpdate(row) {
						//打开dialog
						this.dialogVisible = true;
						this.disabled = true
						this.dialogTitle = "修改人员黑名单"
						let obj = {
								id: row.id,
								accountId: row.accountId,
								accountName: row.accountName,
								describes: row.describes,
								effectTimeStr: row.effectTimeStr,
								envId: row.envId === undefined ? [] : [row.envId],
								envName: row.envName,
								isDelete: row.isDelete,
								operateType: [row.operateType],
								overEffectTime: row.overEffectTime,
								overEffectTimeStr: row.overEffectTimeStr,
						}
						this.form = JSON.parse(JSON.stringify(obj))
						console.log(this.form)
						this.handleOperateTypeOptions(this.form.operateType)
				},
				
				// 多选数据删除
				handleSelectionChange(val) {
						this.bathcDeletionIds = val
				},
				batchDeletion(){
							if (this.bathcDeletionIds.length < 2){
									this.$message.warning('请选择2条以上数据进行批量删除')
									return false
							}
							let ids = []
							this.bathcDeletionIds.forEach(item=>{
									ids.push(item.id)
							})
						
						this.$confirm("此操作将批量删除该数据, 是否继续?", "提示", {
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								type: "warning",
						})
							.then(() => {
									blackBatchDeletion(ids.toString()).then(res =>{
											if (res.code===200){
													this.$message({message: "操作成功", type: "success"});
													this.queryListBlackPeo();
											}else{
													this.$message.error("操作失败，请重试");
											}
									})
							})
							.catch(() => {
									this.$message({
											type: "info",
											message: "已取消批量删除",
									});
							});
				},
				
				//删除
				deleteBlackPeo(id) {
						this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								type: "warning",
						})
							.then(() => {
									blackDelete(id).then(res =>{
											if (res.code===200){
													this.$message({message: "操作成功", type: "success"});
													this.queryListBlackPeo();
											}else{
													this.$message.error("操作失败，请重试");
											}
									})
							})
							.catch(() => {
									this.$message({
											type: "info",
											message: "已取消删除",
									});
							});
				},
				
				//保存
				confirmForm() {
						// 保存之前先处理环境name
						this.handleEnvNames()
						let requestUrl;
						if (this.dialogTitle === "新增人员黑名单") {
								requestUrl = blackAdd
							}else{
								requestUrl = blackUpdate
								this.form.envId = this.form.envId.toString()
								this.form.operateType = this.form.operateType.toString()
								delete this.form.operateTypeName
						}
						
						this.$refs.form.validate(async (valid) => {
								if (valid) {
										requestUrl(this.form).then((res) => {
												if (res.code === 200) {
														this.$refs.form.resetFields();
														this.$message({
																message: res.message,
																type: "success",
														});
														this.queryListBlackPeo();
														this.closeAddBaseImageDialog();
												} else {
														this.$message.error(res.message);
												}
										})
											.catch((err) => {
													alert(err);
													this.closeAddBaseImageDialog();
													
											});
								}
						});
				},
				// 关闭
				closeAddBaseImageDialog() {
						this.dialogVisible = false;
						this.isIndeterminate2 = true;
						this.disabled = false
						this.$refs.form.resetFields();
						this.checkListEnvName = []
						this.form = {
								operateType: [],
								envId: [],
								envName: "",
								accountName: "",
						};
				},
		},
};
</script>
<style lang="scss" scoped>
/deep/ .el-select {
		width: 100%;
}

/deep/ .el-range-editor.el-input__inner {
		width: 100%;
}
</style>
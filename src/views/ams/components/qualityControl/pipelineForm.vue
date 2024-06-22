<template>
	<div>
		<!-- 搜索 -->
		<el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
			<el-form-item>
				<el-button size="small" type="primary" icon="el-icon-plus" @click="clickAdd">新增
				</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="tableList.slice((currentPage - 1) * pageSize, currentPage * pageSize)" size="mini">
			<!--						<el-table-column
							type="selection"
							width="55">
						</el-table-column>-->

			<el-table-column prop="pipelineName" label="平台门禁名称" align="center"></el-table-column>

			<el-table-column prop="pipelineId" min-width="150" label="流水线ID" align="center"></el-table-column>


			<el-table-column prop="createrName" min-width="150" label="添加人" align="center"></el-table-column>

			<el-table-column prop="createTime" min-width="150" label="添加时间" align="center"></el-table-column>

			<el-table-column label="操作" align="center" min-width="150" fixed="right">
				<template slot-scope="scope">
					<el-button @click="deleteById(scope.row.pipelineId)" type="text">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<pagination :total="tableList.length" :page.sync="currentPage" :limit.sync="pageSize"
			@pagination="handleCurrentChange"></pagination>


		<el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="25%" @close="close">
			<el-form ref="form" :model="form" :rules="rules" label-width="130px" label-position="right">
				<el-form-item label="平台门禁名称:" prop="pipelineName">
					<el-input v-model="form.pipelineName" placeholder="请输入平台门禁名称"></el-input>
				</el-form-item>

				<el-form-item label="流水线ID:" prop="pipelineId">
					<el-input v-model="form.pipelineId" placeholder="请输入流水线ID"></el-input>
				</el-form-item>

				<el-form-item>
					<el-button size="small" type="primary" @click="save">确 认</el-button>
					<el-button size="small" @click="close">取 消
					</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { queryEnvs, queryConditionList } from "@/api/black_list"
import pagination from "@/components/Pagination/pagination";

export default {
	name: "pipelineForm",
	components: {
		pagination: pagination,
	},

	data() {
		return {
			isIndeterminate1: true,
			checkAll1: false,
			isIndeterminate2: true,
			checkAll2: false,

			disabled: false,
			checkListEnvName: [],
			rules: {
				pipelineId: [
					{ required: true, message: '请输入流水线ID', trigger: 'blur' },
				],
				pipelineName: [
					{ required: true, message: '请输入平台门禁名称', trigger: 'blur' }
				],
			},
			loading: false,
			form: {
				pipelineId: '',
				pipelineName: ''
			},
			envs: [],
			tableList: [],
			dialogVisible: false,

			dialogTitle: "",
			total: 0,
			currentPage: 1,
			pageSize: 10,
		};
	},
	created() {
	},
	mounted() {
		this.init();
		this.loadEnvs()
	},
	methods: {
		handleCurrentChange(val) {
			console.log(val)
			this.currentPage = val.page
			this.pageSize = val.limit
		},
		init() {
			let url = this.GLOBAL.baseUrl + "/access_control/pipeline/list";
			this.axios({
				method: "post",
				url: url,
			})
				.then((res) => {
					if (res.data.code === 200) {
						console.log(res.data, '----res')
						this.tableList = res.data.data
						this.$message({
							type: 'success',
							message: `加载完毕`
						})
					} else {
						this.$message({
							type: 'error',
							message: res.data.message
						})
					}
				})
		},

		// 点击新增
		clickAdd() {
			this.dialogVisible = true;
			this.dialogTitle = "新增平台门禁"
		},

		loadEnvs: function () {
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

		// 查询list
		queryListBlackPeo: function () {
			queryConditionList({
				"accountId": "",
				"isDelete": "1",
				"operateType": "",
				pageSize: this.limit,
				pageNumber: this.page,
			}).then(res => {
				if (res.code === 200) {
					res.data.list.map(item => {
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

		//删除
		deleteById(pipelineId) {
			this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					let url = this.GLOBAL.baseUrl + "/access_control/pipeline/remove";
					this.axios({
						method: "post",
						url: url,
						data: {
							pipelineId: pipelineId,
						}
					})
						.then((res) => {
							if (res.data.code === 200) {
								this.$message({
									type: 'success',
									message: `删除成功`
								})
								this.init();
							} else {
								this.$message({
									type: 'error',
									message: res.data.message
								})
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
		save() {
			console.log(this.form, '------')

			this.$refs.form.validate(async (valid) => {
				if (valid) {
					let url = this.GLOBAL.baseUrl + "/access_control/pipeline/add";
					this.axios({
						method: "post",
						url: url,
						data: this.form
					})
						.then((res) => {
							if (res.data.code === 200) {
								this.$message({
									type: 'success',
									message: `新增成功`
								})
								this.close()
								this.init();
							} else {
								this.$message({
									type: 'error',
									message: res.data.message
								})
							}
						})
				}
			});
		},
		// 关闭
		close() {
			this.dialogVisible = false;
			this.$refs.form.resetFields();
			this.form = {
				pipelineId: '',
				pipelineName: ''
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
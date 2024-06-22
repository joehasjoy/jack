<template>
	<div>
		<!-- 搜索 -->
		<el-form :inline="true" class="demo-form-inline" @submit.native.prevent>
			<el-form-item>
				<el-button
					size="small"
					type="primary"
					icon="el-icon-plus"
					@click="toAddBaseImageDialog"
				>新增</el-button
				>
			</el-form-item>
		</el-form>
		<el-table
			size="small"
			:data="imageDatas.slice((currentPage - 1) * pageSize,  currentPage * pageSize) " stripe="">
			<el-table-column
				prop="imageDes"
				label="描述"
				align="center"
			></el-table-column>
			<el-table-column
				prop="image"
				min-width="200"
				label="镜像地址"
				align="center"
			></el-table-column>
			
			<el-table-column
				label="类型"
				prop="type"
				width="120"
				align="center"
				:show-overflow-tooltip="true"
			>
				<template slot-scope="scope">
					<span v-if="scope.row.type === '1'">Java</span>
					<span v-if="scope.row.type === '2'">Python</span>
					<span v-if="scope.row.type === '3'">Go</span>
					<span v-if="scope.row.type === '4'">NodeJs</span>
					<span v-if="scope.row.type === '5'">JavaScript</span>
				</template>
			</el-table-column>
			
			<el-table-column
				prop="creatorName"
				min-width="150"
				label="添加人"
				align="center"
			>
				<template slot-scope="scope">
					<span v-if="scope.row.creatorName">{{ scope.row.creatorName }}</span>
					<span v-else > - </span>
				</template>
			</el-table-column>
			
			<el-table-column
				prop="createTime"
				min-width="150"
				label="添加时间"
				align="center"
			>
				<template slot-scope="scope">
					<span v-if="scope.row.createTime">{{ scope.row.createTime }}</span>
					<span v-else > - </span>
				</template>
			</el-table-column>
			
			<el-table-column label="操作" align="center" fixed="right">
				<template slot-scope="scope">
					<el-button @click="toUpdateBaseImageDialog(scope.row.id)" type="text"
					>修改</el-button
					>
					<el-button @click="deleteBaseImage(scope.row.id)" type="text"
					>删除</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		
		<!-- 分页 -->
		<pagination
			:total="imageDatas.length"
			:page.sync="currentPage"
			:limit.sync="pageSize"
			@pagination="handleCurrentChange"
		></pagination>

		
		<el-dialog
			title="新增基础镜像"
			:visible.sync="addBaseImageVisible"
			width="590px"
		>
			<div class="flex flex-justify-content-center">
				<el-form
					ref="addBaseImageForm"
					:model="baseImageForm"
					label-width="100px"
					label-position="left"
				>
					<el-form-item label="基础镜像地址:" prop="name" hidden="true">
						<el-input
							v-model="baseImageForm.id"
							placeholder="请输入基础镜像地址"
							style="width: 286px"
						></el-input>
					</el-form-item>
					
					<el-form-item label="基础镜像地址:" prop="name">
						<el-input
							v-model="baseImageForm.image"
							placeholder="请输入基础镜像地址"
							style="width: 286px"
						></el-input>
					</el-form-item>
					
					<el-form-item label="镜像描述:" prop="teamCode">
						<el-input
							v-model="baseImageForm.imageDes"
							placeholder="请输镜像描述"
							style="width: 286px"
						></el-input>
					</el-form-item>
					
					<el-form-item label="镜像类型:" required>
						<el-select
							v-model="baseImageForm.type"
							placeholder="请选择镜像类型"
							style="width: 286px"
						>
							<el-option
								v-for="item in imageOptions"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							>
							</el-option>
						</el-select>
					</el-form-item>
					
					<el-form-item>
						<el-button size="small" type="primary" @click="addBaseImage">确 认</el-button>
						<el-button size="small"  @click="closeAddBaseImageDialog"
						>取 消</el-button
						>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import pagination from "@/components/Pagination/pagination";

export default {
	name: "BaseImageComponent",
	components: {
		pagination: pagination,
	},
	mounted() {
		this.GetBasicImages();
	},
	data() {
		return {
			imageDatas: [],
			addBaseImageVisible: false, //新增基础镜像
			currentPage:1,
			pageSize: 10,
			baseImageForm: {
				id: "",
				image: "",
				imageDes: "",
				type: "",
			},
			imageOptions: [
				{
					value: "1",
					label: "Java",
				},
				{
					value: "2",
					label: "Python",
				},
				{
					value: "3",
					label: "Go",
				},
				{
					value: "4",
					label: "NodeJs",
				},
				{
					value: "5",
					label: "JavaScript",
				},
			],
		};
	},
	methods: {
		handleSizeChange(val) {
			console.log(val)
			this.currentPage = val.page
			this.pageSize = val.limit
		},
		handleCurrentChange(val) {
			console.log(val)
			this.currentPage = val.page
			this.pageSize = val.limit
		},
		//获取基础镜像
		GetBasicImages: function () {
			let basicImageURL = this.GLOBAL.baseUrl + "/pipeline/base-image/all";
			this.axios({
				method: "get",
				url: basicImageURL,
				params: {
					tenantId: localStorage.getItem("originTenantId"),
					type: this.imageType,
				},
			})
				.then((response) => {
					if ((response.code = 200)) {
						if (response.data.data != null) {
							this.imageDatas = response.data.data;
						}
					} else {
						this.$message({
							type: "error",
							message: "获取数据失败",
						});
					}
				})
				.catch((response) => {
					console.log("fail to get account config info", response);
				});
		},
		//打开新增基础镜像
		toAddBaseImageDialog() {
			this.addBaseImageVisible = true;
			this.baseImageForm = {};
		},
		//打开修改基础镜像
		toUpdateBaseImageDialog(id) {
			//打开dialog
			this.addBaseImageVisible = true;
			//查询数据赋值
			let url = this.GLOBAL.baseUrl + "/base/image/get/" + id;
			
			this.axios({
				method: "get",
				url: url,
				params: {},
			})
				.then((res) => {
					if (res.data.code === 200) {
						this.baseImageForm = res.data.data;
					} else {
						this.$message.error("操作失败，请重试");
					}
				})
				.catch((err) => {
					alert(err);
					this.addBaseImageVisible = false;
				});
		},
		//删除基础镜像
		deleteBaseImage(id) {
			this.$confirm("此操作将永久删除该基础镜像, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					let url = this.GLOBAL.baseUrl + "/base/image/delete/" + id;
					this.axios({
						method: "get",
						url: url,
						params: {},
					})
						.then((res) => {
							if (res.data.code === 200) {
								this.$message({ message: "操作成功", type: "success" });
								this.GetBasicImages();
							} else {
								this.$message.error("操作失败，请重试");
							}
						})
						.catch((err) => {
							alert(err);
						});
				})
				.catch(() => {
					this.$message({
						type: "info",
						message: "已取消删除",
					});
				});
		},
		//保存基础镜像
		addBaseImage() {
			this.$refs.addBaseImageForm.validate(async (valid) => {
				if (valid) {
					let url = this.GLOBAL.baseUrl + "/base/image/add";
					
					this.axios({
						method: "post",
						url: url,
						data: this.baseImageForm,
					})
						.then((res) => {
							if (res.data.code === 200) {
								this.$refs.addBaseImageForm.resetFields();
								this.$message({
									message: "添加成功",
									type: "success",
								});
								this.GetBasicImages();
							} else {
								this.$message.error("添加失败，请重试");
							}
							this.addBaseImageVisible = false;
							this.baseImageForm = {};
						})
						.catch((err) => {
							alert(err);
							this.addBaseImageVisible = false;
						});
				}
			});
		},
		// 关闭
		closeAddBaseImageDialog() {
			if (this.addBaseImageVisible) {
				this.addBaseImageVisible = false;
			}
		},
	},
};
</script>
<style lang="scss">
.block {
	width: 100%;
	
	span {
		&:first-child {
			font-size: 14px;
			
			strong {
				//color: #2d8cf0;
				font-size: 14px;
			}
		}
		
		&:last-child {
			//float: right;
		}
	}
}
</style>
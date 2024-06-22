<template>
		<div>
				<!-- 搜索 -->
				<el-form ref="envForm" :model="envForm" label-width="120px" label-position="left">
						
						<el-form-item label="环境:">
								<el-checkbox :indeterminate="envIsIndeterminate" v-model="envCheckAllVisible"
								             @change="checkAllBtnChange"
								             v-show="!disabled">全选
								</el-checkbox>
								
								<el-checkbox-group
									v-model="envForm.envId"
									@change="checkboxChange"
								>
										<el-checkbox v-for="(item,ind) in envs" :label="item.value" :key="ind">{{ item.label }}
										</el-checkbox>
								</el-checkbox-group>
						
						</el-form-item>
						
						<el-form-item style="margin-top: 50px">
								<el-button size="small" type="primary" @click="saveConfig('code')">更 新</el-button>
								<el-button size="small" @click="loadEnvBlockList">重 置</el-button>
						</el-form-item>
				</el-form>
		
		</div>
</template>

<script>
import {queryEnvs, blackAdd, blackUpdate} from "@/api/black_list"

export default {
		name: "envForm.vue",
		
		data() {
				return {
						envForm: {
								envId: [],
						},
						envs: [],
						envCheckAllVisible: false,
						disabled: false,
						envIsIndeterminate: true,
						
				};
		},
		created() {
		},
		mounted() {
				this.loadEnvs()
		},
		methods: {
				checkAllBtnChange(val) {
						let arrayValue = [];
						this.envs.forEach(item => {
								arrayValue.push(item.value)
						})
						
						this.envForm.envId = val ? arrayValue : [];
						this.envIsIndeterminate = false;
				},
				
				checkboxChange(value) {
						let checkedCount = value.length;
						this.envCheckAllVisible = checkedCount === this.envs.length;
						this.envIsIndeterminate = checkedCount > 0 && checkedCount < this.envs.length;
				},
				
				loadEnvBlockList() {
						let url = this.GLOBAL.baseUrl + "/access_control/env_block/list";
						this.axios({
								method: "post",
								url: url,
						})
							.then((response) => {
									let res = response.data
									if (res.code === 200) {
											if (res.data.length > 0){
													this.envForm.envId = res.data
											}
									} else {
											this.$message({
													type: 'error',
													message: res.data.message
											})
									}
							})
				},
				
				loadEnvs() {
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
							.then(() => {
									this.loadEnvBlockList()
							})
				},
				
				
				// 选择限制环境
				selectChange3(e) {
						this.resolveBug()
						this.envForm.envId = e.value
						this.envForm.envName = e.label
				},
				
				resolveBug() {
						this.$forceUpdate();
				},
				resetConfig() {
				
				},
				//保存
				saveConfig() {
						let url = this.GLOBAL.baseUrl + "/access_control/env_block/update";
						this.axios({
								method: "post",
								url: url,
								data: this.envForm.envId,
						})
							.then((res) => {
									if (res.data.code === 200) {
											this.$message({
													type: 'success',
													message: `更新成功`
											})
									} else {
											this.$message({
													type: 'error',
													message: res.data.message
											})
									}
							}).finally(()=>{
									this.loadEnvBlockList();
						})
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
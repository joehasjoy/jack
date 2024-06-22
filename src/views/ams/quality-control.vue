<template>
		<div class="team-main">
				<div class="table-box">
						<el-tabs v-model="activeTenantSetting" @tab-click="changeConfig">
								<el-tab-pane label="流水线表格" name="pipelineForm">
										<pipelineForm></pipelineForm>
								</el-tab-pane>
								
								<el-tab-pane label="环境表单" name="code">
										<envForm></envForm>
								</el-tab-pane>
						
						
						</el-tabs>
				</div>
		</div>
</template>

<script>
import YAML from "yaml";
import pipelineForm from "./components/qualityControl/pipelineForm";
import envForm from "./components/qualityControl/envForm";

export default {
		name: "quality-control",
		data() {
				return {
						activeTenantSetting: "pipelineForm",
				};
		},
		beforeUpdate() {
		},
		methods: {
				changeConfig() {
						this.InitConfig();
				},
				InitConfig(){
				
				},
		},
		
		computed: {},
		
		mounted() {
				this.InitConfig();
		},
		components: {
				pipelineForm,
				envForm
		},
};
</script>

<style>
.active_sucess {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
}

.team-main {
		background-color: #f4f4f4;
		box-sizing: border-box;
		height: calc(100% - 80px);
		background: white;
		padding: 20px;
		box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
		border-radius: 8px;
		overflow: auto;
}

.team-main .el-tabs {
		height: 100%;
		display: flex;
		flex-direction: column;
}

.team-main .el-tabs__content {
		flex: 1;
}

.team-main .el-tab-pane {
		height: 100%;
		display: flex;
		flex-direction: column;
}

.team-main .table-box {
		flex: 1;
		overflow-y: auto;
}

.team-main .panel-tab .el-tabs__content {
		overflow-y: auto;
}
</style>

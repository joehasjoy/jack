<template>
	<div>
		<el-table ref="singleTable" :data="histroyList" :highlight-current-row="true">
			<el-table-column label="序号" type="index" align="center"> </el-table-column>
			<el-table-column label="操作人员" prop="createBy" align="center"></el-table-column>
			<el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
			<el-table-column label="构建用时" prop="duration" align="center"></el-table-column>
			<el-table-column label="构建状态" prop="status" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.status == 'UNSTART'">
						<i style="color: #85ce61" class="el-icon-time"></i> <span
							style="margin-left:2px;font-size: 14px">排队中</span>
					</div>
					<div v-if="scope.row.status == 'BUILDING'">
						<i style="color: #85ce61" class="el-icon-loading"></i> <span
							style="margin-left:2px;font-size: 14px">构建中</span>
					</div>
					<div v-if="scope.row.status == 'SUCCESS'">
						<i style="color: #85ce61" class="el-icon-success"></i> <span
							style="margin-left:2px;font-size: 14px">成功</span>
					</div>

					<div v-if="scope.row.status == 'FAILURE'">
						<i style="color: red" class="el-icon-error"></i> <span
							style="margin-left:2px;font-size: 14px">失败</span>
					</div>
					<div v-if="scope.row.status == 'ABORTED'">
						<i style="color:red" class="el-icon-remove-outline"></i> <span
							style="margin-left:2px;font-size: 14px">取消</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="100px" align="">
				<template slot-scope="scope">
					<el-button size="mini" icon="el-icon-plus" type="text" @click="lookInfo(scope.row)">
						查看详情
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<pagination :small="false" :total="total" :page.sync="page" :limit.sync="limit"
			@pagination="loadBuildHistory()"></pagination>
	</div>
</template>

<script>
import pagination from "@/components/Pagination/pagination";

export default {
	name: "RunningPipelineHistory",
	components: {
		pagination: pagination,
	},
	mounted() {
        this.appId = this.common.getUrlKey("appId")
        this.pipline_uuid = this.common.getUrlKey("pipline_uuid")
    },
	data() {
		return {
			histroyList: [],
			total: 0,
            page: 1,
            limit: 10,
			pipline_uuid:undefined,
			appId:undefined
		};
	},
	methods: {
		loadBuildHistory(){
			this.axios({
                url: this.GLOBAL.baseUrl + `/access_control/pipeline_instance/list`,
                method: "post",
                data: {
                    appId: this.appId,
                    pipelineUuid: this.pipline_uuid,
                    pageSize: this.limit,
                    pageNum: this.page,
                },
            }).then((response) => {
                const {
                    data,
                    code
                } = response.data;
                if (code === 200) {
                    this.total=data.total;
                    this.histroyList = data.list
                }
            }).catch(err => {
                this.$message.error("加载构建历史失败")
                console.log(err)
            })
		},
		lookInfo(row){
			this.$emit("lookBuildDetail",row)
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
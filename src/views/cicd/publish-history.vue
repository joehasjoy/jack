<!-- 弹出框组件 -->
<template>
<div class="history-main flex-column">
    <el-page-header @back="goBack" :content="appCode"></el-page-header>

    <el-tabs style="margin-top: 15px" @tab-click="loadData" v-model="activeTab">
        <el-tab-pane label="部署日志" name="deploy-record">
            <div class="table-box">
                <enn-table :tableColumn="tableColumn" :tableData="historyList" @handleOperationClick="handleClick"></enn-table>
            </div>
            <div class="page" v-show="historyList.length">
                <pagination :small="false" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getHistoryList()"></pagination>
            </div>
        </el-tab-pane>
		    
		    <el-tab-pane label="重启日志" name="restart-record">
            <div class="table-box">
								<!--    搜索条件   -->
		            <div style="float: right;">
				            <el-form :inline="true" :model="formSearch" class="demo-form-inline" @submit.native.prevent label-width="100px">
						            <el-form-item label="所属环境">
								            <el-select v-model="formSearch.enValues" multiple placeholder="请选择环境">
										            <el-option
											            v-for="item in envs"
											            :key="item.label"
											            :label="item.label"
											            :value="item.label">
										            </el-option>
								            </el-select>
						            </el-form-item>
						            <el-form-item>
								            <el-button type="primary" @click="envSearch" id="appSearch">查询</el-button>
						            </el-form-item>
				            </el-form>
		            </div>
		            
		            
                <enn-table :tableColumn="restartColumn" :tableData="restartList">
		                <div slot="type" slot-scope="scope">
				                <el-tag v-if="scope.row.type === 1">服务重启</el-tag>
				                <el-tag v-if="scope.row.type === 2" type="warning">容器重启</el-tag>
		                </div>
		                <div slot="operateTime" slot-scope="scope">
				                {{common.formatDate(scope.row.operateTime, 'yyyy-MM-dd hh:mm:ss') }}
		                </div>
		                <div slot="appCode" slot-scope="scope">
				                {{ appCode }}
		                </div>
                </enn-table>
            </div>
            <div class="page" v-show="restartList.length">
                <pagination :small="false" :total="restartTotal" :page.sync="restartPage" :limit.sync="restartLimit" @pagination="getRestartList()"></pagination>
            </div>
        </el-tab-pane>
		    
        <el-tab-pane label="部署配置记录" name="config-record">
            <div class="table-box">
                <el-table :data="paramHistoryList">
                    <el-table-column type="index" width="50" label="序号">
                    </el-table-column>
                    <el-table-column prop="envKey" label="参数名">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.envKey === 'namespace'">
                                命名空间
                            </el-tag>
                            <el-tag v-if="scope.row.envKey === 'values_replica_count'">
                                部署实例
                            </el-tag>
                            <el-tag v-if="scope.row.envKey === 'values_resources_limit_cpu'">
                                实例规格
                            </el-tag>

                            <el-tag v-if="scope.row.envKey === 'ingress_ports'">
                                部署端口
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="envValue" min-width="200" label="变化值" text-align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-tag type="danger" v-if="scope.row.envKey === 'values_resources_limit_cpu'">
                                <span v-if="scope.row.envValue === '2000->1000'">2cpu-4G -> 1cpu-2G</span>
                                <span v-if="scope.row.envValue === '1000->2000'">1cpu-2G -> 2cpu-4G</span>
                            </el-tag>
                            <el-tag v-if="
                    scope.row.envKey === 'values_replica_count' ||
                    scope.row.envKey === 'namespace' ||
                    scope.row.envKey === 'ingress_ports'
                  ">
                                {{ scope.row.envValue }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column prop="createUserName" label="变更人">
                    </el-table-column>
                    <el-table-column prop="changeType" label="变更类型">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.changeType === '0'" type="info">新增</el-tag>
                            <el-tag v-if="scope.row.changeType === '1'">修改</el-tag>
                            <el-tag v-if="scope.row.changeType === '2'" type="danger">删除</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="变更时间时间" sortable>
                    </el-table-column>
                </el-table>
            </div>
            <div class="page" v-show="paramHistoryList.length">
                <pagination :small="false" :total="paramTotal" :page.sync="paramPage" :limit.sync="paramLimit" @pagination="getDeployParamChangeHistoryList()"></pagination>
            </div>
        </el-tab-pane>
        <el-tab-pane label="Web漏洞扫描记录" name="scan-record">
            <div class="table-box">
                <el-table :data="vecsHistoryList">
                    <el-table-column type="index" width="60" center label="序号">
                    </el-table-column>
                    <el-table-column prop="runEnv" label="环境">
                        <template slot-scope="scope">
                            <el-tag type="info">{{scope.row.runEnv}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="targeUrl" label="目标URL">
                    </el-table-column>
                    <el-table-column prop="createBy" label="提交人">
                    </el-table-column>
                    <el-table-column prop="createTime" label="提交时间" sortable>
                    </el-table-column>
                    <el-table-column prop="param" label="状态">
                        <template slot-scope="scope">
                            <i style="color:409EFF" class="el-icon-loading" v-if="JSON.parse(scope.row.param).dealStatus=='running'">
                            </i>
                            <i class="el-icon-error" style="color:red;" v-if="JSON.parse(scope.row.param).dealStatus=='fail'">
                            </i>
                            <i style="color:#409EFF" class="el-icon-success" v-if="JSON.parse(scope.row.param).dealStatus=='success'">
                            </i>
                            <el-tag size="mini" v-if="JSON.parse(scope.row.param).dealStatus=='running'">处理中</el-tag>
                            <span v-if="JSON.parse(scope.row.param).dealStatus=='fail'">失败</span>
                            <span v-if="JSON.parse(scope.row.param).dealStatus=='success'">成功</span>
                            <el-button v-if="JSON.parse(scope.row.param).dealStatus=='success'" @click="showWebScanReport(scope.row)" type="text">查看报告</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="page" v-show="vecsHistoryList.length">
                <pagination :small="false" :total="vecsTotal" :page.sync="vecsPage" :limit.sync="vecsLimit" @pagination="getVecsRecordHistoryList()"></pagination>
            </div>
        </el-tab-pane>
		    
		    <el-tab-pane label="开源组件扫描记录" name="scan-components">
				    <openSourceComponents ref="openSource"></openSourceComponents>
        </el-tab-pane>

    </el-tabs>

    <!-- 扫描版本 -->

    <el-drawer :with-header="false" :visible.sync="drawer" :direction="direction" size="30%" :modal="false">
        <div class="drawer-title">
            <div style="font-size: 15px; font-weight: bold">{{ drawerTitle }}</div>
            <div style="margin-left: auto; font-size: 18px; margin-top: -5px" @click="
            drawer = false;
          ">
                <el-link :underline="false"> x </el-link>
            </div>
        </div>
        <div class="detail-info-panel">
            <el-descriptions :column="1" border :contentStyle="CS" :label-style="LS" size="medium">
                <el-descriptions-item label="检测URL">{{reportObject.targeUrl}}</el-descriptions-item>
                <el-descriptions-item label="镜像名称">{{reportObject.isoName}}</el-descriptions-item>
                <el-descriptions-item label="高级别漏洞数据">{{reportObject.highRiskCount}}</el-descriptions-item>
                <el-descriptions-item label="中级别漏洞数量">{{reportObject.midRiskCount}}</el-descriptions-item>
                <el-descriptions-item label="低级别漏洞数量">{{reportObject.lowRiskCount}}</el-descriptions-item>
                <el-descriptions-item label="总体评分">{{reportObject.score}}</el-descriptions-item>
                <el-descriptions-item label="扫描用时">{{reportObject.scanTime}}</el-descriptions-item>
                <el-descriptions-item label="报告下载地址" v-if="reportObject.reportUrl!=undefined">

                    <div style="display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;">
                        <el-button type="text" :key="index" v-for="(url,index) in 
                        reportObject.reportUrl.split(',')" style="margin-left:10px;" @click="download(url,' 天融信脆弱性扫描与管理系统安全评估报告'+index)">
                            天融信脆弱性扫描与管理系统安全评估报告{{index+1}}</el-button>
                    </div>

                </el-descriptions-item>
            </el-descriptions>
        </div>
    </el-drawer>

</div>
</template>

<script>
import EnnTable from "./../../components/EnnTable/index.vue";
import Pagination from "./../../components/Pagination/pagination.vue";
import openSourceComponents from "./../../components/PublishHistory/openSourceComponents";
import {
    getBuildHistoryApi,
		getBuildRestartList,
    rollbackApi
} from "../../api/api";
import {queryEnvs} from "../../api/apollo_config";

export default {
    name: "PublishHistory",
    components: {
        EnnTable,
        Pagination,
		    openSourceComponents,
    },
    data() {
        return {
		        formSearch:{
				        enValues:['prod'],
		        },
		        envs: [],
		        
            activeTab: "deploy-record",

            CS: {
                'text-align': 'left', //文本居中
                'min-width': '250px', //最小宽度
                'word-break': 'break-all' //过长时自动换行
            },
            LS: {
                'color': '#000',
                'text-align': 'left',
                'font-weight': '600',
                'height': '40px',
                'min-width': '110px',
                'word-break': 'keep-all'
            },
            reportObject: {},
            drawer: false,
            direction: "rtl",
            drawerTitle: "",

            total: 0,
            page: 1,
            limit: 10,
		        
		        restartTotal: 0,
		        restartPage: 1,
		        restartLimit: 10,

            paramTotal: 0,
            paramPage: 1,
            paramLimit: 10,

            vecsTotal: 0,
            vecsPage: 1,
            vecsLimit: 10,

            tableColumn: [{
                    label: "AppId",
                    prop: "appCode"
                },
                {
                    label: "镜像名称",
                    prop: "productName"
                },
                {
                    label: "部署说明",
                    prop: "applyDesc"
                },
                {
                    label: "命名空间",
                    prop: "namespace"
                },
                {
                    label: "部署人",
                    prop: "deployOperatorNickname"
                },
                {
                    label: "部署时间",
                    prop: "deployTime"
                },
                {
                    label: "回滚人",
                    prop: "rollbackOperatorNickname"
                },
                {
                    label: "回滚时间",
                    prop: "rollbackTime"
                },
                {
                    label: "操作",
                    prop: "operationList"
                },
            ],
		
		        restartColumn: [{
                    label: "应用名称",
                    prop: "appCode",
						        slot: true,
						        slotName: 'appCode',
                },
				        {
						        label: "容器名称",
						        prop: "pod"
				        },
				        {
						        label: "镜像名称",
						        prop: "image"
				        },
				        {
						        label: "命名空间",
						        prop: "namespace"
				        },
				        {
						        label: "所属环境",
						        prop: "envFlag"
				        },
                {
                    label: "重启类型",
                    prop: "type",
		                slot: true,
		                slotName: 'type',
                },
                {
                    label: "操作人员",
                    prop: "operatorName"
                },
                {
                    label: "重启时间",
                    prop: "operateTime",
		                slot: true,
		                slotName: 'operateTime',
                },
            ],

            paramTableColumn: [{
                    label: "AppId",
                    prop: "appCode"
                },
                {
                    label: "镜像名称",
                    prop: "productName"
                },
                {
                    label: "部署说明",
                    prop: "applyDesc"
                },
                {
                    label: "命名空间",
                    prop: "namespace"
                },
                {
                    label: "部署人",
                    prop: "deployOperatorNickname"
                },
                {
                    label: "部署时间",
                    prop: "deployTime"
                },
                {
                    label: "回滚人",
                    prop: "rollbackOperatorNickname"
                },
                {
                    label: "回滚时间",
                    prop: "rollbackTime"
                },
            ],

            historyList: [],
		        restartList: [],
            paramHistoryList: [],
            vecsHistoryList: [],

            appId: "",
            appCode: "",
        };
    },
    methods: {
				initQueryEnv(){
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
        // 获取发布历史
        async getHistoryList() {
						console.log('--------')
            let params = {
                pageSize: this.limit,
                pageNumber: this.page,
                appId: this.appId,
            };
            let res = await getBuildHistoryApi(params);
            let {
                code,
                data
            } = res;
            if (code === 200) {
                let {
                    total,
                    list
                } = data;
                if (list.length > 0) {
                    list.map((item) => {
                        item.operationList = [{
                            name: "回滚到此版本",
                            value: "rollBack",
                        }, ];
                        return item;
                    });
                }
                this.total = total;
                this.historyList = list;
            }
        },
		
		    envSearch(){
						console.log(this.formSearch.enValues)
						this.getRestartList();
		    },
		    // 获取重启日志
        async getRestartList() {
            let params = {
                pageSize: this.restartLimit,
                pageNum: this.restartPage,
                appId: Number(this.appId),
		            envFlag: this.formSearch.enValues
            };
            let res = await getBuildRestartList(params);
            let {
                code,
                data
            } = res;
            if (code === 200) {
                let {
                    total,
                    list
                } = data;
                
                this.restartTotal = total;
                this.restartList = list;
            }
        },
		    
        getDeployParamChangeHistoryList() {
            this.axios({
                    url: this.GLOBAL.baseUrl + "/app-deploy-version/params/records",
                    method: "get",
                    params: {
                        pageSize: this.paramLimit,
                        pageNumber: this.paramPage,
                        appId: this.appId,
                        envIndex: this.envIndex,
                        tenantId: localStorage.getItem("originTenantId"),
                    },
                })
                .then((res) => {
                    let {
                        code,
                        data
                    } = res.data;
                    if (code === 200) {
                        let {
                            total,
                            list
                        } = data;
                        this.paramTotal = total;
                        this.paramHistoryList = list;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        getVecsRecordHistoryList() {
            this.axios({
                    url: this.GLOBAL.baseUrl + "/app-deploy-version/vecsScan/records",
                    method: "get",
                    params: {
                        pageSize: this.vecsLimit,
                        pageNumber: this.vecsPage,
                        appId: this.appId,
                    },
                })
                .then((res) => {
                    let {
                        code,
                        data
                    } = res.data;
                    if (code === 200) {
                        let {
                            total,
                            list
                        } = data;
                        this.vecsTotal = total;
                        this.vecsHistoryList = list;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        // 获取路由参数
        dealQuery() {
            this.appId = this.$route.query.appId;
            this.appCode = this.$route.query.appCode;
        },
        // 返回
        goBack() {
            this.$router.go(-1);
        },
        // 回滚版本
        handleClick(e) {
            this.$confirm("确认回滚到此版本?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                .then(() => {
                    let {
                        appDeployId
                    } = e.row;
                    this.rollBack(appDeployId);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消回滚",
                    });
                    this.getHistoryList();
                });
        },
        // 回滚版本请求
        async rollBack(appDeployId) {
            let params = {
                appDeployId,
            };
            let res = await rollbackApi(params);
            let {
                code
            } = res;
            if (code === 200) {
                this.$message({
                    message: "回滚成功",
                    type: "success",
                });
            }
        },
        showWebScanReport(data) {
            this.drawer = true;;
            this.drawerTitle = "报告详情"
            this.reportObject = data
        },
        loadData() {
					
						if(this.activeTab === 'restart-record'){
								this.getRestartList()
						}else if (this.activeTab === 'deploy-record'){
								console.log('deploy-record')
								this.getHistoryList()
						}else if (this.activeTab === 'scan-components'){
				        this.$refs.openSource.appId = this.appId
				        this.$refs.openSource.loadMain()
		        }else{
								this.getVecsRecordHistoryList();
						}
						
        },
         download(url,name) {
            // window.open(url);
            const a = document.createElement('a')
            a.href = url
            a.download =name
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        }

    },
    mounted() {
        this.dealQuery();
        this.getHistoryList();
        this.getDeployParamChangeHistoryList();
        this.getVecsRecordHistoryList();
				this.initQueryEnv()
    },
    created() {
        console.log(this.$route.query.tab)
        if (this.$route.query.tab != undefined) {
            this.activeTab = this.$route.query.tab
        }
    }
};
</script>

<style lang="scss" scoped>
.line {
    height: 30px;
    width: 1px;
    background-color: #d5d6d7d8;
    margin-left: 8px;
    margin-right: 8px;
}

.detail-info-panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: auto;
    margin: 10px;
}

.drawer-title {
    height: 40px;
    width: 100%;
    padding: 10px;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    border-bottom: 1px solid #d6d7d8;
}

.history-main {
    overflow-y: auto;
    box-sizing: border-box;
    height: calc(100% - 80px);
    background: white;
    padding: 20px;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;

    .table-box {
        margin-top: 20px;
        flex: 1;
        overflow-y: auto;
    }
}

.detail-info-panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    overflow: auto;
    margin: 10px;
}
</style>

<template>
<div class="main flex">

    <div class="left-panel">
        <div class="header flex-center-between">
            <div class="back-box flex flex-align-items-center" @click="goBack">
                <i class="el-icon-arrow-left"></i>
                {{appCode}}
            </div>
            <el-button circle icon="el-icon-plus" size="medium" @click="showStartNewPipeline"></el-button>
        </div>
        <el-table ref="singleTable" :data="histroyList" :highlight-current-row="true" @current-change="ClickAppVersionRow">
            <el-table-column label="序号" type="index" align="center"> </el-table-column>
            <el-table-column label="操作人员" prop="createBy" align="center"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" align="center"></el-table-column>
            <el-table-column label="构建用时" prop="duration" align="center"></el-table-column>
            <el-table-column label="代码信息" prop="duration" align="left" show-overflow-tooltip width="190px">
                <template slot-scope="scope">
                    <el-button type="text" @click="goCodeUrl(scope.row)">
                        <span>{{scope.row.branch}}</span>
                        <span v-if="scope.row.commitId!=undefined&&scope.row.commitId!=''">{{scope.row.commitId}}</span>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="构建状态" prop="status" align="center">
                <template slot-scope="scope">

                    <div v-if="scope.row.status=='UNSTART'">
                        <i style="color: #85ce61" class="el-icon-time"></i> <span style="margin-left:2px;font-size: 14px">排队中</span>
                    </div>
                    <div v-if="scope.row.status=='BUILDING'">
                        <i style="color: #85ce61" class="el-icon-loading"></i> <span style="margin-left:2px;font-size: 14px">构建中</span>
                    </div>
                    <div v-if="scope.row.status=='SUCCESS'">
                        <i style="color: #85ce61" class="el-icon-success"></i> <span style="margin-left:2px;font-size: 14px">成功</span>
                    </div>

                    <div v-if="scope.row.status=='FAILURE'">
                        <i style="color: red" class="el-icon-error"></i> <span style="margin-left:2px;font-size: 14px">失败</span>
                    </div>
                    <div v-if="scope.row.status=='ABORTED'">
                        <i style="color:red" class="el-icon-remove-outline"></i> <span style="margin-left:2px;font-size: 14px">取消</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <pagination :small="false" :total="total" :page.sync="page" :limit.sync="limit" @pagination="loadBuildHistory()"></pagination>

    </div>

    <div class="right-panel">
        <div class="box">
            <div class="row flex-center-between">
                <div class="title-box flex flex-align-items-center">
                    <div class="bar"></div>
                    基本信息
                </div>
                <div class="refresh-box flex flex-align-items-center">
                    <i class="el-icon-refresh"></i>
                    <span style="margin-right: 10px" @click="refreshPageData()">刷新</span>
                </div>
            </div>
            <div>
                <el-descriptions direction="horizontal" :column="1" border :labelStyle="{'text-align':'center','width':'180px'}">
                    <el-descriptions-item label="创建时间">{{cur_build_row.createTime}}</el-descriptions-item>
                    <el-descriptions-item label="编程语言">
                        <el-tag>
                            {{cur_build_row.buildLanguage}}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="仓库地址">{{app.gitRepoUrl}}</el-descriptions-item>
                    <el-descriptions-item label="分支/Tag">{{cur_build_row.branchOrTag}}</el-descriptions-item>
                    <el-descriptions-item label="commitId">{{cur_build_row.commitId}}</el-descriptions-item>
                    <el-descriptions-item label="构建用户">{{cur_build_row.createdBy}}</el-descriptions-item>
                    <el-descriptions-item label="构建用时">{{cur_build_row.duration}}</el-descriptions-item>
                    <el-descriptions-item label="构建状态">
                        <div v-if="cur_build_row.buildStatus=='UNSTART'">
                            <i style="color: #85ce61" class="el-icon-time"></i> <span style="margin-left:2px;font-size: 14px">排队中</span>
                        </div>
                        <div v-if="cur_build_row.buildStatus=='BUILDING'">
                            <i style="color: #85ce61" class="el-icon-loading"></i> <span style="margin-left:2px;font-size: 14px">构建中</span>
                        </div>
                        <div v-if="cur_build_row.buildStatus=='SUCCESS'">
                            <i style="color: #85ce61" class="el-icon-success"></i> <span style="margin-left:2px;font-size: 14px">成功</span>
                        </div>

                        <div v-if="cur_build_row.buildStatus=='FAILURE'">
                            <i style="color: red" class="el-icon-error"></i> <span style="margin-left:2px;font-size: 14px">失败</span>
                        </div>
                        <div v-if="cur_build_row.buildStatus=='ABORTED'">
                            <i style="color: red" class="el-icon-remove-outline"></i> <span style="margin-left:2px;font-size: 14px">取消</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="流水线配置">
                        <el-button type="text" @click="goPipelineDesign">{{ pipline_name}}</el-button>
                    </el-descriptions-item>
                    <el-descriptions-item label="构建操作" v-if="cur_build_row.buildStatus=='UNSTART'||cur_build_row.buildStatus=='BUILDING'">
                        <el-button type="text">点击取消</el-button>
                    </el-descriptions-item>
                    <el-descriptions-item label="已选择镜像" v-if="deployment_env!=undefined">
                        <el-tag type="danger">
                            ecr-online.enncloud.cn/devops-jenkins/{{appCode}}:{{this.cur_build_row.buildUuid}}
                        </el-tag>
                    </el-descriptions-item>
		                
		                <!-- 接口测试 -->
		                <el-descriptions-item label="总用例数" v-if="testingObj.interfaceVisible">
                        {{ testingObj.totalCount }}
                    </el-descriptions-item>
		                <el-descriptions-item label="通过用例数" v-if="testingObj.interfaceVisible">
                        {{ testingObj.successCount }}
                    </el-descriptions-item>
		                <el-descriptions-item label="失败用例数" v-if="testingObj.interfaceVisible">
                        {{ testingObj.failCount }}
                    </el-descriptions-item>
		                <el-descriptions-item label="通过率" v-if="testingObj.interfaceVisible">
                        {{ testingObj.successRate }}
                    </el-descriptions-item>
		                
		                <!-- 性能测试 -->
		                <el-descriptions-item label="QPS" v-if="testingObj.performanceVisible">
                        {{ testingObj.qps }}
		                </el-descriptions-item>
		                <el-descriptions-item label="TOP95" v-if="testingObj.performanceVisible">
                        {{ testingObj.top95 }}
		                </el-descriptions-item>
		                <el-descriptions-item label="成功率" v-if="testingObj.performanceVisible">
                        {{ testingObj.successRate }}
		                </el-descriptions-item>
                </el-descriptions>
            </div>

        </div>
        <div class="box" style="flex:0.3;">
            <div class="row flex-center-between">
                <div class="title-box flex flex-align-items-center">
                    <div class="bar"></div>
                    流程状态
                </div>
                <div class="refresh-box flex flex-align-items-center" @click="showLogWindowHandler">
                    <i class="el-icon-notebook-2"></i>
                    <span style="margin-right: 10px;margn-left: 10px;">日志</span>
                </div>
            </div>
            <div>
                <el-steps :active="activeIndex" align-center>
                    <el-step v-for="(item, index) in piplineSteps" :key="index" :title="item.name" :description="item.code_des" :status="item.icon_status" :icon="item.icon"></el-step>
                </el-steps>
            </div>

        </div>

        <div class="box" style="flex:0.3;" v-if="!isResultIsReported">
            <div class="column">
                <div class="title-box flex flex-align-items-center">
                    <div class="bar"></div>
                    产物部署
                </div>
                <el-select style="width: 100%; margin-top: 16px" v-model="deployment_env" placeholder="请选择发布环境" clearable>
                    <el-option v-for="item in envDatas" :key="item.env" :label="item.env" :value="item.env">
                    </el-option>
                </el-select>
                <el-button :disabled="!(cur_build_row.buildStatus === 'SUCCESS'&&deployment_env!=undefined)" style="width: 100%; margin-top: 16px;height:40px;" @click="goDeploy" type="primary">镜像部署</el-button>
            </div>
        </div>

        <div class="box" style="flex:0.3;" v-if="isResultIsReported">
            <div class="column" v-if="testingObj.interfaceVisible || testingObj.performanceVisible">
                <div class="title-box flex flex-align-items-center">
                    <div class="bar"></div>
                    自动测试报告
                </div>
                <el-button :disabled="!(cur_build_row.buildStatus === 'SUCCESS')" icon="el-icon-tickets" style="width: 100%; margin-top: 16px;height:40px;" @click="goTestingReport" type="primary">查看报告</el-button>
            </div>
		        
		        <div class="column" v-else>
                <div class="title-box flex flex-align-items-center">
                    <div class="bar"></div>
                    Sonar报告
                </div>
                <el-button :disabled="!(cur_build_row.buildStatus === 'SUCCESS')" icon="el-icon-tickets" style="width: 100%; margin-top: 16px;height:40px;" @click="goReport" type="primary">查看报告</el-button>
            </div>
        </div>
		    
    </div>
    <el-dialog title="运行配置" :visible.sync="openDialog" width="600px">
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="分支/标签" prop="branch" :rules="[{ required: true, message: '请选择分支.', trigger: 'blur' }]">
                <el-cascader v-model="form.branch" filterable :options="branchTagOptions" @focus="handleChangeTagBranch" style="width:100%;"></el-cascader>
            </el-form-item>
            <el-form-item label="构建备注">
                <el-input type="textarea" :rows="3" v-model="form.desc"></el-input>
            </el-form-item>
            <el-alert title="提示" type="success" description="如需修改构建过程中的参数请在配置流水线中修改，然后再返回构建。">
            </el-alert>
            <el-form-item style="margin-top:10px;">
                <el-button style="float: right;margin-left:10px;" type="primary" @click="onStart">运行</el-button>
                <el-button style="float: right" @click="openDialog= false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>

    <!--构建日志弹窗-->
    <el-dialog title="构建日志" center width="70%" :visible.sync="logDialogVisible" style="height: 900px">
        <el-tabs tab-position="left" v-model="showLogIndex">
            <el-tab-pane :label="step.name" :name="String(index)" v-for="(step, index) in piplineSteps" :key="index">
                <div class="log_content">
                    <div class="log_content-header">
                        <span>{{ step.name }}日志</span>
                        <el-link :underline="false" style="margin-left: auto; margin-right: 15px">下载日志</el-link>
                    </div>
                    <pre class="log_content-center" v-if="logs[index]!=undefined">{{logs[index].logTxt}}</pre>
                    <pre class="log_content-center" v-if="logs[index]==undefined">当前无日志信息</pre>
                </div>
            </el-tab-pane>
        </el-tabs>
    </el-dialog>

</div>
</template>

<script>
import pagination from "@/components/Pagination/pagination";
import {
    getUseLanguageName
} from "@/utils/pipeline.js";

export default {
    name: "design-pipeline-build",
    components: {
        pagination,
    },
    data() {
        return {
		        testingObj: {
				        interfaceVisible: false,
				        performanceVisible: false,
				        totalCount:null,
				        detailURL: null,
				        failCount: null,
				        successCount: null,
				        successRate: null,
		        },
            pipline_name: "点击查看",
            isResultIsReported: false,
            deployment_env: undefined,
            envDatas: [],
            logs: [],
            showLogIndex: "0",
            logDialogVisible: false,
            cur_build_row: {
                createTime: "-",
                buildLanguage: "-",
                buildRepository: "-",
                branchOrTag: "-",
                commitId: "-",
                createdBy: "-",
                duration: "-",
                buildStatus: "-",
                pipilineUUid: "-",
                buildUuid: "",
                branch: "",
            },
            activeIndex: 0,
            gitTagList: [],
            gitBranchList: [],
            form: {
                branch: ""
            },
            app: {},
            openDialog: false,
            pipline_uuid: undefined,
            appCode: undefined,
            appId: undefined,
            histroyList: [],
            total: 10,
            page: 1,
            limit: 10,
            version_timer: null,
            piplineSteps: [],
            branchTagOptions: [{
                    label: "分支",
                    value: "branch",
                    children: []

                },
                {
                    label: "Tag",
                    value: "tag",
                    children: []

                }
            ],
        }
    },
    watch: {
        "cur_build_row.buildStatus": function () {
            if (this.cur_build_row.buildStatus === 'BUILDING' || this.cur_build_row.buildStatus == 'UNSTART') {
                clearInterval(this.version_timer);
                this.version_timer = window.setInterval(this.queryVersionStatus, 10000);
            } else if (this.cur_build_row.buildStatus === 'SUCCESS' || this.cur_build_row.buildStatus == 'ABORTED' || this.cur_build_row.buildStatus == 'FAILURE') {
                clearInterval(this.version_timer);
            } else {
                clearInterval(this.version_timer);
            }
        },
    },
    created() {
        this.pipline_name = this.common.getUrlKey("pipline_name");
        this.pipline_uuid = this.common.getUrlKey("pipline_uuid");
        this.appCode = this.common.getUrlKey("appCode")
        this.appId = this.common.getUrlKey("appId")
        this.loadPipelineSteps();
        this.loadApplicationInfo();
        this.loadBuildHistory();
        this.LoadDeployEnv();
    },
    methods: {
        goTestingReport() {
						console.log(this.testingObj.detailURL)
            window.open(this.testingObj.detailURL, "_blank");
        },
		    goReport() {
            console.log(this.cur_build_row)

            let url =
                "http://sonarqube.ennewi.cn/dashboard?id=" +
                this.appCode +
                "_" +
                this.cur_build_row.branch +
                "_" +
                this.cur_build_row.commitId;
            window.open(url, "_blank");
        },
        goDeploy() {

            this.$router.push({
                path: "/cicd/app/app-deploy",
                query: {
                    appId: this.appId,
                    appCode: this.appCode,
                    image: "ecr-online.enncloud.cn/devops-jenkins/" + this.appCode + ":" + this.cur_build_row.buildUuid,
                    branch: this.cur_build_row.branchOrTag,
                    deployEnv: this.deployment_env,
                    language: this.common.getUrlKey("useLanguage"),
                },
            });

        },
        showLogWindowHandler() {
            this.logDialogVisible = true;
        },
        //加载部署集群
        LoadDeployEnv() {
            this.envDatas = []
            var that = this;
            this.axios({
                    url: this.GLOBAL.baseUrl + "/env/get",
                    method: "get",
                })
                .then((res) => {
                    if (res.data.code === 200) {
                        if (res.data.data != undefined || res.data.data != null) {
                            res.data.data.forEach((envObject) => {
                                if ("PROD" != envObject.selectValue.toUpperCase()) {
                                    that.envDatas.push({
                                        env: envObject.selectValue.toUpperCase(),
                                    });
                                }
                            });
                        }
                    }
                })
                .then((error) => {
                    console.log(error);
                });
        },
        //每一行的数据
        ClickAppVersionRow(row) {
            if (row != undefined) {
                this.cur_build_row.createTime = row.createTime
                this.cur_build_row.branchOrTag = row.branch
                this.cur_build_row.commitId = row.commitId
                this.cur_build_row.createdBy = row.createBy
                this.cur_build_row.duration = row.duration
                this.cur_build_row.buildStatus = row.status
                this.cur_build_row.pipilineUUid = row.pipelineUuid
                this.cur_build_row.buildUuid = row.buildUuid
                this.cur_build_row.branch = row.branch
		            this.testingObj.interfaceVisible = false
		            this.testingObj.performanceVisible = false
                this.loadBuildDetail();
            }
        },
        //加载应用信息
        loadApplicationInfo() {
            let AppDataUrl = this.GLOBAL.baseUrl + "/app/detail/" + this.appId;
            this.axios({
                url: AppDataUrl,
                method: "GET",
            }).then((response) => {
                const {
                    code,
                    data
                } = response.data
                if (code == 200) {
                    this.app = data
                    this.cur_build_row.buildLanguage = getUseLanguageName(data.useLanguage).toUpperCase()
                    this.buildBranchTagOptions();
                } else {
                    this.$message.error("应用信息加载失败")
                }
            }).catch(err => {
                this.$message.error("应用信息加载失败")
                console.log(err)
            })
        },

        handleChangeTagBranch(e) {
            this.getGitBranchList();
        },
        /**
         * 获取分支tag
         */
        getGitBranchList() {
            if (
                this.app.gitRepoUrl.indexOf("http://") > -1 ||
                this.app.gitRepoUrl.indexOf("https://") > -1
            ) {
                if (this.appDetail != null && this.appDetail.repoType == 5) {
                    this.axios({
                            method: "GET",
                            url: this.GLOBAL.baseUrl +
                                "/pipeline-conf/branchs/svn/" +
                                this.app.id,
                        })
                        .then((response) => {
                            if (response.status == 200) {
                                this.gitBranchList = response.data.data.branch || [];
                                this.gitTagList = response.data.data.tag;
                            }
                        })
                        .catch((error) => {
                            console.log("Error getSVNBranchList", error);
                        });
                } else {
                    this.axios({
                            method: "GET",
                            url: this.GLOBAL.baseUrl + "/pipeline-conf/branchs",
                            params: {
                                appId: this.app.id,
                            },
                        })
                        .then((response) => {
                            if (response.status == 200) {
                                this.gitBranchList = response.data.data.branch || [];
                                this.gitTagList = response.data.data.tag;
                            }
                        })
                        .catch((error) => {
                            console.log("Error getGitBranchList", error);
                        });
                }
            } else {
                this.axios({
                        method: "GET",
                        url: this.GLOBAL.pipeline_tag + "/pipelineConf/branch-list",
                        params: {
                            gitUrl: this.app.gitRepoUrl,
                        },
                    })
                    .then((response) => {
                        if (response.status == 200) {
                            this.gitBranchList = response.data.branch;
                            this.gitTagList = response.data.tag;
                        }
                    })
                    .catch((error) => {
                        console.log("Error getGitBranchList", error);
                    });
            }
        },

        //加载构建流水线步骤
        loadPipelineSteps() {
            var that = this;
            const requestUrl = this.GLOBAL.baseUrl + "/pipeline-design/loadBuildSteps/" + this.pipline_uuid
            this.axios({
                url: requestUrl,
                method: "GET"
            }).then(response => {
                const {
                    code,
                    data
                } = response.data;
                if (code === 200) {
                    that.piplineSteps = data;
                } else {
                    that.$message.error("加载pipline失败")
                }

            }).catch(err => {
                this.$message.error("加载pipline失败")
                console.log(err)
            })
        },
        goBack() {
            window.history.back();

        },
        /**
         * 加载构建详情
         */
        loadBuildDetail() {
            var that = this;
		        console.log(this.cur_build_row.buildUuid,'=======rrrrrrrrrrrrr=')
            if (this.cur_build_row.buildUuid == undefined || this.cur_build_row.buildUuid == '') {
                return;
            }
            const requestUrl = this.GLOBAL.baseUrl + "/pipeline-build/getBuildDetail/" + this.cur_build_row.buildUuid
            this.axios({
                url: requestUrl,
                method: "GET"
            }).then(response => {
                const {
                    code,
                    data
                } = response.data;
                if (code === 200) {
                    var details = data.detail;
                    this.logs = data.log;
                    this.activeIndex = data.activeIndex;
                    if (details != undefined && details.length > 0) {
                        this.piplineSteps = []
                    }
                    for (var i = 0; i < details.length; i++) {
                        var detail = details[i];
                        var step = {
                            name: detail.stepName,
                            icon_status: detail.stepIcon == 'el-icon-error' ? "error" : "",
                            icon: detail.stepIcon,
                            code_des: `${detail.stepMessage?detail.stepMessage:''}${detail.stepDutation?',耗时'+detail.stepDutation:''}`,
                        }
                        this.piplineSteps.push(step)
                        if (detail.stepKey == 'extra-sonar' || detail.stepKey == 'extra-testing') {
                            this.isResultIsReported = true;
                        }
												console.log(this.isResultIsReported,'=========')
												// 自动化测试
												if (detail.stepKey == 'extra-testing') {
														if (detail.stepStatus == 'SUCCESS'){
																if (JSON.parse(detail.stepParamters).taskType == '1'){
																		this.testingObj = JSON.parse(detail.stepResult)
																		this.testingObj.interfaceVisible = true
																}else{
																		this.testingObj = JSON.parse(detail.stepResult)
																		this.testingObj.performanceVisible = true
																}
														}else{
																this.testingObj.interfaceVisible = false
																this.testingObj.performanceVisible = false
														}
														
												}
                    }
                } else {
                    // that.$message.error("加载数据失败")
                }

            }).catch(err => {
                // this.$message.error("加载数据失败")
                console.log(err)
            })
        },
        loadBuildHistory() {
            var that = this;
            this.axios({
                url: this.GLOBAL.baseUrl + `/pipeline-build/list/${this.appId}/${this.page}/${this.limit}/${this.pipline_uuid}`,
                method: "get",
            }).then((response) => {
                const {
                    data,
                    code
                } = response.data;
                if (code == 200) {
                    that.total = data.total;
                    that.histroyList = data.list
                    if (this.histroyList.length > 0 && that.$refs.singleTable != undefined) {
                        that.$refs.singleTable.setCurrentRow(that.histroyList[0]);
                    }
                }

            }).catch(err => {
                this.$message.error("加载构建历史失败")
                console.log(err)
            })
        },
        buildBranchTagOptions() {
            this.getGitBranchList();
            this.branchTagOptions[0].children = []
            this.branchTagOptions[1].children = []
            for (var i = 0; i < this.gitBranchList.length; i++) {

                var branch = {
                    label: this.gitBranchList[i],
                    value: this.gitBranchList[i],
                }
                this.branchTagOptions[0].children.push(branch)
            }
            for (var i = 0; i < this.gitTagList.length; i++) {
                var tag = {
                    label: this.gitTagList[i],
                    value: this.gitTagList[i],
                }
                this.branchTagOptions[1].children.push(tag)
            }
            //兜底方案
            if (this.branchTagOptions[0].children.length == 0) {
                var branch = {
                    label: "master",
                    value: "master",
                }
                this.branchTagOptions[0].children.push(branch)
            }
        },
        showStartNewPipeline() {
            this.openDialog = true;
            this.buildBranchTagOptions();
        },
        onStart() {
            if (this.form.branch.length != 2) {
                this.$message.error("构建分支/Tag没有指定")
                return
            }
            var postData = {
                pipelineUuid: this.pipline_uuid,
                repositoryUrl: this.app.gitRepoUrl,
                branch: this.form.branch[1],
                appId: this.appId,
                appCode: this.appCode,
                tenantId: "",
                createBy: "",
            }
            this.axios({
                url: this.GLOBAL.baseUrl + "/pipeline-build/start",
                method: "POST",
                data: postData
            }).then(res => {
                const {
                    data,
                    code
                } = res.data
                this.openDialog = false
                if (code == 200) {
                    this.queryVersionStatus();
                } else {

                }

            }).catch(err => {
                this.openDialog = false
                console.log(err)
            })

        },
        // 查询版本状态
        queryVersionStatus() {
            this.loadBuildHistory();
            this.loadBuildDetail()

        },
        goCodeUrl(row) {
            if (row.commitId != undefined && row.commitId != '') {
                var url = this.app.gitRepoUrl.replace(".git", "/-/commit/") + row.commitId
                window.open(url);
            } else {
                window.open(this.app.gitRepoUrl);
            }
        },
        goPipelineDesign() {
            var that = this;
            this.$router.push({
                path: "/cicd/app/pipline-config-design",
                query: {
                    appId: that.appId,
                    appCode: that.appCode,
                    groupIdStr: this.app.groupIdStr,
                    pipline_uuid: this.pipline_uuid,
                    useLanguage: this.app.useLanguage
                },
            });
        },
        refreshPageData() {
            this.loadBuildHistory();
            this.loadBuildDetail();
            this.$message.success("数据已刷新");
        }
    }
}
</script>

<style lang="scss" scoped>
.main {
    height: calc(100% - 80px);
}

.back-box {
    font-size: 14px;
    color: #343a40;
    cursor: pointer;
}

.back-box .el-icon-arrow-left {
    margin-right: 8px;
    font-size: 16px;
}

.left-panel {
    /* flex: 2; */
    padding: 24px;
    background: white;
    width: calc(100vw - 1000px);
    margin-right: 24px;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}

.left-panel.panel-isCollapse {
    width: calc(100vw - 748px);
}

.left-panel .header {
    margin-bottom: 25px;
}

.left-panel .table-box {
    flex: 1;
    overflow-y: auto;
}

.right-panel {
    height: 100%;
    flex-shrink: 0;
    flex: 1;
    overflow-y: auto;
}

.right-panel .box {
    flex: 1;
    padding: 24px;
    background: white;
    margin-bottom: 24px;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
}

.right-panel .version-step-box {
    background: #f8f9fa;
    border-radius: 4px;
    height: 100px;
    display: flex;
    align-items: center;
}

.right-panel .row {
    margin-bottom: 20px;
}

.title-box {
    width: 100%;
    color: #343a40;
    font-size: 14px;
}

.title-box .bar {
    width: 4px;
    height: 14px;
    background: $primary;
    margin-right: 8px;
}

.right-panel .refresh-box {
    font-size: 14px;
    color: $primary;
    cursor: pointer;
    flex-shrink: 0;
}

.right-panel .item {
    margin-bottom: 20px;
}

.right-panel .item .label {
    color: #999;
    font-size: 14px;
    width: 70px;
    margin-right: 15px;
    flex-shrink: 0;
}

.right-panel .item .text {
    color: #000;
    font-size: 14px;
    word-break: break-all;
}

.right-panel .step-box {
    margin-bottom: 35px;
}

.self-label .el-form-item__label,
.self-label1 .el-form-item__label {
    width: 138px !important;
}

.self-label1 {
    display: flex;
}

.self-label1 .el-form-item__content {
    margin-left: 0 !important;
    flex: 1;
}

.footer {
    margin-top: 40px;
}

.form-box {
    display: flex;
    flex-wrap: wrap;
}

.form-box .el-form-item {
    margin-right: 24px;
}

.k-dialog .el-collapse {
    border-top: 0;
}

.k-dialog .panel {
    padding: 10px 20px 0 20px;
    background: #ffffff;
    box-shadow: 0px 2px 14px 0px rgba(51, 51, 51, 0.1);
}

.k-dialog .btn-box {
    color: #0f55fa;
    font-size: 14px;
    margin-left: 38px;
    cursor: pointer;
    line-height: 50px;
}

.k-dialog .btn-box .el-icon-circle-plus-outline {
    margin-right: 8px;
}

.k-dialog .el-dialog__body {
    padding-top: 10px;
}

.k-dialog .el-link.el-link--danger {
    line-height: 40px;
}

.line {
    width: 100%;
    height: 1px;
    background: #eee;
}

.step-box {
    margin-top: 24px;
    margin-bottom: 24px;
}

.k-dialog .el-steps {
    width: 600px;
    margin: 0 auto;
}

.k-dialog .el-card__header {
    border-bottom: none;
    padding-bottom: 0;
}

.el-button--text {
    color: #0f55fa;
}

.info-table .el-tag {
    cursor: pointer;
    max-width: 90%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}

.dialog-footer {
    text-align: center;
}

.log-text {
    word-wrap: break-word;
    background: white;
    padding: 5px;
    color: #333;
}

.log-text.error {
    color: red;
}

.log-text.warn {
    color: #e6a23c;
}

.main .box-wrap {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background: #f8f9fa;
    border-radius: 4px;
    padding-bottom: 0;
}

.disable-plain {
    width: 100%;
    filter: blur(10px);
    -webkit-filter: blur(10px);
    -moz-filter: blur(10px);
    -ms-filter: blur(10px);
    -o-filter: blur(10px);
}

.log_content {
    height: 600px;
    width: 100%;
    background-color: black;
}

.log_content-header {
    width: 100%;
    height: 30px;
    color: white;
    border-bottom: 1px solid white;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding-left: 5px;
}

.log_content-center {
    height: 600px;
    overflow: auto;
    margin: 0px;
    padding-top: 5px;
    padding-left: 5px;
    display: flex;
    flex-direction: column;
    color: white;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: 1.5em;
    padding-bottom: 40px;
}
</style>
